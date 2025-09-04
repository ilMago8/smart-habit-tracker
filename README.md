# 🌟 Smart Habit Tracker

**Un'applicazione moderna per il tracciamento delle abitudini giornaliere con interfaccia React colorata e intuitiva.**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-000000?style=for-the-badge&logo=vercel)](https://smart-habit-tracker.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github)](https://github.com/ilMago8/smart-habit-tracker)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev/)

---

## 🚀 Demo Live

✨ **L'app è live e funzionante!** → [smart-habit-tracker.vercel.app](https://smart-habit-tracker.vercel.app)

---

## 🎯 Caratteristiche Principali

### 📊 Dashboard Interattiva
- **Visualizzazione abitudini** con card colorate e animate
- **Progress bar** che mostrano il completamento settimanale  
- **Contatore giornaliero** delle abitudini completate
- **Design responsive** ottimizzato per mobile e desktop

### ⚡ Gestione Abitudini
- **Creazione rapida** con form intuitivo e validazione
- **Personalizzazione completa**: 12 icone + 10 colori predefiniti
- **Obiettivi flessibili**: da 1 a 7 giorni a settimana
- **Stati visuali** per feedback immediato

### 📈 Statistiche Avanzate  
- **Dashboard dedicata** con metriche dettagliate
- **Visualizzazioni grafiche** con progress bar colorate
- **Percentuali di completamento** in tempo reale
- **Messaggi motivazionali** dinamici basati sui progressi

### 🎨 UI/UX Moderna
- **Design system** coerente con CSS custom properties
- **Animazioni fluide** e transizioni ottimizzate
- **Accessibilità WCAG** con ARIA labels e keyboard navigation
- **Performance** ottimizzate con React.memo e lazy loading

---

## 🛠️ Stack Tecnologico

### Frontend
- **React 18** - Hooks moderni e Concurrent Features
- **Vite 5.4** - Build tool velocissimo con HMR
- **CSS3 moderno** - Custom properties, Container Queries
- **ESLint + Prettier** - Linting e formattazione automatica

### Performance & Ottimizzazioni
- **Code Splitting** - Bundle ottimizzato con lazy loading  
- **React.memo** - Prevenzione re-render inutili
- **useCallback/useMemo** - Ottimizzazioni hook
- **GPU Acceleration** - Animazioni hardware accelerate

### Deploy & DevOps
- **Vercel** - Deploy automatico con GitHub integration
- **GitHub Actions** - CI/CD pipeline (future)
- **Progressive Web App** - PWA ready con manifest

---

## 🏃‍♂️ Quick Start

### Prerequisiti
- **Node.js** 18+ 
- **npm** 8+ o **yarn** 1.22+
- **Git** 2.30+

### Installazione
```bash
# Clona il repository
git clone https://github.com/ilMago8/smart-habit-tracker.git
cd smart-habit-tracker

# Installa dipendenze frontend
cd frontend
npm install

# Avvia server di sviluppo
npm run dev
```

🎉 **App disponibile su:** http://localhost:3000

### Scripts Disponibili
```bash
npm run dev      # Server di sviluppo
npm run build    # Build produzione  
npm run preview  # Anteprima build
npm run lint     # Controllo codice
```

---

## �️ Architettura del Progetto

```
smart-habit-tracker/
├── frontend/           # React app
│   ├── src/
│   │   ├── components/    # Componenti riutilizzabili
│   │   ├── pages/         # Pagine principali
│   │   ├── styles/        # CSS e design system
│   │   └── utils/         # Utilities e helpers
│   ├── public/           # Assets statici
│   └── dist/            # Build output
├── backend/             # PHP API (ready for future)
├── database/            # MySQL schema
└── docs/               # Documentazione
```

---

## 🎨 Design System

### Palette Colori
```css
--primary: #007bff     /* Blu principale */
--success: #28a745     /* Verde successo */
--warning: #ffc107     /* Giallo attenzione */
--gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%)
```

### Typography Scale
```css
--font-size-xs: 0.75rem    /* 12px */
--font-size-base: 1rem     /* 16px */
--font-size-title: 2.5rem  /* 40px */
```

### Spacing System
```css
--spacing-sm: 0.5rem   /* 8px */
--spacing-md: 1rem     /* 16px */  
--spacing-lg: 1.5rem   /* 24px */
--spacing-xl: 2rem     /* 32px */
```

---

## 📱 Screenshots

