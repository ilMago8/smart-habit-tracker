# 🤝 Contributing to Smart Habit Tracker

Grazie per il tuo interesse nel contribuire a **Smart Habit Tracker**! 🎉

## 📋 Come Contribuire

### 🐛 Segnalare Bug
1. Controlla che il bug non sia già segnalato negli [Issues](https://github.com/ilMago8/smart-habit-tracker/issues)
2. Crea un nuovo issue usando il template **Bug Report**
3. Includi informazioni dettagliate:
   - Versione browser/OS
   - Passi per riprodurre il bug
   - Screenshot se possibile
   - Comportamento atteso vs osservato

### ✨ Proporre Nuove Features
1. Controlla la [Roadmap](README.md#-roadmap) per vedere se è già pianificata
2. Crea un issue usando il template **Feature Request**
3. Descrivi:
   - Il problema che la feature risolverebbe
   - La soluzione proposta
   - Alternative considerate
   - Mockup/wireframe se utili

### 🔧 Contribuire Codice

#### Setup Sviluppo
```bash
# Fork e clona il repository
git clone https://github.com/TUO-USERNAME/smart-habit-tracker.git
cd smart-habit-tracker

# Installa dipendenze
cd frontend
npm install

# Avvia server di sviluppo
npm run dev
```

#### Workflow
1. **Crea un branch** per la tua feature:
   ```bash
   git checkout -b feature/nome-feature
   ```

2. **Sviluppa** seguendo le guidelines:
   - Codice pulito e commentato
   - Test per nuove funzionalità
   - Commit messages descrittivi

3. **Testa** le tue modifiche:
   ```bash
   npm run build
   npm run preview
   ```

4. **Commit** usando conventional commits:
   ```bash
   git commit -m "feat: add dark mode toggle"
   git commit -m "fix: resolve habit deletion bug"
   git commit -m "docs: update installation guide"
   ```

5. **Push** e crea **Pull Request**:
   ```bash
   git push origin feature/nome-feature
   ```

## 📏 Guidelines

### 🎨 Stile Codice
- **ESLint**: Segui le regole esistenti
- **Prettier**: Formattazione automatica
- **Naming**: camelCase per variabili, PascalCase per componenti
- **Commenti**: Spiega il "perché", non il "cosa"

### 🧪 Testing
- Testa su Chrome, Firefox, Safari
- Verifica responsive su mobile
- Controlla accessibilità con screen reader
- Performance test con Lighthouse

### 📝 Documentazione
- Aggiorna README.md se necessario
- Commenta funzioni complesse
- Includi JSDoc per API pubbliche

### 🚀 Pull Request
- **Titolo** chiaro e descrittivo
- **Descrizione** che spiega le modifiche
- **Screenshot** per cambiamenti UI
- **Breaking changes** evidenziati

## 🏷️ Conventional Commits

Usiamo [Conventional Commits](https://www.conventionalcommits.org/) per messaggi consistenti:

- `feat:` nuove funzionalità
- `fix:` correzioni bug
- `docs:` aggiornamenti documentazione
- `style:` modifiche formattazione
- `refactor:` refactoring codice
- `test:` aggiunta test
- `chore:` task manutenzione

**Esempi:**
```bash
feat(habits): add streak tracking functionality
fix(dashboard): resolve progress bar calculation
docs(readme): update installation instructions
style(components): improve button hover effects
```

## 🎯 Aree di Contributo

### 🆘 Good First Issues
Perfetti per iniziare:
- Correzioni typo nella documentazione
- Miglioramenti UI minori
- Aggiunta test mancanti
- Ottimizzazioni performance

### 🔥 Priority Features
- Dark mode implementation
- Habit streak tracking
- Data export functionality
- Mobile app (React Native)

### 🧪 Testing & QA
- Unit tests con Jest
- E2E tests con Playwright
- Accessibility testing
- Cross-browser compatibility

## 🏆 Riconoscimenti

I contributori saranno riconosciuti:
- **README.md** con link GitHub
- **Release notes** delle versioni
- **Social media** per contributi significativi
- **Swag** per contributori top (futuro)

## ❓ Domande?

- **Discord**: [Server Community](#) (futuro)
- **Discussions**: [GitHub Discussions](https://github.com/ilMago8/smart-habit-tracker/discussions)
- **Email**: [maintainer@email.com](#)

## 📜 Codice di Condotta

Seguiamo il [Contributor Covenant](https://www.contributor-covenant.org/):
- Sii rispettoso e inclusivo
- Accetta critiche costruttive
- Focalizzati su cosa è meglio per la community
- Mostra empatia verso altri membri

---

**🙏 Grazie per contribuire a rendere Smart Habit Tracker ancora migliore!**

**💪 Insieme possiamo aiutare milioni di persone a costruire abitudini positive!**