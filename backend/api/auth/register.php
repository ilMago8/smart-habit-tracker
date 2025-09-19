<?php
// Add CORS headers
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// POST /api/auth/register - Register a new user
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit;
}

// Include database connection
require_once '../../config/database.php';

try {
    // Get JSON input
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Invalid JSON input']);
        exit;
    }
    
    // Extract and validate input data
    $name = trim($input['name'] ?? '');
    $email = trim($input['email'] ?? '');
    $password = $input['password'] ?? '';
    $bio = trim($input['bio'] ?? '');
    $goals = trim($input['goals'] ?? '');
    
    // Validation
    $errors = [];
    
    if (empty($name) || strlen($name) < 2) {
        $errors[] = 'Name must be at least 2 characters long';
    }
    
    if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = 'Please enter a valid email address';
    }
    
    if (empty($password) || strlen($password) < 6) {
        $errors[] = 'Password must be at least 6 characters long';
    }
    
    if (!empty($errors)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => implode('. ', $errors)]);
        exit;
    }
    
    // Check if user already exists
    $checkStmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
    $checkStmt->execute([$email]);
    
    if ($checkStmt->fetch()) {
        http_response_code(409);
        echo json_encode(['success' => false, 'error' => 'An account with this email already exists']);
        exit;
    }
    
    // Hash password securely
    $passwordHash = password_hash($password, PASSWORD_DEFAULT);
    
    // Insert new user
    $insertStmt = $pdo->prepare("
        INSERT INTO users (name, email, password_hash, bio, goals) 
        VALUES (?, ?, ?, ?, ?)
    ");
    
    $insertStmt->execute([$name, $email, $passwordHash, $bio, $goals]);
    $userId = $pdo->lastInsertId();
    
    // Get the created user (without password hash)
    $userStmt = $pdo->prepare("
        SELECT id, name, email, bio, goals, created_at 
        FROM users 
        WHERE id = ?
    ");
    $userStmt->execute([$userId]);
    $user = $userStmt->fetch();
    
    // Return success response
    http_response_code(201);
    echo json_encode([
        'success' => true, 
        'message' => 'User registered successfully',
        'user' => $user
    ]);
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false, 
        'error' => 'Database error occurred',
        'debug' => $e->getMessage()
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false, 
        'error' => 'Server error occurred',
        'debug' => $e->getMessage()
    ]);
}
?>