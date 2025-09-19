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

// GET /api/habits/stats - Weekly statistics for a specific user

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
            h.color,
            h.target_frequency,
            COUNT(hc.id) as completed_days,
            ROUND((COUNT(hc.id) / h.target_frequency) * 100) as completion_percentage,
            GROUP_CONCAT(
                CONCAT(DATE_FORMAT(hc.check_date, '%Y-%m-%d'), ':', hc.completed)
                ORDER BY hc.check_date
            ) as daily_checks
        FROM habits h
        LEFT JOIN habit_checks hc ON h.id = hc.habit_id 
            AND hc.check_date >= CURDATE() - INTERVAL 7 DAY
            AND hc.completed = 1
        WHERE h.user_id = ? AND h.is_active = 1
        GROUP BY h.id
        ORDER BY completion_percentage DESC
    ";
    
    $stmt = $pdo->prepare($query);
    $stmt->execute([$userId]);
    $stats = $stmt->fetchAll();
    
    // General statistics
    $totalHabits = count($stats);
    $avgCompletion = $totalHabits > 0 ? 
        array_sum(array_column($stats, 'completion_percentage')) / $totalHabits : 0;
    
    echo json_encode([
        'success' => true, 
        'data' => [
            'habits' => $stats,
            'summary' => [
                'total_habits' => $totalHabits,
                'average_completion' => round($avgCompletion),
                'week_start' => date('Y-m-d', strtotime('-6 days')),
                'week_end' => date('Y-m-d')
            ]
        ]
    ]);
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>
