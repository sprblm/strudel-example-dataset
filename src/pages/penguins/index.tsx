import { createFileRoute } from '@tanstack/react-router';
import { Box, Container, Typography, Grid } from '@mui/material';
import { DataTable } from '@/components/table/DataTable';
import { SpeciesFilter } from '@/components/filters/SpeciesFilter';

export const Route = createFileRoute('/penguins/')({
  component: PenguinsPage,
});

function PenguinsPage() {
  return (
    <Container maxWidth="xl" sx={{ mt: 3, mb: 3 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Palmer Penguins Explorer
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Browse and explore the Palmer Penguins dataset with interactive filtering and sorting.
        </Typography>
      </Box>
      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <SpeciesFilter />
        </Grid>
        <Grid item xs={12} md={9}>
          <DataTable />
        </Grid>
      </Grid>
    </Container>
  );
}