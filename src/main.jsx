import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './stylesheet.css'
import App from './App.jsx'
import { HashRouter } from 'react-router-dom'
import { CartProvider } from './Context/CartContext.jsx'
import { ToastProvider } from './Context/ToastContext.jsx'

createRoot(document.getElementById('root')).render(
  <HashRouter>
    <ToastProvider>
      <CartProvider>
        <App />
      </CartProvider>
    </ToastProvider>
  </HashRouter>,
)
