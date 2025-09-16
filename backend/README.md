# PHP Backend - Smart Habit Tracker

🚧 **Status: Ready for future development**

This PHP backend contains complete REST APIs for the future version of the app with MySQL database.



## 🏗️ **API Architecture**

### **Available endpoints:**



#### **🔍 GET /api/habits**

- Retrieve all habits with statistics
- Includes weekly counts and daily completions
- Response with calculated percentages

#### **➕ POST /api/habits** 

- Create a new habit
- Validates required input
- Returns created habit with ID

#### **✅ POST /api/habits/check**

- Toggle daily completion
- Handles existing/new states

- Updates statistics automatically

#### **📊 GET /api/habits/stats**

- Detailed weekly statistics
- Aggregate metrics for dashboard
- Advanced percentage calculations



## 🗄️ **Database Schema**

The database is defined in `/database/schema.sql`:

- **habits** - Main habits table
- **habit_checks** - Daily checks with dates

## 🚀 **Setup for V2.0 (Future)**



### **Prerequisites:**

- PHP 8+
- MySQL 8+
- Composer (for future dependencies)

### **Configuration:**

1. **Database**: Create DB and import schema

2. **Config**: Update `config/database.php`
3. **Server**: `php -S localhost:8000`
4. **Frontend**: Uncomment real API calls

### **Environment Variables:**

```php
// For production, move to .env

DB_HOST=localhost
DB_NAME=smart_habit_tracker
DB_USER=your_user
DB_PASS=your_password
```



## 🔧 **Implemented features:**



- ✅ **CORS headers** for frontend
- ✅ **RESTful router** with switch/case
- ✅ **Error handling** with try/catch
- ✅ **SQL injection protection** with prepared statements
- ✅ **Standardized JSON responses**
- ✅ **Optimized queries** with JOIN and aggregations



## 🎯 **V2.0 Roadmap:**

- [ ] **Environment config** with dotenv
- [ ] **Validation layer** for input
- [ ] **JWT Authentication**
- [ ] **Rate limiting** for security
- [ ] **Logging** for debugging
- [ ] **Unit tests** for API
- [ ] **OpenAPI docs** for documentation



---

**💡 This backend is ready to be activated when persistent database is needed!**
