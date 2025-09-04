# Backend PHP - Smart Habit Tracker

🚧 **Stato: Pronto per sviluppo futuro**

Questo backend PHP contiene API REST complete per la versione futura dell'app con database MySQL.

## 🏗️ **Architettura API**

### **Endpoints disponibili:**

#### **🔍 GET /api/habits**
- Recupera tutte le abitudini con statistiche
- Include conteggi settimanali e completamenti giornalieri
- Response con percentuali calcolate

#### **➕ POST /api/habits** 
- Crea una nuova abitudine
- Valida input richiesti
- Ritorna abitudine creata con ID

#### **✅ POST /api/habits/check**
- Toggle completamento giornaliero
- Gestisce stati esistenti/nuovi
- Aggiorna statistiche automaticamente

#### **📊 GET /api/habits/stats**
- Statistiche settimanali dettagliate
- Metriche aggregate per dashboard
- Calcoli percentuali avanzati

## 🗄️ **Database Schema**

Il database è definito in `/database/schema.sql`:
- **habits** - Tabella principale abitudini
- **habit_checks** - Check giornalieri con date

## 🚀 **Setup per V2.0 (Futuro)**

### **Prerequisiti:**
- PHP 8+
- MySQL 8+
- Composer (per dipendenze future)

### **Configurazione:**
1. **Database**: Creare DB e importare schema
2. **Config**: Aggiornare `config/database.php` 
3. **Server**: `php -S localhost:8000`
4. **Frontend**: Decommentare chiamate API reali

### **Environment Variables:**
```php
// Per produzione, spostare in .env
DB_HOST=localhost
DB_NAME=smart_habit_tracker  
DB_USER=your_user
DB_PASS=your_password
```

## 🔧 **Features implementate:**

- ✅ **CORS headers** per frontend
- ✅ **Router RESTful** con switch/case
- ✅ **Error handling** con try/catch
- ✅ **SQL injection protection** con prepared statements
- ✅ **Response standardizzate** JSON
- ✅ **Query ottimizzate** con JOIN e aggregazioni

## 🎯 **Roadmap V2.0:**

- [ ] **Environment config** con dotenv
- [ ] **Validation layer** per input
- [ ] **Authentication** JWT
- [ ] **Rate limiting** per security
- [ ] **Logging** per debugging
- [ ] **Unit tests** per API
- [ ] **OpenAPI docs** per documentation

---

**💡 Questo backend è pronto per essere attivato quando serve un database persistente!**
