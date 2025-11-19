<?php
// Add CORS headers
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: PUT, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// PUT /api/habits/update - Update an existing habit

// Include database connection
if (file_exists('../../config/database.php')) {
    require_once '../../config/database.php';
} else {
    require_once __DIR__ . '/../../config/database.php';
}

if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
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

if (!isset($input['habit_id']) || empty($input['habit_id'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Habit ID is required']);
    exit;
}

$userId = $input['user_id'];
$habitId = $input['habit_id'];

try {
    // Verify that the habit belongs to the user
    $stmt = $pdo->prepare("SELECT id FROM habits WHERE id = ? AND user_id = ?");
    $stmt->execute([$habitId, $userId]);
    
    if (!$stmt->fetch()) {
        http_response_code(404);
        echo json_encode(['success' => false, 'error' => 'Habit not found or access denied']);
        exit;
    }
    
    // Build update query dynamically based on provided fields
    $updates = [];
    $params = [];
    
    if (isset($input['name']) && !empty($input['name'])) {
        $updates[] = "name = ?";
        $params[] = $input['name'];
    }
    
    if (isset($input['color']) && !empty($input['color'])) {
        $updates[] = "color = ?";
        $params[] = $input['color'];
    }
    
    if (isset($input['target_frequency']) && is_numeric($input['target_frequency'])) {
        $updates[] = "target_frequency = ?";
        $params[] = intval($input['target_frequency']);
    }
    
    if (empty($updates)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'No fields to update']);
        exit;
    }
    
    // Add habit_id and user_id to params
    $params[] = $habitId;
    $params[] = $userId;
    
    // Execute update
    $sql = "UPDATE habits SET " . implode(", ", $updates) . " WHERE id = ? AND user_id = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    
    if ($stmt->rowCount() > 0) {
        // Fetch updated habit
        $stmt = $pdo->prepare("SELECT * FROM habits WHERE id = ? AND user_id = ?");
        $stmt->execute([$habitId, $userId]);
        $updatedHabit = $stmt->fetch();
        
        echo json_encode([
            'success' => true, 
            'message' => 'Habit updated successfully',
            'habit' => $updatedHabit
        ]);
    } else {
        // No rows affected could mean no changes or habit not found
        http_response_code(200);
        echo json_encode(['success' => true, 'message' => 'No changes made']);
    }
    
} catch (PDOException $e) {
    error_log("Update habit error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Server error updating habit']);
}
?>
