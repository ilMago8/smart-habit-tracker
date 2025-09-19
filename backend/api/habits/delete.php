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

// DELETE /api/habits - Delete a habit for a specific user

// Include database connection
if (file_exists('../../config/database.php')) {
    require_once '../../config/database.php';
} else {
    require_once __DIR__ . '/../../config/database.php';
}

if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
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
if (!isset($input['habit_id']) || empty($input['habit_id'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Habit ID is required']);
    exit;
}

if (!isset($input['user_id']) || empty($input['user_id'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'User ID is required']);
    exit;
}

$habitId = $input['habit_id'];
$userId = $input['user_id'];

try {
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
    
} catch (PDOException $e) {
    error_log("Delete habit error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Server error deleting habit']);
}
?>