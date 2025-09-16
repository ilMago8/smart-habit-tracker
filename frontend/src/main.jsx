import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

// Add some bootstrap to ensure everything works
document.addEventListener('DOMContentLoaded', () => {
  // Performance optimization: create root only once
  const container = document.getElementById('root');

  if (!container) {
    throw new Error('Root element not found! Make sure you have a <div id="root"></div> in your HTML.');
  }

  const root = createRoot(container);

  // Render with implicit error boundary in StrictMode
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
});
