-- Schema database per Smart Habit Tracker

CREATE DATABASE IF NOT EXISTS smart_habit_tracker;
USE smart_habit_tracker;

-- Tabella per le abitudini
CREATE TABLE habits (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    color VARCHAR(7) DEFAULT '#007bff',
    icon VARCHAR(50) DEFAULT '📋',
    target_frequency INT DEFAULT 7,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabella per i check giornalieri
CREATE TABLE habit_checks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    habit_id INT NOT NULL,
    check_date DATE NOT NULL,
    completed BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (habit_id) REFERENCES habits(id) ON DELETE CASCADE,
    UNIQUE KEY unique_habit_date (habit_id, check_date)
);

-- Inserimento dati di esempio
INSERT INTO habits (name, description, color, icon) VALUES
('Bere Acqua', 'Bere almeno 8 bicchieri d\'acqua al giorno', '#00a8ff', '💧'),
('Lettura', 'Leggere almeno 10 minuti al giorno', '#fbc531', '📚'),
('Stretching', 'Fare stretching mattutino', '#44bd32', '🤸‍♂️'),
('Meditazione', 'Praticare 5 minuti di meditazione', '#9c88ff', '🧘‍♀️');
