import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { queryClient } from './config/query-client.ts';
import { BrowserRouter } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ThemeProvider } from './components/theme-provider.tsx';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
        <ReactQueryDevtools
          position='bottom'
          buttonPosition='bottom-left'
          initialIsOpen={false}
        />
      </QueryClientProvider>
    </ThemeProvider>
  </StrictMode>
);
