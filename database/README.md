# Database - Smart Habit Tracker

🗄️ **MySQL schema for the complete app version with data persistence.**



## 📊 **Optimized Schema**

### **Main Tables:**



#### **🏷️ habits**

Contains user habits with complete metadata:

- **id**: Auto-increment primary key

- **name**: Habit name (required)

- **description**: Detailed description

- **color**: Hex color for UI (#rrggbb)
- **icon**: Unicode emoji for display
- **target_frequency**: Weekly target (1-7)

- **is_active**: Flag for active/archived habits

- **timestamps**: created_at, updated_at



#### **✅ habit_checks**

Records daily completions:

- **id**: Auto-increment primary key
- **habit_id**: FK to habits

- **check_date**: Check date (UNIQUE per habit)
- **completed**: Boolean completion status
- **notes**: Optional check notes

- **created_at**: Creation timestamp



### **🔍 Performance Optimizations:**

- ✅ **Strategic indexes** on frequently queried columns
- ✅ **InnoDB engine** for ACID transactions
- ✅ **UTF8MB4** for complete Unicode support
- ✅ **Foreign keys** for referential integrity
- ✅ **Unique constraints** to prevent duplicates



### **📈 Views and Procedures:**

- **weekly_stats**: Pre-calculated view for weekly statistics
- **GetHabitStats()**: Procedure for complete habit statistics



## 🚀 **Database Setup**

### **Installation:**

```bash
# 1. Access MySQL
mysql -u root -p

# 2. Execute schema
source /path/to/schema.sql

# 3. Verify creation
SHOW TABLES;
SELECT * FROM habits;
```



### **Backend Configuration:**

Update `backend/config/database.php` with your credentials:

```php
$host = 'localhost';
$dbname = 'smart_habit_tracker';
$username = 'your_user';
$password = 'your_password';
```



## 📊 **Sample Data Included**

### **👤 Demo User:**
- **Email:** demo@example.com
- **Password:** password (hashed with bcrypt)
- **Name:** Demo User
- **Bio & Goals:** Pre-filled for demonstration

### **🎯 Six Example Habits:**
1. **💧 Drink Water** - 7 days/week target
2. **📚 Reading** - 7 days/week target
3. **🤸‍♂️ Stretching** - 6 days/week target
4. **🧘‍♀️ Meditation** - 5 days/week target
5. **🚶‍♂️ Walking** - 5 days/week target
6. **😴 Regular Sleep** - 7 days/week target

### **✅ Weekly Test Data:**
- Sample completion checks for current week
- Realistic patterns (70-90% completion)
- Various dates and times for testing
- Perfect for API development and testing

### **🔧 Using Sample Data:**
```bash
# Login with demo account
curl -X POST http://localhost:8000/api/auth/login.php \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@example.com","password":"password"}'

# Get demo user habits
curl http://localhost:8000/api/habits/get.php?user_id=1
```

## 🔧 **Useful Queries**

### **Weekly Statistics:**

```sql
SELECT * FROM weekly_stats;
```

### **Active Habits:**

```sql
SELECT * FROM habits WHERE is_active = TRUE;
```

### **Today's Checks:**

```sql
SELECT h.name, hc.completed
FROM habits h
LEFT JOIN habit_checks hc ON h.id = hc.habit_id
AND hc.check_date = CURDATE();
```

### **Streak Calculation:**

```sql
-- Calculate consecutive streak for a habit
SELECT habit_id, COUNT(*) as streak_days
FROM habit_checks
WHERE habit_id = 1
AND completed = TRUE
AND check_date >= '2024-01-01'
GROUP BY habit_id;
```



## ✅ **Current Multi-User Implementation**

The schema already includes complete multi-user support:

### **Users Table:**
```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    bio TEXT,
    goals TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### **User-Habit Relationship:**
- Each habit belongs to one user via `user_id` foreign key
- CASCADE delete ensures cleanup when user is deleted
- Indexes optimize queries by user_id
- Complete data isolation between users

## 🎯 **Future Enhancements**

### **V2.2 - Streak Tracking:**
```sql
-- Add streak columns to habits table
ALTER TABLE habits 
  ADD COLUMN current_streak INT DEFAULT 0,
  ADD COLUMN best_streak INT DEFAULT 0,
  ADD COLUMN last_completed_date DATE;

-- Trigger to update streaks automatically
CREATE TRIGGER update_streak_after_check
AFTER INSERT ON habit_checks
FOR EACH ROW
BEGIN
  -- Calculate and update streak logic
END;
```

### **V2.3 - Advanced Analytics:**
```sql
-- Habit analytics table
CREATE TABLE habit_analytics (
    id INT AUTO_INCREMENT PRIMARY KEY,
    habit_id INT NOT NULL,
    week_start DATE NOT NULL,
    completion_rate DECIMAL(5,2),
    streak_count INT,
    total_completions INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (habit_id) REFERENCES habits(id) ON DELETE CASCADE,
    UNIQUE KEY unique_habit_week (habit_id, week_start)
);
```

### **V2.4 - Categories & Tags:**
```sql
-- Categories table
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    color VARCHAR(7),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Habit-Category relationship
ALTER TABLE habits ADD COLUMN category_id INT;
ALTER TABLE habits ADD FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL;
```



## 📚 **Resources**

- **MySQL Docs**: [Official Documentation](https://dev.mysql.com/doc/)
- **Performance**: [Query Optimization](https://dev.mysql.com/doc/refman/8.0/en/optimization.html)
- **Security**: [Best Practices](https://dev.mysql.com/doc/refman/8.0/en/security.html)

---

**💡 Production-ready schema with 6 example habits and test data!**
