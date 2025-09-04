import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

// Ottimizzazione per performance: crea il root solo una volta
const container = document.getElementById('root');

if (!container) {
  throw new Error('Root element not found! Make sure you have a <div id="root"></div> in your HTML.');
}

const root = createRoot(container);

// Render con error boundary implicito in StrictMode
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