### Dashboard
![Dashboard](https://via.placeholder.com/800x400/667eea/ffffff?text=Dashboard+Screenshot)

### Creazione Abitudine
![Form](https://via.placeholder.com/800x400/28a745/ffffff?text=Add+Habit+Form)

### Statistiche  
![Stats](https://via.placeholder.com/800x400/ffc107/000000?text=Statistics+Panel)

---

## 🚀 Deployment

### Vercel (Raccomandato)
1. Fork questo repository
2. Collega account Vercel a GitHub
3. Importa il progetto su Vercel
4. Deploy automatico ad ogni push!

### Configurazione Build
```json
{
  "buildCommand": "cd frontend && npm run build",
  "outputDirectory": "frontend/dist",  
  "installCommand": "cd frontend && npm install"
}
```

### Altri Provider
- **Netlify**: Drag & drop della cartella `frontend/dist`
- **GitHub Pages**: Via GitHub Actions
- **Railway**: Collegamento diretto repository

---

## 🗺️ Roadmap

### 🎯 V1.1 - Miglioramenti UX (In corso)
- [ ] **Dark mode** toggle con persistenza
- [ ] **Streak tracking** per serie consecutive  
- [ ] **Habit templates** predefiniti
- [ ] **Export dati** in CSV/JSON

### 🎯 V2.0 - Backend Integration
- [ ] **Database MySQL** per persistenza reale
- [ ] **API REST** con autenticazione JWT
- [ ] **Multi-utente** con profili personali
- [ ] **Sincronizzazione cloud** cross-device

### 🎯 V2.1 - Features Avanzate
- [ ] **Push notifications** per reminder
- [ ] **Habit insights** con analytics avanzate  
- [ ] **Goal setting** con obiettivi a lungo termine
- [ ] **Integration** con Google Calendar

### 🎯 V3.0 - Social Features
- [ ] **Condivisione progressi** sui social
- [ ] **Challenges** tra amici
- [ ] **Leaderboard** settimanali
- [ ] **Achievement system** con badges

---

## 🤝 Contribuire

Contributi, issue e feature request sono benvenuti!

### Come Contribuire
1. **Fork** il progetto
2. **Crea branch** (`git checkout -b feature/amazing-feature`)
3. **Commit** (`git commit -m 'Add amazing feature'`)
4. **Push** (`git push origin feature/amazing-feature`)
5. **Pull Request** con descrizione dettagliata

### Guidelines
- Segui le convenzioni ESLint esistenti
- Scrivi test per nuove funzionalità
- Aggiorna documentazione quando necessario
- Usa commit messages descrittivi

---

## 🐛 Issues e Support

Hai trovato un bug o hai una feature request?

### Segnala Bug
- Usa il [template issue](https://github.com/ilMago8/smart-habit-tracker/issues/new?template=bug_report.md)
- Includi screenshot se possibile
- Specifica browser e versione OS

### Feature Request  
- Usa il [template feature](https://github.com/ilMago8/smart-habit-tracker/issues/new?template=feature_request.md)
- Descrivi il caso d'uso
- Spiega il beneficio per gli utenti

---

## 📄 Licenza

Questo progetto è rilasciato sotto **Licenza MIT**.

Vedi il file [LICENSE](LICENSE) per tutti i dettagli.

---

## 👨‍💻 Autore

**ilMago8**
- GitHub: [@ilMago8](https://github.com/ilMago8)
- LinkedIn: [Profilo LinkedIn](#)
- Twitter: [@ilMago8](#)

---

## 🙏 Ringraziamenti

- **React Team** per la fantastica libreria
- **Vite Team** per il build tool incredibilmente veloce  
- **Vercel** per l'hosting gratuito eccellente
- **Open Source Community** per l'ispirazione continua
- **Beta testers** per feedback e suggerimenti

---

## 📊 Project Stats

![GitHub stars](https://img.shields.io/github/stars/ilMago8/smart-habit-tracker?style=social)
![GitHub forks](https://img.shields.io/github/forks/ilMago8/smart-habit-tracker?style=social)
![GitHub issues](https://img.shields.io/github/issues/ilMago8/smart-habit-tracker)
![GitHub pull requests](https://img.shields.io/github/issues-pr/ilMago8/smart-habit-tracker)

---

**⭐ Se il progetto ti è piaciuto, lascia una stella! Aiuta altri sviluppatori a scoprirlo.**

**🔄 Condividi con la community e aiutaci a crescere!**
