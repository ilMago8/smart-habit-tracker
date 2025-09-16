<?php
// POST /api/habits/check - Mark/remove daily check
$input = json_decode(file_get_contents('php://input'), true);

if (!isset($input['habit_id'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'habit_id required']);
    exit;
}

try {
    $habitId = $input['habit_id'];
    $checkDate = $input['date'] ?? date('Y-m-d');
    
    // Check if a check already exists for today
    $query = "SELECT id, completed FROM habit_checks WHERE habit_id = ? AND check_date = ?";
    $stmt = $pdo->prepare($query);
    $stmt->execute([$habitId, $checkDate]);
    $existingCheck = $stmt->fetch();
    
    if ($existingCheck) {
        // Toggle status
        $newStatus = !$existingCheck['completed'];
        $query = "UPDATE habit_checks SET completed = ? WHERE id = ?";
        $stmt = $pdo->prepare($query);
        $stmt->execute([$newStatus, $existingCheck['id']]);
        $completed = $newStatus;
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
