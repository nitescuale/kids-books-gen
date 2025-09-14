import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import SwipeApp from './SwipeApp.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SwipeApp />
  </StrictMode>,
)
