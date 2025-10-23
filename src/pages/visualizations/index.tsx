import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { Button, Container, Stack } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { AppProvider } from '@/context/ContextProvider';
import { VisualizationPanel } from '@/components/visualizations/VisualizationPanel';
import { AppLink } from '@/components/AppLink';

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
          <Stack direction="row" sx={{ mb: 2 }}>
            <Button
              component={AppLink}
              to="/"
              variant="text"
              startIcon={<ArrowBackIosNewIcon fontSize="small" />}
            >
              Back to home
            </Button>
          </Stack>
          <VisualizationPanel />
        </Container>
      </AppProvider>
    </QueryClientProvider>
  );
}
