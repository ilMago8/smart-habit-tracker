# Database - Smart Habit Tracker

🗄️ **Schema MySQL per la versione completa dell'app con persistenza dei dati.**

## 📊 **Schema Ottimizzato**

### **Tabelle Principali:**

#### **🏷️ habits**
Contiene le abitudini degli utenti con metadati completi:
- **id**: Chiave primaria auto-increment
- **name**: Nome abitudine (obbligatorio)
- **description**: Descrizione dettagliata
- **color**: Colore hex per UI (#rrggbb)
- **icon**: Emoji Unicode per visualizzazione
- **target_frequency**: Obiettivo settimanale (1-7)
- **is_active**: Flag per abitudini attive/archiviate
- **timestamps**: created_at, updated_at

#### **✅ habit_checks**
Registra i completamenti giornalieri:
- **id**: Chiave primaria auto-increment  
- **habit_id**: FK verso habits
- **check_date**: Data del check (UNIQUE per abitudine)
- **completed**: Boolean stato completamento
- **notes**: Note opzionali per il check
- **created_at**: Timestamp creazione

### **🔍 Ottimizzazioni Performance:**

- ✅ **Indici strategici** su colonne frequentemente queried
- ✅ **InnoDB engine** per transazioni ACID
- ✅ **UTF8MB4** per supporto completo Unicode  
- ✅ **Foreign keys** per integrità referenziale
- ✅ **Unique constraints** per prevenire duplicati

### **📈 Viste e Procedure:**

- **weekly_stats**: Vista pre-calcolata per statistiche settimanali
- **GetHabitStats()**: Procedure per statistiche complete di una abitudine

## 🚀 **Setup Database**

### **Installazione:**
```bash
# 1. Accedi a MySQL
mysql -u root -p

# 2. Esegui lo schema
source /path/to/schema.sql

# 3. Verifica creazione
SHOW TABLES;
SELECT * FROM habits;
```

### **Configurazione Backend:**
Aggiorna `backend/config/database.php` con le tue credenziali:
```php
$host = 'localhost';
$dbname = 'smart_habit_tracker';  
$username = 'your_user';
$password = 'your_password';
```

## 📊 **Dati Inclusi**

### **🎯 Abitudini di Esempio:**
1. **💧 Bere Acqua** - Idratazione quotidiana
2. **📚 Lettura** - Stimolazione mentale  
3. **🤸‍♂️ Stretching** - Flessibilità fisica
4. **🧘‍♀️ Meditazione** - Benessere mentale
5. **🚶‍♂️ Camminata** - Attività fisica
6. **😴 Sonno Regolare** - Riposo ottimale

### **✅ Check di Test:**
- Dati di esempio per la settimana corrente
- Pattern realistici di completamento
- Perfetti per testing delle API

## 🔧 **Queries Utili**

### **Statistiche Settimanali:**
```sql
SELECT * FROM weekly_stats;
```

### **Abitudini Attive:**
```sql
SELECT * FROM habits WHERE is_active = TRUE;
```

### **Check Oggi:**
```sql
SELECT h.name, hc.completed 
FROM habits h
LEFT JOIN habit_checks hc ON h.id = hc.habit_id 
AND hc.check_date = CURDATE();
```

### **Streak Calcolo:**
```sql
-- Calcolo serie consecutive per una abitudine
SELECT habit_id, COUNT(*) as streak_days
FROM habit_checks 
WHERE habit_id = 1 
AND completed = TRUE
AND check_date >= '2024-01-01'
GROUP BY habit_id;
```

## 🎯 **Estensioni Future**

### **V2.1 - Multi Utente:**
```sql
-- Tabella utenti
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- FK verso users in habits
ALTER TABLE habits ADD COLUMN user_id INT;
ALTER TABLE habits ADD FOREIGN KEY (user_id) REFERENCES users(id);
```

### **V2.2 - Analytics Avanzati:**
```sql
-- Tabella metriche
CREATE TABLE habit_analytics (
    id INT AUTO_INCREMENT PRIMARY KEY,
    habit_id INT NOT NULL,
    metric_date DATE NOT NULL,
    streak_current INT DEFAULT 0,
    streak_best INT DEFAULT 0,
    completion_rate DECIMAL(5,2),
    FOREIGN KEY (habit_id) REFERENCES habits(id)
);
```

## 📚 **Risorse**

- **MySQL Docs**: [Official Documentation](https://dev.mysql.com/doc/)
- **Performance**: [Query Optimization](https://dev.mysql.com/doc/refman/8.0/en/optimization.html)
- **Security**: [Best Practices](https://dev.mysql.com/doc/refman/8.0/en/security.html)

---

**💡 Schema pronto per produzione con 6 abitudini di esempio e dati di test!**
