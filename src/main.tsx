import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
// Self-hosted type system: Space Grotesk for display, Inter for body copy.
import '@fontsource-variable/space-grotesk';
import '@fontsource-variable/inter';
import './styles.css';
// AI Lab tool panels — kept separate from the site-wide stylesheet.
import './styles/lab-tools.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
