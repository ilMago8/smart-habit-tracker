<?php
// GET /api/habits/stats - Statistiche settimanali
try {
    $query = "
        SELECT 
            h.id,
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
        GROUP BY h.id
        ORDER BY completion_percentage DESC
    ";
    
    $stmt = $pdo->prepare($query);
    $stmt->execute();
    $stats = $stmt->fetchAll();
    
    // Statistiche generali
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
