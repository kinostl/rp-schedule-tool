<?php

namespace Tqdev\PhpCrudApi;

use League\OAuth2\Client\Provider\AbstractProvider;
use League\OAuth2\Client\Provider\GenericProvider;
use Tqdev\PhpCrudApi\Api;
use Tqdev\PhpCrudApi\Config;
use Tqdev\PhpCrudApi\RequestFactory;
use Tqdev\PhpCrudApi\ResponseUtils;
use Tqdev\PhpCrudApi\RequestUtils;
use Tqdev\PhpCrudApi\Controller\JsonResponder;
use Tqdev\PhpCrudApi\Record\ErrorCode;

require __DIR__.'/../vendor/autoload.php';

$request = RequestFactory::fromGlobals();
$path = RequestUtils::getPathSegment($request, 1);
$method = $request->getMethod();
$responder = new JsonResponder();

session_start();

if (
    $path == 'login'
    || $path == 'logout'
    || $path == 'me'
) {
    if ($method == 'GET' && $path == 'logout') {
        $_SESSION = array();
        $response = $responder->success([
            'code'=>'200',
            'message'=>'Logout successful'
        ]);
    } elseif ($method == 'GET' && $path == 'login') {
        $_SESSION = array();
        $provider = new GenericProvider([
            'clientId' => '617436016143499284',
            'clientSecret' => 'nRJYD36e6z87tZ9eMCeYVB3fHQpzDnzi',
            'redirectUri' => 'http://localhost:8080/login',
            'urlAuthorize'            => 'https://discordapp.com/api/oauth2/authorize',
            'urlAccessToken'          => 'https://discordapp.com/api/oauth2/token',
            'urlResourceOwnerDetails' => 'https://discordapp.com/api/users/@me',
            'scopeSeparator' => ' '
        ]);

        if (!isset($_GET['code'])) {
            // Step 1. Get authorization code
            $authUrl = $provider->getAuthorizationUrl([
                'scope' => ['identify', 'guilds']
            ]);
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
                $_SESSION['user'] = $provider->getParsedResponse($user);
                $_SESSION['servers'] = $provider->getParsedResponse($servers);
                header('Location: http://localhost:8080/me');
                exit('Redirecting to Webapp Home Page');
            } catch (Exception $e) {
                exit('Failed to get user details');
            }
        }
    } elseif ($method == 'GET' && $path == 'me') {
        if (isset($_SESSION['user'])) {
            $user = $_SESSION['user'];
            $servers = $_SESSION['servers'];
            $response = $responder->success([
                "user"=>$user,
                "servers"=>$servers
            ]);
        } else {
            $response = $responder->error(ErrorCode::AUTHENTICATION_REQUIRED, '');
        }
    } else {
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
        $response = $responder->error(ErrorCode::AUTHENTICATION_REQUIRED, '');
    }
}
ResponseUtils::output($response);