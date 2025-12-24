import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import App from './app/App.tsx'
import { Providers } from './app/providers.tsx'
import RootLayout from './app/layouts/RootLayout.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Providers>
      <RootLayout>
        <App />
      </RootLayout>
    </Providers>
  </StrictMode>,
)
