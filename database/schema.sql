-- Smart Habit Tracker - Database Schema
-- Version: 1.0
-- Compatibility: MySQL 8.0+SELECT User, Host FROM mysql.user WHERE User = 'habituser';systemctl restart apache2

-- ====================================
-- DATABASE SETUP
-- ====================================

CREATE DATABASE IF NOT EXISTS smart_habit_tracker 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE smart_habit_tracker;

-- ====================================
-- MAIN TABLES
-- ====================================

-- Table for users
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    bio TEXT COMMENT 'User biography',
    goals TEXT COMMENT 'User goals and motivations',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Performance indexes
    INDEX idx_email (email),
    INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table for user habits
CREATE TABLE habits (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    color VARCHAR(7) DEFAULT '#007bff' COMMENT 'Hex color for UI',
    icon VARCHAR(50) DEFAULT '📋' COMMENT 'Emoji or Unicode icon',
    target_frequency INT DEFAULT 7 COMMENT 'Weekly target (1-7 days)',
    is_active BOOLEAN DEFAULT TRUE COMMENT 'Active/archived habit',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Relations
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    
    -- Performance indexes
    INDEX idx_user_id (user_id),
    INDEX idx_active (is_active),
    INDEX idx_created (created_at),
    INDEX idx_user_active (user_id, is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table for daily checks
CREATE TABLE habit_checks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    habit_id INT NOT NULL,
    check_date DATE NOT NULL,
    completed BOOLEAN DEFAULT TRUE,
    notes TEXT COMMENT 'Optional check notes',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Relations
    FOREIGN KEY (habit_id) REFERENCES habits(id) ON DELETE CASCADE,
    
    -- Constraints
    UNIQUE KEY unique_habit_date (habit_id, check_date),
    
    -- Performance indexes
    INDEX idx_habit_date (habit_id, check_date),
    INDEX idx_date (check_date),
    INDEX idx_completed (completed)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ====================================
-- SAMPLE DATA
-- ====================================

-- Insert sample user for testing
INSERT INTO users (name, email, password_hash, bio, goals) VALUES
('Demo User', 'demo@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 
 'Demo user for testing the Smart Habit Tracker application', 
 'Build healthy habits and maintain consistency in daily routines');

INSERT INTO habits (user_id, name, description, color, icon, target_frequency) VALUES
(1, 'Drink Water', 'Drink at least 8 glasses of water daily to stay hydrated', '#00a8ff', '💧', 7),
(1, 'Reading', 'Read at least 10 minutes daily to stimulate the mind', '#fbc531', '📚', 7),
(1, 'Stretching', 'Do morning stretching to improve flexibility', '#44bd32', '🤸‍♂️', 6),
(1, 'Meditation', 'Practice 5 minutes of meditation to reduce stress', '#9c88ff', '🧘‍♀️', 5),
(1, 'Walking', '20-minute walk to stay active', '#fd7e14', '🚶‍♂️', 5),
(1, 'Regular Sleep', 'Go to bed by 11:00 PM for optimal rest', '#6f42c1', '😴', 7);

-- ====================================
-- TEST DATA (Example checks)
-- ====================================

-- Some example checks for testing
INSERT INTO habit_checks (habit_id, check_date, completed) VALUES
-- Current week (examples)
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
-- USEFUL VIEWS (Optional)
-- ====================================

-- View for weekly statistics
CREATE VIEW weekly_stats AS
SELECT 
    h.id,
    h.user_id,
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
-- USEFUL PROCEDURES (Optional)
-- ====================================

DELIMITER //

-- Procedure to get complete habit statistics
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
-- ADDITIONAL PERFORMANCE INDEXES
-- ====================================

-- Composite index for common queries
CREATE INDEX idx_habit_check_recent ON habit_checks (habit_id, check_date DESC, completed);

-- ====================================
-- FINAL COMMENTS
-- ====================================

-- Schema optimized for:
-- ✅ Performance with appropriate indexes
-- ✅ Data integrity with constraints
-- ✅ Scalability with InnoDB engine
-- ✅ Unicode support with utf8mb4
-- ✅ Flexibility with optional fields
-- ✅ Testing with sample data
