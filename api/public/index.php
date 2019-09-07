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

use DI\Container;

require __DIR__ . '/../vendor/autoload.php';

$container = new Container();

$container->set('provider', function () {
    $provider = new GenericProvider([
        'clientId' => '617436016143499284',
        'clientSecret' => 'nRJYD36e6z87tZ9eMCeYVB3fHQpzDnzi',
        'redirectUri' => 'http://localhost:8080/login',
        'urlAuthorize'            => 'https://discordapp.com/api/oauth2/authorize',
        'urlAccessToken'          => 'https://discordapp.com/api/oauth2/token',
        'urlResourceOwnerDetails' => 'https://discordapp.com/api/users/@me',
        'scopeSeparator' => ' '
    ]);
    return $provider;
});

$container->set('auth_db', function () {
    $capsule = new \Illuminate\Database\Capsule\Manager;
    $capsule->addConnection([
        'driver' => 'mysql',
        'host' => 'localhost',
        'database' => 'rp_schedule_tool_auth',
        'username' => 'slim',
        'password' => 'password',
        'charset'   => 'utf8',
        'collation' => 'utf8_unicode_ci',
        'prefix'    => '',
    ]);

    $capsule->setAsGlobal();
    $capsule->bootEloquent();

    return $capsule;
});

$container->set('publicKey', function () {
    $publicKey = <<<EOD
-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC8kGa1pSjbSYZVebtTRBLxBz5H
4i2p/llLCrEeQhta5kaQu/RnvuER4W8oDH3+3iuIYW4VQAzyqFpwuzjkDI+17t5t
0tyazyZ8JXw+KgXTxldMPEL95+qVhgXvwtihXC1c5oGbRlEDvDF6Sa53rcFVsYJ4
ehde/zUxo6UvS7UrBQIDAQAB
-----END PUBLIC KEY-----
EOD;

    return $publicKey;
});


$container->set('privateKey', function () {
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
    return $privateKey;
});

AppFactory::setContainer($container);
$app = AppFactory::create();

$app->any('/api[/{params:.*}]', function (Request $request, Response $response, $args) {
    $config = new Config([
        'username' => 'slim',
        'password' => 'password',
        'database' => 'rp_schedule_tool',
        'basePath' => '/api',
        'middlewares' => 'jwtAuth, cors, multiTenancy',
        'jwtAuth.mode' => 'optional',
        'jwtAuth.secret' => $this->get('publicKey'),
        'jwtAuth.leeway' => 0,
        'jwtAuth.ttl' => 604800,
        'multiTenancy.handler' => function ($operation, $tableName) {
            $userId = $_SESSION['claims']['UserId'];
            return ['UserId' => $userId];
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
    $provider = $this->get('provider');

    $tokens = $this->get('auth_db')->table('tokens');

    if ($request->hasHeader('X-Authorization')) {
        $provider = $this->get('provider');
        $code = $request->getHeaderLine('X-Authorization');
        $code = substr($code, 7);
        $jwt = JWT::decode($code, $this->get('publicKey'), ['RS256']);
        $jwt = (array) $jwt;
        $UserId = $jwt['UserId'];
        $token = $tokens->where('UserId',$UserId)->first();
        if (time() >= $token->expires_on) {
            $new_token = $provider->getAccessToken('refresh_token', [
                'refresh_token' => $token->refresh_token
            ]);

            $tokens->updateOrInsert(
                ['UserId' => $UserId],
                [
                    'expires_on' => time() + $new_token->getExpires(),
                    'refresh_token' => $new_token->getRefreshToken(),
                    'access_token' => $new_token
                ]
            );
        }
    } else {
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
            $expires_on = time() + $token->getExpires();
            // Step 3. Set the session user to the user's profile with the provided token
            try {
                $user = $provider->getAuthenticatedRequest(
                    'GET',
                    'https://discordapp.com/api/users/@me',
                    $token
                );
                $user = $provider->getParsedResponse($user);

                $tokens->updateOrInsert(
                    ['UserId' => $user['id']],
                    [
                        'expires_on' => $expires_on,
                        'refresh_token' => $token->getRefreshToken(),
                        'access_token' => $token
                    ]
                );

                $jwt_token = [
                    "iss" => "localhost",
                    "aud" => "localhost",
                    "iat" => time(),
                    'expires_on' => $expires_on,
                    'UserId' => $user['id']
                ];

                $jwt = JWT::encode(
                    $jwt_token,
                    $this->get('privateKey'),
                    'RS256'
                );
                header('Location: http://localhost:3000/auth#' . $jwt);
                exit('Redirecting to Webapp Home Page');
            } catch (Exception $e) {
                exit('Failed to get user details'.$e->getMessage());
            }
        }
    }
});

$app->get('/me', function (Request $request, Response $response, $args) {
    $responder = new JsonResponder();
    if (!$request->hasHeader('X-Authorization')) {
        return $responder->error(ErrorCode::AUTHENTICATION_REQUIRED, '');
    }
    try {
        $provider = $this->get('provider');
        $publicKey = $this->get('publicKey');
        $code = $request->getHeaderLine('X-Authorization');
        $code = substr($code, 7);
        $jwt = JWT::decode($code, $publicKey, ['RS256']);
        $jwt = (array) $jwt;
        $UserId = $jwt['UserId'];
        $tokens = $this->get('auth_db')->table('tokens');
        $token = $tokens->where('UserId',$UserId)->value('access_token');

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
    } catch (Exception $e) {
        $response->getBody()->write(json_encode([
            "code" => $e->getCode(),
            "message" => $e->getMessage()
        ]));
        return $response->withHeader('Content-Type', 'application/json')
            ->withStatus(500);
    }
});

$app->map(['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], '/{routes:.+}', function ($request, $response) {
    throw new HttpNotFoundException($request);
});

$app->run();
