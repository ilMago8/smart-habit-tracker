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

// POST /api/auth/login - Authenticate user
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
    $email = trim($input['email'] ?? '');
    $password = $input['password'] ?? '';
    
    // Basic validation
    if (empty($email) || empty($password)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Email and password are required']);
        exit;
    }
    
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Please enter a valid email address']);
        exit;
    }
    
    // Find user by email
    $userStmt = $pdo->prepare("
        SELECT id, name, email, password_hash, bio, goals, created_at 
        FROM users 
        WHERE email = ?
    ");
    $userStmt->execute([$email]);
    $user = $userStmt->fetch();
    
    // Check if user exists and password is correct
    if (!$user) {
        http_response_code(401);
        echo json_encode(['success' => false, 'error' => 'No account found with this email. Please register first.']);
        exit;
    }
    
    if (!password_verify($password, $user['password_hash'])) {
        http_response_code(401);
        echo json_encode(['success' => false, 'error' => 'Incorrect password. Check your credentials and try again.']);
        exit;
    }
    
    // Remove password hash from response
    unset($user['password_hash']);
    
    // Generate a simple session token (in production, use JWT or proper session management)
    $token = bin2hex(random_bytes(32));
    
    // In a real application, you would store this token in a sessions table
    // For now, we'll just return it to the client
    
    // Return success response
    echo json_encode([
        'success' => true,
        'message' => 'Login successful',
        'user' => $user,
        'token' => $token
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