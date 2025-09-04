# 🤝 Contributing to Smart Habit Tracker

Prima di tutto, grazie for il tuo interesse nel contribuire a Smart Habit Tracker! 🎉

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Pull Request Process](#pull-request-process)
- [Coding Guidelines](#coding-guidelines)
- [Issue Reporting](#issue-reporting)

## 📜 Code of Conduct

Questo progetto aderisce al [Contributor Covenant](https://www.contributor-covenant.org/). Partecipando, ci si aspetta che tu rispetti questo codice.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- Git
- Un editor di codice (VS Code raccomandato)

### Development Setup

1. **Fork & Clone**
   ```bash
   git clone https://github.com/YOUR_USERNAME/smart-habit-tracker.git
   cd smart-habit-tracker
   ```

2. **Setup Frontend**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. **Create Feature Branch**
   ```bash
   git checkout -b feature/your-amazing-feature
   ```

## 🔄 Pull Request Process

1. **Ensure** il tuo codice segue gli standard del progetto
2. **Update** la documentazione se necessario  
3. **Add** test per nuove funzionalità
4. **Ensure** tutti i test passano
5. **Request** review da un maintainer

### PR Template

```markdown
## 🎯 Cosa fa questa PR

Descrizione chiara delle modifiche

## ✅ Checklist

- [ ] Ho testato le modifiche localmente
- [ ] Ho aggiornato la documentazione
- [ ] Ho aggiunto test se necessario
- [ ] Il codice segue le convenzioni del progetto

## 📸 Screenshot (se applicabile)

[Aggiungi screenshot se ci sono cambiamenti UI]
```

## 📏 Coding Guidelines

### JavaScript/React

```javascript
// ✅ Good
const HabitCard = memo(({ habit, onToggle }) => {
  const handleClick = useCallback(() => {
    onToggle(habit.id);
  }, [habit.id, onToggle]);
  
  return <div onClick={handleClick}>{habit.name}</div>;
});

// ❌ Bad  
function HabitCard(props) {
  return <div onClick={() => props.onToggle(props.habit.id)}>{props.habit.name}</div>;
}
```

### CSS

```css
/* ✅ Good - Use CSS custom properties */
.habit-card {
  background: var(--card-background);
  border-radius: var(--border-radius);
  transition: var(--transition-base);
}

/* ❌ Bad - Hard-coded values */
.habit-card {
  background: #ffffff;
  border-radius: 12px;
  transition: all 0.3s ease;
}
```

### Commit Messages

Usa [Conventional Commits](https://conventionalcommits.org/):

```bash
feat: add streak tracking feature
fix: resolve habit deletion bug
docs: update README with new features
style: improve button hover animations
refactor: optimize habit state management
test: add unit tests for HabitCard component
```

## 🐛 Issue Reporting

### Bug Reports

Usa il template GitHub e includi:

- **🔍 Steps to reproduce**
- **💻 Environment info** (OS, browser, Node version)
- **🎯 Expected behavior**
- **🐛 Actual behavior** 
- **📸 Screenshots** se applicabile

### Feature Requests

- **📝 Clear description** della funzionalità
- **🎯 Use case** e motivazione
- **💡 Possible implementation** se hai idee
- **📊 Priority** (low/medium/high)

## 🏷️ Labels

- `bug` - Qualcosa non funziona
- `enhancement` - Nuova funzionalità
- `documentation` - Miglioramenti alla documentazione  
- `good first issue` - Buono per principianti
- `help wanted` - Aiuto extra richiesto
- `priority: high` - Richiede attenzione immediata

## 🎯 Areas for Contribution

### 🔧 Code
- React component optimization
- CSS animations e transitions
- Performance improvements
- Accessibility enhancements

### 📝 Documentation  
- README improvements
- Code comments
- API documentation
- Tutorial creation

### 🎨 Design
- UI/UX improvements
- Icon design
- Color palette refinements
- Mobile responsiveness

### 🧪 Testing
- Unit tests
- Integration tests
- E2E tests
- Performance testing

## 🎉 Recognition

Tutti i contributors saranno riconosciuti nel README e avranno accesso al Contributors team su GitHub.

## 📞 Contact

- **GitHub Issues** - Per bug reports e feature requests
- **GitHub Discussions** - Per domande generali
- **Email** - [Maintainer email] per questioni sensibili

---

**Grazie per il tuo contributo! 🙏**

*Happy coding!* ✨
