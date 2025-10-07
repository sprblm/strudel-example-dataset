import { createFileRoute } from '@tanstack/react-router';
import { Container } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppProvider } from '@/context/ContextProvider';
import { VisualizationPanel } from '@/components/visualizations/VisualizationPanel';

export const Route = createFileRoute('/visualizations/')({
  component: VisualizationsPage,
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
});

function VisualizationsPage() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <Container maxWidth="xl" sx={{ mt: 3, mb: 3 }}>
          <VisualizationPanel />
        </Container>
      </AppProvider>
    </QueryClientProvider>
  );
}
