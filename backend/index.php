<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once 'config/database.php';

$request_uri = $_SERVER['REQUEST_URI'];
$request_method = $_SERVER['REQUEST_METHOD'];
$path = parse_url($request_uri, PHP_URL_PATH);

// Simple router
switch ($path) {
    case '/api/habits':
        if ($request_method === 'GET') {
            include 'api/habits/get.php';
        } elseif ($request_method === 'POST') {
            include 'api/habits/create.php';
        } elseif ($request_method === 'DELETE') {
            include 'api/habits/delete.php';
        }
        break;
    
    case '/api/habits/check':
        if ($request_method === 'POST') {
            include 'api/habits/check.php';
        }
        break;
    
    case '/api/habits/stats':
        if ($request_method === 'GET') {
            include 'api/habits/stats.php';
        }
        break;
    
    case '/api/habits/reset':
        if ($request_method === 'POST') {
            include 'api/habits/reset.php';
        }
        break;
    
    case '/api/habits/manage':
        if ($request_method === 'POST') {
            include 'api/habits/manage.php';
        }
        break;
    
    default:
        http_response_code(404);
        echo json_encode(['error' => 'Endpoint not found']);
        break;
}
?>
