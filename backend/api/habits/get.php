<?php
// GET /api/habits - Recupera tutte le abitudini con statistiche
try {
    $query = "
        SELECT 
            h.id,
            h.name,
            h.description,
            h.color,
            h.icon,
            h.target_frequency,
            h.created_at,
            COUNT(hc.id) as total_checks,
            COUNT(CASE WHEN hc.check_date >= CURDATE() - INTERVAL 7 DAY THEN 1 END) as week_checks,
            (SELECT COUNT(*) FROM habit_checks WHERE habit_id = h.id AND check_date = CURDATE()) as today_completed
        FROM habits h
        LEFT JOIN habit_checks hc ON h.id = hc.habit_id AND hc.completed = 1
        GROUP BY h.id
        ORDER BY h.created_at DESC
    ";
    
    $stmt = $pdo->prepare($query);
    $stmt->execute();
    $habits = $stmt->fetchAll();
    
    // Calcola percentuali settimanali
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
