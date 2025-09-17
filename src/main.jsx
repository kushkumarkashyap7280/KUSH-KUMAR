import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from 'sonner'

import './index.css'
import App from './App.jsx'
import { setupAxiosInterceptors } from './utils/axiosConfig'

// Setup global axios interceptors for authentication
setupAxiosInterceptors();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <Toaster
      position="top-center"
      theme="system"
      closeButton
      expand
      toastOptions={{
        duration: 2500,
        style: {
          background: 'color-mix(in srgb, var(--card, #121219) 70%, transparent)',
          backdropFilter: 'blur(8px) saturate(140%)',
          WebkitBackdropFilter: 'blur(8px) saturate(140%)',
          border: '1px solid var(--border, #2a2a35)',
          color: 'var(--text, #e6e6f0)',
          boxShadow: '0 10px 30px rgba(0,0,0,0.30)'
        },
        classNames: {
          toast: 'rounded-xl',
          title: 'font-semibold',
          description: 'opacity-90',
          actionButton: 'bg-[var(--accent,#ef4444)] text-white',
          cancelButton: 'bg-transparent border border-[color:var(--border,#2a2a35)] text-[var(--text,#e6e6f0)]'
        }
      }}
      richColors
    />
  </StrictMode>,
)
