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



## 📊 **Included Data**

### **🎯 Example Habits:**

1. **💧 Drink Water** - Daily hydration
2. **📚 Reading** - Mental stimulation
3. **🤸‍♂️ Stretching** - Physical flexibility
4. **🧘‍♀️ Meditation** - Mental wellbeing
5. **🚶‍♂️ Walking** - Physical activity
6. **😴 Regular Sleep** - Optimal rest

### **✅ Test Checks:**

- Sample data for current week
- Realistic completion patterns
- Perfect for API testing

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



## 🎯 **Future Extensions**

### **V2.1 - Multi User:**

```sql
-- Users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- FK to users in habits
ALTER TABLE habits ADD COLUMN user_id INT;
ALTER TABLE habits ADD FOREIGN KEY (user_id) REFERENCES users(id);
```

### **V2.2 - Advanced Analytics:**

```sql
-- Metrics table
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



## 📚 **Resources**

- **MySQL Docs**: [Official Documentation](https://dev.mysql.com/doc/)
- **Performance**: [Query Optimization](https://dev.mysql.com/doc/refman/8.0/en/optimization.html)
- **Security**: [Best Practices](https://dev.mysql.com/doc/refman/8.0/en/security.html)

---

**💡 Production-ready schema with 6 example habits and test data!**
