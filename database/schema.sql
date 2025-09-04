-- Smart Habit Tracker - Database Schema
-- Versione: 1.0
-- Compatibilità: MySQL 8.0+

-- ====================================
-- DATABASE SETUP
-- ====================================

CREATE DATABASE IF NOT EXISTS smart_habit_tracker 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE smart_habit_tracker;

-- ====================================
-- TABELLE PRINCIPALI
-- ====================================

-- Tabella per le abitudini degli utenti
CREATE TABLE habits (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    color VARCHAR(7) DEFAULT '#007bff' COMMENT 'Colore hex per UI',
    icon VARCHAR(50) DEFAULT '📋' COMMENT 'Emoji o icona Unicode',
    target_frequency INT DEFAULT 7 COMMENT 'Obiettivo settimanale (1-7 giorni)',
    is_active BOOLEAN DEFAULT TRUE COMMENT 'Abitudine attiva/archiviata',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Indici per performance
    INDEX idx_active (is_active),
    INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabella per i check giornalieri
CREATE TABLE habit_checks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    habit_id INT NOT NULL,
    check_date DATE NOT NULL,
    completed BOOLEAN DEFAULT TRUE,
    notes TEXT COMMENT 'Note opzionali per il check',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Relazioni
    FOREIGN KEY (habit_id) REFERENCES habits(id) ON DELETE CASCADE,
    
    -- Constraints
    UNIQUE KEY unique_habit_date (habit_id, check_date),
    
    -- Indici per performance
    INDEX idx_habit_date (habit_id, check_date),
    INDEX idx_date (check_date),
    INDEX idx_completed (completed)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ====================================
-- DATI DI ESEMPIO
-- ====================================

INSERT INTO habits (name, description, color, icon, target_frequency) VALUES
('Bere Acqua', 'Bere almeno 8 bicchieri d\'acqua al giorno per mantenersi idratati', '#00a8ff', '💧', 7),
('Lettura', 'Leggere almeno 10 minuti al giorno per stimolare la mente', '#fbc531', '📚', 7),
('Stretching', 'Fare stretching mattutino per migliorare la flessibilità', '#44bd32', '🤸‍♂️', 6),
('Meditazione', 'Praticare 5 minuti di meditazione per ridurre lo stress', '#9c88ff', '🧘‍♀️', 5),
('Camminata', 'Camminata di 20 minuti per mantenersi attivi', '#fd7e14', '🚶‍♂️', 5),
('Sonno Regolare', 'Andare a letto entro le 23:00 per un riposo ottimale', '#6f42c1', '😴', 7);

-- ====================================
-- DATI DI TEST (Check esempio)
-- ====================================

-- Alcuni check di esempio per testing
INSERT INTO habit_checks (habit_id, check_date, completed) VALUES
-- Settimana corrente (esempi)
(1, CURDATE() - INTERVAL 6 DAY, TRUE),
(1, CURDATE() - INTERVAL 5 DAY, TRUE),
(1, CURDATE() - INTERVAL 3 DAY, TRUE),
(1, CURDATE() - INTERVAL 1 DAY, TRUE),

(2, CURDATE() - INTERVAL 6 DAY, TRUE),
(2, CURDATE() - INTERVAL 4 DAY, TRUE),
(2, CURDATE() - INTERVAL 2 DAY, TRUE),

(3, CURDATE() - INTERVAL 5 DAY, TRUE),
(3, CURDATE() - INTERVAL 3 DAY, TRUE),
(3, CURDATE() - INTERVAL 1 DAY, TRUE);

-- ====================================
-- VISTE UTILI (Opzionale)
-- ====================================

-- Vista per statistiche settimanali
CREATE VIEW weekly_stats AS
SELECT 
    h.id,
    h.name,
    h.color,
    h.target_frequency,
    COUNT(hc.id) as completed_this_week,
    ROUND((COUNT(hc.id) / h.target_frequency) * 100) as completion_percentage
FROM habits h
LEFT JOIN habit_checks hc ON h.id = hc.habit_id 
    AND hc.check_date >= CURDATE() - INTERVAL 7 DAY
    AND hc.completed = TRUE
WHERE h.is_active = TRUE
GROUP BY h.id;

-- ====================================
-- PROCEDURE UTILI (Opzionale)
-- ====================================

DELIMITER //

-- Procedure per ottenere statistiche complete di una abitudine
CREATE PROCEDURE GetHabitStats(IN habit_id_param INT)
BEGIN
    SELECT 
        h.*,
        COUNT(hc.id) as total_checks,
        COUNT(CASE WHEN hc.check_date >= CURDATE() - INTERVAL 7 DAY THEN 1 END) as week_checks,
        COUNT(CASE WHEN hc.check_date >= CURDATE() - INTERVAL 30 DAY THEN 1 END) as month_checks,
        (SELECT COUNT(*) FROM habit_checks WHERE habit_id = h.id AND check_date = CURDATE()) as today_completed
    FROM habits h
    LEFT JOIN habit_checks hc ON h.id = hc.habit_id AND hc.completed = TRUE
    WHERE h.id = habit_id_param
    GROUP BY h.id;
END //

DELIMITER ;

-- ====================================
-- INDICI AGGIUNTIVI PER PERFORMANCE
-- ====================================

-- Indice composito per query comuni
CREATE INDEX idx_habit_check_recent ON habit_checks (habit_id, check_date DESC, completed);

-- ====================================
-- COMMENTI FINALI
-- ====================================

-- Schema ottimizzato per:
-- ✅ Performance con indici appropriati
-- ✅ Integrità dei dati con constraints
-- ✅ Scalabilità con InnoDB engine
-- ✅ Unicode support con utf8mb4
-- ✅ Flessibilità con campi opzionali
-- ✅ Testing con dati di esempio
