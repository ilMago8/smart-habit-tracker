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

// POST /api/habits/reset - Reset all progress for a specific user

// Include database connection
if (file_exists('../../config/database.php')) {
    require_once '../../config/database.php';
} else {
    require_once __DIR__ . '/../../config/database.php';
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Invalid JSON data']);
    exit;
}

// Validate required fields
if (!isset($input['user_id']) || empty($input['user_id'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'User ID is required']);
    exit;
}

$userId = $input['user_id'];

try {
    // Verify user exists
    $stmt = $pdo->prepare("SELECT id FROM users WHERE id = ?");
    $stmt->execute([$userId]);
    if (!$stmt->fetch()) {
        http_response_code(404);
        echo json_encode(['success' => false, 'error' => 'User not found']);
        exit;
    }
    
    // Delete all habit checks for the user (this resets all progress)
    $stmt = $pdo->prepare("DELETE hc FROM habit_checks hc 
                          INNER JOIN habits h ON hc.habit_id = h.id 
                          WHERE h.user_id = ?");
    $stmt->execute([$userId]);
    
    $deletedChecks = $stmt->rowCount();
    
    echo json_encode([
        'success' => true, 
        'message' => 'All progress reset successfully',
        'deleted_checks' => $deletedChecks
    ]);
    
} catch (PDOException $e) {
    error_log("Reset progress error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Server error resetting progress']);
}
?>