import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { UserProvider } from './contexts/UserContext'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { Toaster } from 'react-hot-toast'
import { Analytics } from "@vercel/analytics/react"
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <UserProvider>
      <HelmetProvider>
        <BrowserRouter>
          <App />
          <Analytics />
          <Toaster />
        </BrowserRouter>
      </HelmetProvider>
    </UserProvider>
  </React.StrictMode>,
)
