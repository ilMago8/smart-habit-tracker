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

// POST /api/habits - Create a new habit for a specific user

// Include database connection
require_once '../../config/database.php';

$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Invalid JSON input']);
    exit;
}

// Validate required fields
if (!isset($input['user_id']) || !is_numeric($input['user_id'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Valid user_id is required']);
    exit;
}

if (!isset($input['name']) || empty(trim($input['name']))) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Habit name is required']);
    exit;
}

try {
    // Verify user exists
    $userCheck = $pdo->prepare("SELECT id FROM users WHERE id = ?");
    $userCheck->execute([$input['user_id']]);
    
    if (!$userCheck->fetch()) {
        http_response_code(404);
        echo json_encode(['success' => false, 'error' => 'User not found']);
        exit;
    }
    
    $query = "INSERT INTO habits (user_id, name, description, color, icon, target_frequency) VALUES (?, ?, ?, ?, ?, ?)";
    $stmt = $pdo->prepare($query);
    $stmt->execute([
        $input['user_id'],
        trim($input['name']),
        $input['description'] ?? '',
        $input['color'] ?? '#007bff',
        $input['icon'] ?? '📋',
        $input['target_frequency'] ?? 7
    ]);
    
    $habitId = $pdo->lastInsertId();
    
    // Retrieve the newly created habit
    $query = "SELECT * FROM habits WHERE id = ?";
    $stmt = $pdo->prepare($query);
    $stmt->execute([$habitId]);
    $habit = $stmt->fetch();
    
    echo json_encode(['success' => true, 'data' => $habit]);
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>
