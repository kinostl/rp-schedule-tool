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

use DI\Container;
use Dotenv\Dotenv;

require __DIR__ . '/../vendor/autoload.php';

$dotenv = Dotenv::create(__DIR__."/..");
$dotenv->load();

$container = new Container();

$container->set('provider', function () {
    $provider = new GenericProvider([
        'clientId' => $_ENV['discord_id'],
        'clientSecret' => $_ENV['discord_secret'],
        'redirectUri' => $_ENV['my_uri']."/login",
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
        'username' => $_ENV['db_user'],
        'password' => $_ENV['db_pass'],
        'charset'   => 'utf8',
        'collation' => 'utf8_unicode_ci',
        'prefix'    => '',
    ]);

    $capsule->setAsGlobal();
    $capsule->bootEloquent();

    return $capsule;
});

$container->set('scheduler_db', function () {
    $capsule = new \Illuminate\Database\Capsule\Manager;
    $capsule->addConnection([
        'driver' => 'mysql',
        'host' => 'localhost',
        'database' => 'rp_schedule_tool',
        'username' => $_ENV['db_user'],
        'password' => $_ENV['db_pass'],
        'charset'   => 'utf8',
        'collation' => 'utf8_unicode_ci',
        'prefix'    => '',
    ]);

    $capsule->setAsGlobal();
    $capsule->bootEloquent();

    return $capsule;
});

$container->set('publicKey', function () {
    return $_ENV['public_key'];
});


$container->set('privateKey', function () {
    return $_ENV['private_key'];
});

AppFactory::setContainer($container);
$app = AppFactory::create();

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

$app->get('/api/records/me', function (Request $request, Response $response, $args) {
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
        $token = $tokens->where('UserId', $UserId)->value('access_token');

        $user = $provider->getAuthenticatedRequest(
            'GET',
            'https://discordapp.com/api/users/@me',
            $token
        );
        $user = $provider->getParsedResponse($user);
        $names = $this->get('scheduler_db')->table('names');
        $names->updateOrInsert(
            ['id' => $user['id']],
            ['name' => $user['username']]
        );

        return $responder->success($user);
    } catch (Exception $e) {
        $response->getBody()->write(json_encode([
            "code" => $e->getCode(),
            "message" => $e->getMessage()
        ]));
        return $response->withHeader('Content-Type', 'application/json')
            ->withStatus(500);
    }
});

