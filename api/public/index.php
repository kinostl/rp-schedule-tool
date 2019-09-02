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

$provider = new Discord([
    'clientId'=>'',
    'clientSecret'=>'',
    'redirectUri'=>'',
]);

$config = new Config([
    'username' => 'slim',
    'password' => 'password',
    'database' => 'rp_schedule_tool',
    'middlewares' => 'cors, multiTenancy',
    'multiTenancy.handler' => function ($operation, $tableName) {
        return ['UserId' => $_SESSION['user']];
    },
]);
$request = RequestFactory::fromGlobals();
$api = new Api($config);
$path = RequestUtils::getPathSegment($request, 1);
$method = $request->getMethod();
if (
    $path == 'login'
    || $path == 'logout'
    || $path == 'me'
) {
    if ($method == 'GET' && $path == 'login') {
        unset($_SESSION['user']);
    } elseif ($method == 'GET' && $path == 'login') {
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
                $user = $provider->getResourceOwner($token);
                $_SESSION['user'] = $user;
            } catch (Exception $e) {
                exit('Failed to get user details');
            }
        }
    } elseif ($method == 'GET' && $path == 'me') {
        if (isset($_SESSION['user'])) {
            $responder = new JsonResponder();
            $response = $responder->success($_SESSION['user']);
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
        $response = $api->handle($request);
    } else {
        $responder = new JsonResponder();
        $response = $responder->error(ErrorCode::AUTHENTICATION_REQUIRED, '');
    }
}
ResponseUtils::output($response);