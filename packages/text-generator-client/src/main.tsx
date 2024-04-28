import React from 'react'
import { createRoot } from 'react-dom/client'
import { CssBaseline } from '@mui/material'
import { BrowserRouter } from 'react-router-dom'
import { Auth0ProviderWithNavigate } from './AuthProviderWithNavigate.tsx'
import App from './App.tsx'
import './styles.css'

const container = document.getElementById('root')
const root = createRoot(container!)

root.render(
  <React.StrictMode>
    <CssBaseline />
    <BrowserRouter>
      <Auth0ProviderWithNavigate>
        <App />
      </Auth0ProviderWithNavigate>
    </BrowserRouter>
  </React.StrictMode>
)
