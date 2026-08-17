import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Redirect to home (/) on any hard refresh or direct link access
if (window.location.pathname !== '/') {
  window.history.replaceState(null, '', '/');
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
