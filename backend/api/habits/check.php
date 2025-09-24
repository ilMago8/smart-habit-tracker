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

// POST /api/habits/check - Mark/remove daily check (user-specific)

// Include database connection
require_once '../../config/database.php';

$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Invalid JSON input']);
    exit;
}

if (!isset($input['habit_id']) || !isset($input['user_id'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'habit_id and user_id are required']);
    exit;
}

try {
    $habitId = $input['habit_id'];
    $userId = $input['user_id'];
    $checkDate = $input['date'] ?? date('Y-m-d');
    
    // Verify that the habit belongs to the user
    $habitCheck = $pdo->prepare("SELECT id FROM habits WHERE id = ? AND user_id = ?");
    $habitCheck->execute([$habitId, $userId]);
    
    if (!$habitCheck->fetch()) {
        http_response_code(404);
        echo json_encode(['success' => false, 'error' => 'Habit not found or does not belong to this user']);
        exit;
    }
    
    // Check if a check already exists for today
    $query = "SELECT id, completed FROM habit_checks WHERE habit_id = ? AND check_date = ?";
    $stmt = $pdo->prepare($query);
    $stmt->execute([$habitId, $checkDate]);
    $existingCheck = $stmt->fetch();
    
    if ($existingCheck) {
        // Toggle status
        $newStatus = $existingCheck['completed'] ? 0 : 1; // Convertire esplicitamente a 0 o 1
        $query = "UPDATE habit_checks SET completed = ? WHERE id = ?";
        $stmt = $pdo->prepare($query);
        $stmt->execute([$newStatus, $existingCheck['id']]);
        $completed = (bool)$newStatus;
    } else {
        // Create new check
        $query = "INSERT INTO habit_checks (habit_id, check_date, completed) VALUES (?, ?, 1)";
        $stmt = $pdo->prepare($query);
        $stmt->execute([$habitId, $checkDate]);
        $completed = true;
    }
    
    echo json_encode([
        'success' => true, 
        'data' => ['completed' => $completed, 'date' => $checkDate]
    ]);
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>
