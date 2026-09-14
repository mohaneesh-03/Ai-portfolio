import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'

const appRoot = document.getElementById('root')

if (appRoot) {
  createRoot(appRoot).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
} else {
  console.error('Root element #root not found')
}