$app->get('/api/records/servers', function (Request $request, Response $response, $args) {
    $responder = new JsonResponder();
    if (!$request->hasHeader('X-Authorization')) {
        return $responder->error(ErrorCode::AUTHENTICATION_REQUIRED, '');
    }
    $provider = $this->get('provider');
    $publicKey = $this->get('publicKey');
    $code = $request->getHeaderLine('X-Authorization');
    $code = substr($code, 7);
    $jwt = JWT::decode($code, $publicKey, ['RS256']);
    $jwt = (array) $jwt;
    $UserId = $jwt['UserId'];

    $servers_cache_table = $this->get('auth_db')->table('servers');
    $servers_cache = $servers_cache_table->where('UserId', $UserId)->first();
    if (time() <= $servers_cache->expires) {
        return $responder->success([
            "records" => json_decode($servers_cache->Servers)
        ]);
    }
    try {
        $tokens = $this->get('auth_db')->table('tokens');
        $token = $tokens->where('UserId', $UserId)->value('access_token');

        $servers = $provider->getAuthenticatedRequest(
            'GET',
            'https://discordapp.com/api/users/@me/guilds',
            $token
        );
        $servers = $provider->getParsedResponse($servers);
        $servers_cache_table->updateOrInsert(
            ['UserId' => $UserId],
            [
                'expires' => time() + 300,
                'Servers' => json_encode($servers)
            ]
        );
        $names = $this->get('scheduler_db')->table('names');
        $server_ids = array_column($servers, 'id');
        $new_entries = [];
        foreach ($servers as $server) {
            array_push($new_entries, [
                'id' => $server['id'],
                'name' => $server['name']
            ]);
        }
        $names->whereIn('id', $server_ids)->delete();
        $names->insert($new_entries);

        return $responder->success([
            "records" => $servers
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

$app->map(['POST', 'PUT', 'PATCH'], '/api/records/events', function (Request $request, Response $response, $args) {
    $responder = new JsonResponder();
    if (!$request->hasHeader('X-Authorization')) {
        return $responder->error(ErrorCode::AUTHENTICATION_REQUIRED, '');
    }

    try {
        $params = json_decode($request->getBody()->getContents());
        //This should get able to be getParsedBody() but whatever
        $publicKey = $this->get('publicKey');
        $code = $request->getHeaderLine('X-Authorization');
        $code = substr($code, 7);
        $jwt = JWT::decode($code, $publicKey, ['RS256']);
        $jwt = (array) $jwt;
        $UserId = $jwt['UserId'];
        $events = $this->get('scheduler_db')->table('events')->where([
            ['UserId', $UserId],
        ]);
        $events->delete();
        $events = $this->get('scheduler_db')->table('events');
        $new_entries=[];
        foreach ($params as $param) {
            $param = (array) $param;
            $param['UserId'] = $UserId;
            array_push($new_entries,$param);
        }
        $events->insert($new_entries);
        return $responder->success('');
    } catch (Exception $e) {
        $response->getBody()->write(json_encode([
            "code" => $e->getCode(),
            "message" => $e->getMessage()
        ]));
        return $response->withHeader('Content-Type', 'application/json')
            ->withStatus(500);
    }
});

$app->map(['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], '/api[/{params:.*}]', function (Request $request, Response $response, $args) {
    $config = new Config([
        'username' => 'slim',
        'password' => 'password',
        'database' => 'rp_schedule_tool',
        'basePath' => '/api',
        'middlewares' => 'jwtAuth, multiTenancy, customization',
        'jwtAuth.mode' => 'required',
        'jwtAuth.secret' => $this->get('publicKey'),
        'jwtAuth.leeway' => 5,
        'jwtAuth.ttl' => 604800,
        'multiTenancy.handler' => function ($operation, $tableName) {
            if ($operation != "read" && $operation != "list") {
                $userId = $_SESSION['claims']['UserId'];
                return ['UserId' => $userId];
            }
            return [];
        },
        'customization.beforeHandler' => function ($operation, $tableName, $request, $environment) {
            $paramString = $request->getUri()->getQuery();
            $paramString = str_replace("%40me", $_SESSION['claims']['UserId'], $paramString);
            if (empty($paramString) && $operation == "list") {
                $paramString = "filter=UserId,eq," . $_SESSION['claims']['UserId'];
            }
            $request = $request->withUri($request->getUri()->withQuery($paramString));
            return $request;
        }
    ]);
    $api = new Api($config);
    $response = $api->handle($request);
    return $response;
});

$app->get('/refresh', function (Request $request, Response $response, $args) {
    $responder = new JsonResponder();
    if (!$request->hasHeader('X-Authorization')) {
        return $responder->error(ErrorCode::AUTHENTICATION_REQUIRED, '');
    }
    $tokens = $this->get('auth_db')->table('tokens');
    $provider = $this->get('provider');
    $code = $request->getHeaderLine('X-Authorization');
    $code = substr($code, 7);
    $jwt = JWT::decode($code, $this->get('publicKey'), ['RS256']);
    $jwt = (array) $jwt;
    $UserId = $jwt['UserId'];
    $token = $tokens->where('UserId', $UserId)->first();
    if (time() >= $token->expires) {
        $new_token = $provider->getAccessToken('refresh_token', [
            'refresh_token' => $token->refresh_token
        ]);

        $tokens->updateOrInsert(
            ['UserId' => $UserId],
            [
                'expires' => time() + $new_token->getExpires(),
                'refresh_token' => $new_token->getRefreshToken(),
                'access_token' => $new_token
            ]
        );
        $token = $tokens->where('UserId', $UserId)->first();
    }
    $jwt_token = [
        "iss" => $_ENV['redirect_uri'],
        "aud" => $_ENV['redirect_uri'],
        "iat" => time(),
        'UserId' => $UserId
    ];

    $jwt = JWT::encode(
        $jwt_token,
        $this->get('privateKey'),
        'RS256'
    );
    $response->getBody()->write($jwt);
    return $response;
});

$app->get('/login', function (Request $request, Response $response, $args) {
    session_start();
    $params = $request->getQueryParams();
    $provider = $this->get('provider');

    $tokens = $this->get('auth_db')->table('tokens');
    $servers_cache_table = $this->get('auth_db')->table('servers');

    if (isset($params['error']) && $params['error'] == 'access_denied') {
        header('Location: '.$_ENV['client_url']);
        exit($params['error_description']);
    }

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
            $servers = $provider->getAuthenticatedRequest(
                'GET',
                'https://discordapp.com/api/users/@me/guilds',
                $token
            );
            $servers = $provider->getParsedResponse($servers);

            $tokens->updateOrInsert(
                ['UserId' => $user['id']],
                [
                    'expires' => $token->getExpires(),
                    'refresh_token' => $token->getRefreshToken(),
                    'access_token' => $token
                ]
            );

            $servers_cache_table->updateOrInsert(
                ['UserId' => $user['id']],
                [
                    'expires' => time() + 60,
                    'Servers' => json_encode($servers)
                ]
            );

            $names = $this->get('scheduler_db')->table('names');
            $server_ids = array_column($servers, 'id');
            array_push($server_ids, $user['id']);
            $new_entries = [
                [
                    'id' => $user['id'],
                    'name' => $user['username']
                ]
            ];
            foreach ($servers as $server) {
                array_push($new_entries, [
                    'id' => $server['id'],
                    'name' => $server['name']
                ]);
            }
            $names->whereIn('id', $server_ids)->delete();
            $names->insert($new_entries);

            $jwt_token = [
                "iss" => $_ENV['redirect_uri'],
                "aud" => $_ENV['redirect_uri'],
                "iat" => time(),
                'UserId' => $user['id']
            ];

            $jwt = JWT::encode(
                $jwt_token,
                $this->get('privateKey'),
                'RS256'
            );
            header('Location: '.$_ENV['client_url'].'/auth#' . $jwt);
            exit('Redirecting to Webapp Home Page');
        } catch (Exception $e) {
            exit('Failed to get user details' . $e->getMessage());
        }
    }
});



$app->map(['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], '/{routes:.+}', function ($request, $response) {
    $responder = new JsonResponder();
    return $responder->error(ErrorCode::ROUTE_NOT_FOUND, '');
});

$app->run();
