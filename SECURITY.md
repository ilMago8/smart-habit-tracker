# 🔐 Security Policy

## 🛡️ Supported Versions

Versioni attualmente supportate con security updates:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | ✅ Current         |
| < 1.0   | ❌ No longer supported |

## 🚨 Reporting a Vulnerability

Se scopri una vulnerabilità di sicurezza, per favore **NON** aprire un issue pubblico.

### 📧 Come Segnalare

1. **Email**: Invia una email dettagliata a [security email]
2. **Oggetto**: `[SECURITY] Smart Habit Tracker - [Brief Description]`
3. **Contenuto**: Include dettagli completi sulla vulnerabilità

### 📋 Cosa Includere

- **Descrizione dettagliata** della vulnerabilità
- **Steps to reproduce** il problema
- **Potential impact** e severity level
- **Screenshots/video** se applicabile
- **Environment details** (browser, OS, etc.)
- **Your contact info** per follow-up

### ⏱️ Response Timeline

- **24 ore**: Conferma di ricezione
- **72 ore**: Valutazione iniziale e priority
- **1 settimana**: Timeline per fix (dipende dalla severity)
- **Fix deployment**: Notifica quando risolto

### 🏆 Recognition

I security researchers che segnalano vulnerabilità responsabilmente saranno:

- ✅ **Riconosciuti** nei release notes (se desiderato)
- ✅ **Aggiunti** alla hall of fame security
- ✅ **Contattati** prima del disclosure pubblico

## 🔒 Security Best Practices

### Per Users
- ✅ Usa sempre l'ultima versione disponibile
- ✅ Mantieni aggiornato il browser
- ✅ Evita di condividere link dell'app in chat pubbliche
- ✅ Segnala comportamenti sospetti immediatamente

### Per Developers
- ✅ Segui [OWASP guidelines](https://owasp.org/)
- ✅ Valida sempre input utente
- ✅ Usa HTTPS per tutte le comunicazioni
- ✅ Implementa CSP headers appropriati
- ✅ Regular security audits del codice

## 🔍 Security Features

### Attualmente Implementate
- ✅ **CSP Headers** per prevenire XSS
- ✅ **HTTPS enforcement** su Vercel
- ✅ **Input validation** su tutti i form
- ✅ **Secure headers** nella configurazione Vercel
- ✅ **No sensitive data** in localStorage/cookies

### Planned (v2.0)
- 🔄 **JWT authentication** con refresh tokens
- 🔄 **Rate limiting** su API endpoints
- 🔄 **SQL injection protection** con prepared statements
- 🔄 **CSRF protection** per form submissions
- 🔄 **Data encryption** per informazioni sensibili

## 🚫 Out of Scope

Le seguenti vulnerabilità sono considerate out of scope:

- ❌ **Social engineering** attacks
- ❌ **Brute force** su demo app (no auth)
- ❌ **DDoS attacks** (gestiti da Vercel)
- ❌ **Browser vulnerabilities** (non nel nostro controllo)
- ❌ **Physical access** al device dell'utente

## 📚 Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Vercel Security](https://vercel.com/docs/security)
- [React Security Best Practices](https://react.dev/learn/security)
- [CSP Generator](https://report-uri.com/home/generate)

---

**🙏 Grazie per aiutarci a mantenere Smart Habit Tracker sicuro per tutti!**
