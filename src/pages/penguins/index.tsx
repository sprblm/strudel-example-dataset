import { createFileRoute } from '@tanstack/react-router';
import {
  Box,
  Button,
  Collapse,
  Container,
  Grid,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';
import React from 'react';
import { DataTable } from '@/components/table/DataTable';
import { FiltersPanel } from '@/components/FiltersPanel';

const FILTERS_STORAGE_KEY = 'penguins-filters-open';

export const Route = createFileRoute('/penguins/')({
  component: PenguinsPage,
});

function PenguinsPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [filtersOpen, setFiltersOpen] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    if (!isMobile) {
      setFiltersOpen(true);
      window.localStorage.setItem(FILTERS_STORAGE_KEY, 'true');
      return;
    }

    const stored = window.localStorage.getItem(FILTERS_STORAGE_KEY);
    if (stored !== null) {
      setFiltersOpen(stored === 'true');
      return;
    }

    setFiltersOpen(false);
    window.localStorage.setItem(FILTERS_STORAGE_KEY, 'false');
  }, [isMobile]);

  React.useEffect(() => {
    if (filtersOpen === null || typeof window === 'undefined') {
      return;
    }
    window.localStorage.setItem(
      FILTERS_STORAGE_KEY,
      filtersOpen ? 'true' : 'false'
    );
  }, [filtersOpen]);

  const handleToggleFilters = () => {
    setFiltersOpen((prev) => !(prev ?? false));
  };

  const renderDesktopLayout = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={3}>
        <FiltersPanel sx={{ position: 'sticky', top: theme.spacing(3) }} />
      </Grid>
      <Grid item xs={12} md={9}>
        <DataTable />
      </Grid>
    </Grid>
  );

  const renderMobileLayout = () => (
    <Stack spacing={3}>
      <Box>
        <Button
          variant="contained"
          color={filtersOpen ? 'primary' : 'secondary'}
          onClick={handleToggleFilters}
          startIcon={filtersOpen ? <CloseIcon /> : <FilterListIcon />}
          data-testid="filters-toggle"
          sx={{
            minHeight: 56,
            borderRadius: 2,
            justifyContent: 'flex-start',
          }}
        >
          {filtersOpen ? 'Hide filters' : 'Show filters'}
        </Button>
        <Collapse in={!!filtersOpen} unmountOnExit>
          <FiltersPanel
            onClose={() => setFiltersOpen(false)}
            sx={{
              mt: 2,
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
            }}
          />
        </Collapse>
      </Box>
      <DataTable />
    </Stack>
  );

  return (
    <Container maxWidth="xl" sx={{ mt: 3, mb: 3 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Palmer Penguins Explorer
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Browse and explore the Palmer Penguins dataset with interactive
          filtering and sorting.
        </Typography>
      </Box>
      {isMobile ? renderMobileLayout() : renderDesktopLayout()}
    </Container>
  );
}
