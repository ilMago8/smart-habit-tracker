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

// POST /api/habits/manage - Manage habits (delete, reset, etc.)

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
if (!isset($input['action']) || empty($input['action'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Action is required']);
    exit;
}

if (!isset($input['user_id']) || empty($input['user_id'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'User ID is required']);
    exit;
}

$action = $input['action'];
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
    
    switch ($action) {
        case 'delete':
            if (!isset($input['habit_id']) || empty($input['habit_id'])) {
                http_response_code(400);
                echo json_encode(['success' => false, 'error' => 'Habit ID is required for delete action']);
                exit;
            }
            
            $habitId = $input['habit_id'];
            
            // Verify that the habit belongs to the user
            $stmt = $pdo->prepare("SELECT id FROM habits WHERE id = ? AND user_id = ?");
            $stmt->execute([$habitId, $userId]);
            
            if (!$stmt->fetch()) {
                http_response_code(404);
                echo json_encode(['success' => false, 'error' => 'Habit not found or access denied']);
                exit;
            }
            
            // Delete the habit (this will also delete related habit_checks due to CASCADE)
            $stmt = $pdo->prepare("DELETE FROM habits WHERE id = ? AND user_id = ?");
            $stmt->execute([$habitId, $userId]);
            
            if ($stmt->rowCount() > 0) {
                echo json_encode(['success' => true, 'message' => 'Habit deleted successfully']);
            } else {
                http_response_code(500);
                echo json_encode(['success' => false, 'error' => 'Failed to delete habit']);
            }
            break;
            
        case 'reset':
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
            break;
            
        default:
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Invalid action. Supported actions: delete, reset']);
            break;
    }
    
} catch (PDOException $e) {
    error_log("Manage habits error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Server error managing habit']);
}
?>