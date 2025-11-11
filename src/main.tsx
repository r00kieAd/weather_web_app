import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ErrorBoundary, FallbackProps } from 'react-error-boundary'
import { GlobalProvider } from './utils/global_context.tsx'
import DisplayError from './components/display_error.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary FallbackComponent={DisplayError}>
      <GlobalProvider>
      <App />
      </GlobalProvider>
    </ErrorBoundary>
  </StrictMode>
)
