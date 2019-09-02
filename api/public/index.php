<?php

namespace Tqdev\PhpCrudApi;

use Tqdev\PhpCrudApi\Api;
use Tqdev\PhpCrudApi\Config;
use Tqdev\PhpCrudApi\RequestFactory;
use Tqdev\PhpCrudApi\ResponseUtils;
use Tqdev\PhpCrudApi\RequestUtils;
use Tqdev\PhpCrudApi\Controller\JsonResponder;
use Tqdev\PhpCrudApi\Record\ErrorCode;
use Wohali\OAuth2\Client\Provider\Discord;

require __DIR__.'/../vendor/autoload.php';

$request = RequestFactory::fromGlobals();
$path = RequestUtils::getPathSegment($request, 1);
$method = $request->getMethod();

if (
    $path == 'login'
    || $path == 'logout'
    || $path == 'me'
) {
    if ($method == 'GET' && $path == 'logout') {
        unset($_SESSION['user']);
    } elseif ($method == 'GET' && $path == 'login') {
        $provider = new Discord([
            'clientId' => '',
            'clientSecret' => '',
            'redirectUri' => '',
            'scope'=>['identify','guilds']
        ]);

        if (!isset($_GET['code'])) {
            // Step 1. Get authorization code
            $authUrl = $provider->getAuthorizationUrl();
            $_SESSION['oauth2state'] = $provider->getState();
            header('Location: ' . $authUrl);
            exit('Redirecting to Discord Auth Page');
            // Check given state against previously stored one to mitigate CSRF attack
        } elseif (empty($_GET['state']) || ($_GET['state'] !== $_SESSION['oauth2state'])) {
            unset($_SESSION['oauth2state']);
            exit('Invalid state');
        } else {
            // Step 2. Get an access token using the provided authorization code
            $token = $provider->getAccessToken('authorization_code', [
                'code' => $_GET['code']
            ]);
            // Step 3. Set the session user to the user's profile with the provided token
            try {
                unset($_SESSION['user']);
                unset($_SESSION['servers']);
                $user = $provider->getResourceOwner($token);
                $servers = $provider->getAuthenticatedRequest(
                    'GET',
                    'https://discordapp.com/api/users/@me/guilds',
                    $token
                );
                $_SESSION['user'] = $user;
                $_SESSION['servers'] = $servers;
                header('Location: http://localhost:3000/auth');
                exit('Redirecting to Webapp Home Page');
            } catch (Exception $e) {
                exit('Failed to get user details');
            }
        }
    } elseif ($method == 'GET' && $path == 'me') {
        if (isset($_SESSION['user'])) {
            $responder = new JsonResponder();
            $user = $_SESSION['user'];
            $servers = $_SESSION['servers'];
            $response = $responder->success([
                "user"=>$user,
                "servers"=>$servers
            ]);
        } else {
            $responder = new JsonResponder();
            $response = $responder->error(ErrorCode::AUTHENTICATION_REQUIRED, '');
        }
    } else {
        $responder = new JsonResponder();
        $response = $responder->error(ErrorCode::ROUTE_NOT_FOUND, '');
    }
} else {
    if ($method == 'GET' || isset($_SESSION['user'])) {
        $config = new Config([
            'username' => 'slim',
            'password' => 'password',
            'database' => 'rp_schedule_tool',
            'middlewares' => 'cors, multiTenancy',
            'multiTenancy.handler' => function ($operation, $tableName) {
                return ['UserId' => $_SESSION['user']['id']];
            },
        ]);
        $api = new Api($config);
        $response = $api->handle($request);
    } else {
        $responder = new JsonResponder();
        $response = $responder->error(ErrorCode::AUTHENTICATION_REQUIRED, '');
    }
}
ResponseUtils::output($response);