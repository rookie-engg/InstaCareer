import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ErrorProvider } from './globals/ErrorContext';
import { AlertProvider } from './globals/AlertContext';
import { LoadingProvider } from './globals/LoadingContext';
import App from './App';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <LoadingProvider>
        <ErrorProvider>
          <AlertProvider>
            <App />
          </AlertProvider>
        </ErrorProvider>
      </LoadingProvider>
    </BrowserRouter>
  </StrictMode>
);