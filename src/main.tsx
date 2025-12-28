import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ErrorBoundary } from 'react-error-boundary'
import { GlobalProvider } from './utils/global_context.tsx'
import DisplayError from './components/display_error.tsx'
import { Analytics } from "@vercel/analytics/react"

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary FallbackComponent={DisplayError}>
      <GlobalProvider>
        <App />
        <Analytics />
      </GlobalProvider>
    </ErrorBoundary>
  </StrictMode>
)
