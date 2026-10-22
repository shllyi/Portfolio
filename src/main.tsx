import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import logo from './assets/logo.png'
import './index.css'
import App from './App.tsx'

const favicon = document.querySelector<HTMLLinkElement>('link[rel="icon"]')
if (favicon) {
  favicon.href = logo
  favicon.type = 'image/png'
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
