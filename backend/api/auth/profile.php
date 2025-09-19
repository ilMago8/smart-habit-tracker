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

// Handle both GET and PUT requests for profile
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // GET /api/auth/profile - Get user profile
    
    // Include database connection
    require_once '../../config/database.php';
    
    // Get user_id from query parameters
    $userId = $_GET['user_id'] ?? null;
    
    if (!$userId) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'User ID is required']);
        exit;
    }
    
    try {
        // Get user data
        $stmt = $pdo->prepare("SELECT id, name, email, bio, goals, created_at FROM users WHERE id = ?");
        $stmt->execute([$userId]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$user) {
            http_response_code(404);
            echo json_encode(['success' => false, 'error' => 'User not found']);
            exit;
        }
        
        echo json_encode([
            'success' => true,
            'user' => [
                'id' => $user['id'],
                'name' => $user['name'],
                'email' => $user['email'],
                'bio' => $user['bio'] ?? '',
                'goals' => $user['goals'] ?? '',
                'created_at' => $user['created_at']
            ]
        ]);
        
    } catch (PDOException $e) {
        error_log("Profile get error: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'Server error getting profile']);
    }
    
} elseif ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    // PUT /api/auth/profile - Update user profile
    
    // Include database connection
    require_once '../../config/database.php';
    
    // Get input data
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Invalid JSON data']);
        exit;
    }
    
    // Validate required fields
    if (empty($input['id'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'User ID is required']);
        exit;
    }
    
    $userId = $input['id'];
    $name = trim($input['name'] ?? '');
    $bio = trim($input['bio'] ?? '');
    $goals = trim($input['goals'] ?? '');
    
    // Validation
    if (!empty($name) && strlen($name) < 2) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Name must contain at least 2 characters']);
        exit;
    }
    
    try {
        // Check if user exists
        $stmt = $pdo->prepare("SELECT id FROM users WHERE id = ?");
        $stmt->execute([$userId]);
        if (!$stmt->fetch()) {
            http_response_code(404);
            echo json_encode(['success' => false, 'error' => 'User not found']);
            exit;
        }
        
        // Build update query dynamically
        $updateFields = [];
        $updateValues = [];
        
        if (!empty($name)) {
            $updateFields[] = "name = ?";
            $updateValues[] = $name;
        }
        
        $updateFields[] = "bio = ?";
        $updateValues[] = $bio;
        
        $updateFields[] = "goals = ?";
        $updateValues[] = $goals;
        
        $updateValues[] = $userId; // for WHERE clause
        
        // Update user
        $sql = "UPDATE users SET " . implode(", ", $updateFields) . " WHERE id = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute($updateValues);
        
        // Get updated user data
        $stmt = $pdo->prepare("SELECT id, name, email, bio, goals, created_at FROM users WHERE id = ?");
        $stmt->execute([$userId]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        
        echo json_encode([
            'success' => true,
            'message' => 'Profile updated successfully',
            'user' => [
                'id' => $user['id'],
                'name' => $user['name'],
                'email' => $user['email'],
                'bio' => $user['bio'] ?? '',
                'goals' => $user['goals'] ?? '',
                'created_at' => $user['created_at']
            ]
        ]);
        
    } catch (PDOException $e) {
        error_log("Profile update error: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'Server error updating profile']);
    }
    
} else {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
}
?>
