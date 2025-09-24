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

// GET /api/habits - Retrieve all habits with statistics for a specific user

// Include database connection
require_once '../../config/database.php';

try {
    // Get user_id from query parameters
    $userId = $_GET['user_id'] ?? null;
    
    if (!$userId) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'user_id parameter is required']);
        exit;
    }
    
    // Validate user_id is numeric
    if (!is_numeric($userId)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'user_id must be a valid number']);
        exit;
    }
    
    $query = "
        SELECT 
            h.id,
            h.user_id,
            h.name,
            h.description,
            h.color,
            h.icon,
            h.target_frequency,
            h.created_at,
            COUNT(hc.id) as total_checks,
            COUNT(CASE WHEN hc.check_date >= CURDATE() - INTERVAL 7 DAY THEN 1 END) as week_checks,
            COALESCE((SELECT completed FROM habit_checks WHERE habit_id = h.id AND check_date = CURDATE() LIMIT 1), 0) as today_completed
        FROM habits h
        LEFT JOIN habit_checks hc ON h.id = hc.habit_id AND hc.completed = 1
        WHERE h.user_id = ? AND h.is_active = 1
        GROUP BY h.id
        ORDER BY h.created_at DESC
    ";
    
    $stmt = $pdo->prepare($query);
    $stmt->execute([$userId]);
    $habits = $stmt->fetchAll();
    
    // Calculate weekly percentages
    foreach ($habits as &$habit) {
        $habit['week_completion'] = $habit['target_frequency'] > 0 
            ? round(($habit['week_checks'] / $habit['target_frequency']) * 100) 
            : 0;
        $habit['today_completed'] = (bool)$habit['today_completed'];
    }
    
    echo json_encode(['success' => true, 'data' => $habits]);
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>
