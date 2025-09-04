<?php
// POST /api/habits - Crea una nuova abitudine
$input = json_decode(file_get_contents('php://input'), true);

if (!isset($input['name']) || empty(trim($input['name']))) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Nome abitudine richiesto']);
    exit;
}

try {
    $query = "INSERT INTO habits (name, description, color, icon, target_frequency) VALUES (?, ?, ?, ?, ?)";
    $stmt = $pdo->prepare($query);
    $stmt->execute([
        trim($input['name']),
        $input['description'] ?? '',
        $input['color'] ?? '#007bff',
        $input['icon'] ?? '📋',
        $input['target_frequency'] ?? 7
    ]);
    
    $habitId = $pdo->lastInsertId();
    
    // Recupera l'abitudine appena creata
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
