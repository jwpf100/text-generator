import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { Box, CssBaseline } from '@mui/material'
import { BrowserRouter } from 'react-router-dom'
import { Auth0ProviderWithNavigate } from './AuthProviderWithNavigate.tsx'

import { NavBar } from './components/NavBar'
const container = document.getElementById('root')
const root = createRoot(container!)

root.render(
  <React.StrictMode>
    <CssBaseline />
    <BrowserRouter>
      <Auth0ProviderWithNavigate>
        <Box className={'app-container'}>
          <NavBar />
          <App />
        </Box>
      </Auth0ProviderWithNavigate>
    </BrowserRouter>
  </React.StrictMode>
)
