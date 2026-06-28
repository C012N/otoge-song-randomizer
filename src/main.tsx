// メイン

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename="/otoge-song-randomizer">
      <App />
    </BrowserRouter>
  </StrictMode>,
)