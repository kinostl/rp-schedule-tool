<?php

declare(strict_types=1);

use Slim\App;
use Slim\Psr7\Request;
use Slim\Psr7\Response;

// Note these extra use statements:
use Tqdev\PhpCrudApi\Api;
use Tqdev\PhpCrudApi\Config;

return function (App $app) {
    $container = $app->getContainer();

    // Add this handler for PHP-CRUD-API:
    $app->any('/api[/{params:.*}]', function (
        Request $request,
        Response $response,
        array $args
    ) use ($container) {

        $config = new Config([
            'username' => 'slim',
            'password' => 'password',
            'database' => 'rp_schedule_tool',
            'basePath' => '/api',
        ]);
        $api = new Api($config);
        $response = $api->handle($request);
        return $response;
    });
};
