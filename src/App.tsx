import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createRouter, RouterProvider } from '@tanstack/react-router';
import React from 'react';
import { ApiModal } from './components/ApiModal';
import { HelpModal } from './components/modals/HelpModal';
import { AppProvider } from './context/ContextProvider';
import { AccessibilityProvider } from './context/AccessibilityContext';
import { routeTree } from './routeTree.gen';

export const router = createRouter({ routeTree });

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <AccessibilityProvider>
          <AppProvider>
            <RouterProvider
              router={router}
              basepath={import.meta.env.BASE_URL}
            />
            <ApiModal />
            <HelpModal />
          </AppProvider>
        </AccessibilityProvider>
      </LocalizationProvider>
    </QueryClientProvider>
  );
};

export default App;
