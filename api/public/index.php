<?php
declare(strict_types=1);

use League\OAuth2\Client\Provider\GenericProvider;
use \Firebase\JWT\JWT;

use Tqdev\PhpCrudApi\Api;
use Tqdev\PhpCrudApi\Config;
use Tqdev\PhpCrudApi\Controller\JsonResponder;
use Tqdev\PhpCrudApi\Record\ErrorCode;

use Slim\Factory\AppFactory;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

use Slim\Exception\HttpNotFoundException;

require __DIR__.'/../vendor/autoload.php';

$app = AppFactory::create();
$container = $app->getContainer();

$app->any('/api[/{params:.*}]', function (Request $request, Response $response, $args) use ($container) {
    $publicKey = <<<EOD
-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC8kGa1pSjbSYZVebtTRBLxBz5H
4i2p/llLCrEeQhta5kaQu/RnvuER4W8oDH3+3iuIYW4VQAzyqFpwuzjkDI+17t5t
0tyazyZ8JXw+KgXTxldMPEL95+qVhgXvwtihXC1c5oGbRlEDvDF6Sa53rcFVsYJ4
ehde/zUxo6UvS7UrBQIDAQAB
-----END PUBLIC KEY-----
EOD;

    $config = new Config([
        'username' => 'slim',
        'password' => 'password',
        'database' => 'rp_schedule_tool',
        'middlewares' => 'jwtAuth, cors, multiTenancy',
        'jwtAuth.mode' => 'optional',
        'jwtAuth.secret' => $publicKey,
        'jwtAuth.leeway' => 1000000,
        'jwtAuth.ttl' => 1000000,
        'multiTenancy.handler' => function ($operation, $tableName) {
            return ['UserId' => $_SESSION['claims']['UserId']];
        },
    ]);
    $api = new Api($config);
    $response = $api->handle($request);
    return $response;
});

$app->options('/{routes:.+}', function ($request, $response, $args) {
    return $response;
});

$app->add(function ($request, $handler) {
    $response = $handler->handle($request);
    return $response
            ->withHeader('Access-Control-Allow-Origin', '*')
            ->withHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept, Origin, Authorization, X-Authorization')
            ->withHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
});

$app->get('/login', function (Request $request, Response $response, $args) {
    session_start();
    $params = $request->getQueryParams();
    $provider = new GenericProvider([
        'clientId' => '617436016143499284',
        'clientSecret' => 'nRJYD36e6z87tZ9eMCeYVB3fHQpzDnzi',
        'redirectUri' => 'http://localhost:8080/login',
        'urlAuthorize'            => 'https://discordapp.com/api/oauth2/authorize',
        'urlAccessToken'          => 'https://discordapp.com/api/oauth2/token',
        'urlResourceOwnerDetails' => 'https://discordapp.com/api/users/@me',
        'scopeSeparator' => ' '
    ]);

    $privateKey = <<<EOD
-----BEGIN RSA PRIVATE KEY-----
MIICXAIBAAKBgQC8kGa1pSjbSYZVebtTRBLxBz5H4i2p/llLCrEeQhta5kaQu/Rn
vuER4W8oDH3+3iuIYW4VQAzyqFpwuzjkDI+17t5t0tyazyZ8JXw+KgXTxldMPEL9
5+qVhgXvwtihXC1c5oGbRlEDvDF6Sa53rcFVsYJ4ehde/zUxo6UvS7UrBQIDAQAB
AoGAb/MXV46XxCFRxNuB8LyAtmLDgi/xRnTAlMHjSACddwkyKem8//8eZtw9fzxz
bWZ/1/doQOuHBGYZU8aDzzj59FZ78dyzNFoF91hbvZKkg+6wGyd/LrGVEB+Xre0J
Nil0GReM2AHDNZUYRv+HYJPIOrB0CRczLQsgFJ8K6aAD6F0CQQDzbpjYdx10qgK1
cP59UHiHjPZYC0loEsk7s+hUmT3QHerAQJMZWC11Qrn2N+ybwwNblDKv+s5qgMQ5
5tNoQ9IfAkEAxkyffU6ythpg/H0Ixe1I2rd0GbF05biIzO/i77Det3n4YsJVlDck
ZkcvY3SK2iRIL4c9yY6hlIhs+K9wXTtGWwJBAO9Dskl48mO7woPR9uD22jDpNSwe
k90OMepTjzSvlhjbfuPN1IdhqvSJTDychRwn1kIJ7LQZgQ8fVz9OCFZ/6qMCQGOb
qaGwHmUK6xzpUbbacnYrIM6nLSkXgOAwv7XXCojvY614ILTK3iXiLBOxPu5Eu13k
eUz9sHyD6vkgZzjtxXECQAkp4Xerf5TGfQXGXhxIX52yH+N2LtujCdkQZjXAsGdm
B2zNzvrlgRmgBrklMTrMYgm1NPcW+bRLGcwgW2PTvNM=
-----END RSA PRIVATE KEY-----
EOD;

    if (!isset($params['code'])) {
        // Step 1. Get authorization code
        $authUrl = $provider->getAuthorizationUrl([
            'scope' => ['identify', 'guilds']
        ]);
        $_SESSION['oauth2state'] = $provider->getState();
        header('Location: ' . $authUrl);
        exit('Redirecting to Discord Auth Page');
        // Check given state against previously stored one to mitigate CSRF attack
    } elseif (empty($params['state']) || ($params['state'] !== $_SESSION['oauth2state'])) {
        unset($_SESSION['oauth2state']);
        exit('Invalid state');
    } else {
        // Step 2. Get an access token using the provided authorization code
        $token = $provider->getAccessToken('authorization_code', [
            'code' => $params['code']
        ]);
        // Step 3. Set the session user to the user's profile with the provided token
        try {
            $user = $provider->getAuthenticatedRequest(
                'GET',
                'https://discordapp.com/api/users/@me',
                $token
            );
            $user = $provider->getParsedResponse($user);
            $jwt_token = [
                "iss" => "localhost",
                "aud" => "localhost",
                "iat" => time(),
                'refreshToken' => $token->getRefreshToken(),
                'UserId' => $user['id']
            ];
            //storing anything other than UserId in the JWT is massively unsafe. Token should be moved to the datastore.
            $jwt = JWT::encode(
                $jwt_token,
                $privateKey,
                'RS256'
            );
            header('Location: http://localhost:3000/auth#' . $jwt);
            exit('Redirecting to Webapp Home Page');
        } catch (Exception $e) {
            exit('Failed to get user details');
        }
    }
});

