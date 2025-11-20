# PHP Backend - Smart Habit Tracker

✅ **Status: Production-Ready and Deployed**

Complete REST API backend with MySQL database, user authentication, and habit management.

## 🏗️ **API Architecture**

### **Authentication Endpoints:**

#### **🔐 POST /api/auth/register.php**
- Register new user account
- Password hashing with bcrypt
- Email validation and uniqueness check
- Returns user ID and session data

#### **🔑 POST /api/auth/login.php**
- Authenticate user credentials
- Secure password verification
- Returns user profile with token

#### **👤 GET /api/auth/profile.php**
- Retrieve user profile information
- Requires `user_id` parameter
- Returns name, email, bio, goals, and stats

#### **✏️ PUT /api/auth/profile.php**
- Update user profile fields
- Editable: name, bio, goals
- Email is read-only for security

### **Habit Management Endpoints:**

#### **📋 GET /api/habits/get.php**
- Retrieve all user habits with statistics
- Includes weekly completion percentages
- Calculates today's completion status
- Requires `user_id` parameter

#### **➕ POST /api/habits/create.php**
- Create new habit with customization
- Validates required fields
- Supports color, icon, description, target frequency
- Returns created habit with ID

#### **✏️ PUT /api/habits/update.php**
- Update existing habit details
- Modify name, description, color, icon, frequency
- Validates habit ownership

#### **✅ POST /api/habits/check.php**
- Toggle daily habit completion
- Automatic date handling
- Prevents duplicate checks
- Updates statistics in real-time

#### **🗑️ DELETE /api/habits/delete.php**
- Delete specific habit permanently
- Cascading delete of all related checks
- Requires habit_id and user_id

#### **🔄 POST /api/habits/reset.php**
- Reset all habit progress for user
- Clears all completion records
- Confirmation required

#### **📊 GET /api/habits/stats.php**
- Detailed weekly statistics
- Per-habit completion rates
- Average completion calculation
- Successful habits count (≥80%)
- Requires `user_id` parameter



## 🗄️ **Database Schema**

The complete database schema is in `/database/schema.sql`:

### **Core Tables:**
- **users** - User accounts with authentication
  - `id`, `name`, `email`, `password_hash`, `bio`, `goals`
  - Timestamps: `created_at`, `updated_at`
  - Unique constraint on email

- **habits** - User habits with customization
  - `id`, `user_id`, `name`, `description`, `color`, `icon`
  - `target_frequency` (1-7 days per week)
  - `is_active` flag for archiving
  - Foreign key to users with CASCADE delete
  - Indexes on user_id and active status

- **habit_checks** - Daily completion tracking
  - `id`, `habit_id`, `check_date`, `completed`, `notes`
  - Unique constraint on (habit_id, check_date)
  - Foreign key to habits with CASCADE delete
  - Indexes on habit_id and check_date

## 🚀 **Local Development Setup**

### **Prerequisites:**
- PHP 8.0 or higher
- MySQL 8.0 or higher
- Apache/Nginx web server (or PHP built-in server)

### **Installation Steps:**

1. **Database Setup:**
```bash
mysql -u root -p < ../database/schema.sql
```

2. **Configure Database:**
Update `config/database.php` with your credentials:
```php
$host = 'localhost';
$dbname = 'smart_habit_tracker';
$username = 'your_username';
$password = 'your_password';
```

3. **Start Development Server:**
```bash
php -S localhost:8000
```

4. **Test API:**
```bash
curl http://localhost:8000/api/habits/get.php?user_id=1
```

### **Environment Variables:**

```php
// For production, move to .env

DB_HOST=localhost
DB_NAME=smart_habit_tracker
DB_USER=your_user
DB_PASS=your_password
```



## 🔧 **Implemented Features:**

### **Security:**
- ✅ **Password hashing** with bcrypt (PHP password_hash)
- ✅ **SQL injection protection** via PDO prepared statements
- ✅ **CORS headers** for secure cross-origin requests
- ✅ **Input validation** on all endpoints
- ✅ **User data isolation** - users can only access own data
- ✅ **Email validation** and uniqueness checks

### **API Design:**
- ✅ **RESTful architecture** with proper HTTP methods
- ✅ **Standardized JSON responses** with success/error structure
- ✅ **Comprehensive error handling** with try/catch blocks
- ✅ **HTTP status codes** (200, 400, 401, 404, 500)

### **Database:**
- ✅ **Optimized queries** with JOINs and aggregations
- ✅ **Foreign key constraints** for data integrity
- ✅ **Indexed columns** for query performance
- ✅ **CASCADE deletes** for cleanup
- ✅ **UTF8MB4 encoding** for emoji and Unicode support

### **Functionality:**
- ✅ **Complete CRUD** for habits and users
- ✅ **Weekly statistics** calculation
- ✅ **Completion tracking** with date handling
- ✅ **Multi-user support** with proper isolation
- ✅ **Profile management** with editable fields

## 🎯 **Future Enhancements:**

### **V2.2 - Advanced Features:**
- [ ] **Environment variables** with dotenv for config
- [ ] **JWT tokens** for stateless authentication
- [ ] **Rate limiting** to prevent abuse
- [ ] **API logging** for debugging and monitoring
- [ ] **Input sanitization** layer
- [ ] **Password reset** via email
- [ ] **Email notifications** for reminders

### **V2.3 - Testing & Documentation:**
- [ ] **PHPUnit tests** for all endpoints
- [ ] **OpenAPI/Swagger** documentation
- [ ] **Postman collection** for API testing
- [ ] **Database migrations** system
- [ ] **Automated backups** configuration

---

**✅ Production-ready backend deployed on IONOS VPS with MySQL database!**