$app->get('/me', function (Request $request, Response $response, $args) {
    $responder = new JsonResponder();
    if(!$request->hasHeader('X-Authorization')){
        return $responder->error(ErrorCode::AUTHENTICATION_REQUIRED,'');
    }
    try{
        $provider = new GenericProvider([
            'clientId' => '617436016143499284',
            'clientSecret' => 'nRJYD36e6z87tZ9eMCeYVB3fHQpzDnzi',
            'redirectUri' => 'http://localhost:8080/login',
            'urlAuthorize'            => 'https://discordapp.com/api/oauth2/authorize',
            'urlAccessToken'          => 'https://discordapp.com/api/oauth2/token',
            'urlResourceOwnerDetails' => 'https://discordapp.com/api/users/@me',
            'scopeSeparator' => ' '
        ]);
        $publicKey = <<<EOD
-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC8kGa1pSjbSYZVebtTRBLxBz5H
4i2p/llLCrEeQhta5kaQu/RnvuER4W8oDH3+3iuIYW4VQAzyqFpwuzjkDI+17t5t
0tyazyZ8JXw+KgXTxldMPEL95+qVhgXvwtihXC1c5oGbRlEDvDF6Sa53rcFVsYJ4
ehde/zUxo6UvS7UrBQIDAQAB
-----END PUBLIC KEY-----
EOD;
        $code = $request->getHeaderLine('X-Authorization');
        $code = substr($code, 7);
        $jwt = JWT::decode($code, $publicKey, ['RS256']);
        $jwt = (array) $jwt;
        $token = $provider->getAccessToken('refresh_token', [
            'refresh_token' => $jwt['refreshToken']
        ]);
        $user = $provider->getAuthenticatedRequest(
            'GET',
            'https://discordapp.com/api/users/@me',
            $token
        );
        $servers = $provider->getAuthenticatedRequest(
            'GET',
            'https://discordapp.com/api/users/@me/guilds',
            $token
        );
        $user = $provider->getParsedResponse($user);
        $servers = $provider->getParsedResponse($servers);
        return $responder->success([
            "user" => $user,
            "servers" => $servers
        ]);
    }catch(Exception $e){
        $response->getBody()->write(json_encode([
            "code"=>$e->getCode(),
            "message"=>$e->getMessage()
        ]));
        return $response->withHeader('Content-Type', 'application/json')
          ->withStatus(500);
    }
});

$app->map(['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], '/{routes:.+}', function ($request, $response) {
    throw new HttpNotFoundException($request);
});

$app->run();