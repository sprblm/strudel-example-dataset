import React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { Box, Typography, Tabs, Tab } from '@mui/material';
import { VisualizationPanel } from '@/components/visualizations/VisualizationPanel';

export const Route = createFileRoute('/visualize/:type')({
  parseParams: ({ type }) => ({ type }),
  parseSearch: (search) => search,
  stringifySearch: (search) => search,
  validateSearch: (search) => {
    const validTypes = ['scatter', 'histogram', 'box'] as const;
    const type = (search.type as (typeof validTypes)[number]) || 'scatter';
    return { type };
  },
});

export const VisualizationRoute = () => {
  const { type } = Route.useParams();

  const titleMap: Record<typeof type, string> = {
    scatter: 'Scatter Plot Explorer',
    histogram: 'Distribution Analysis (Histogram)',
    box: 'Distribution Comparison (Box Plot)',
  };

  const handleTabChange = (
    event: React.SyntheticEvent,
    newValue: typeof type
  ) => {
    // Update URL to new visualization type
    window.location.href = `/visualize/${newValue}${window.location.search}`;
  };

  return (
    <Box sx={{ p: 3, maxWidth: '100%' }}>
      <Typography variant="h4" gutterBottom component="h1">
        {titleMap[type]} - Penguin Measurements Visualization
      </Typography>

      <Typography
        variant="body1"
        gutterBottom
        sx={{ mb: 3, color: 'text.secondary' }}
      >
        Analyze relationships and distributions in the Palmer Penguins dataset.
        Select variables and adjust species filters to explore patterns.
      </Typography>

      {/* Navigation Tabs */}
      <Tabs
        value={type}
        onChange={handleTabChange}
        centered
        variant="fullWidth"
        sx={{
          mb: 3,
          '& .MuiTab-root': { minHeight: 48 },
          backgroundColor: 'background.paper',
          borderRadius: 1,
          boxShadow: 1,
        }}
        aria-label="Visualization type selection"
      >
        <Tab
          label="Scatter Plot"
          value="scatter"
          aria-label="Switch to scatter plot visualization"
          sx={{
            '&.Mui-selected': { color: 'primary.main' },
            textTransform: 'none',
            fontWeight: 500,
          }}
        />
        <Tab
          label="Histogram"
          value="histogram"
          aria-label="Switch to histogram distribution analysis"
          sx={{
            '&.Mui-selected': { color: 'primary.main' },
            textTransform: 'none',
            fontWeight: 500,
          }}
        />
        <Tab
          label="Box Plot"
          value="box"
          aria-label="Switch to box plot distribution comparison"
          sx={{
            '&.Mui-selected': { color: 'primary.main' },
            textTransform: 'none',
            fontWeight: 500,
          }}
        />
      </Tabs>

      {/* Main Visualization Content */}
      <Box
        component="main"
        sx={{
          minHeight: '60vh',
          borderRadius: 2,
          overflow: 'hidden',
          boxShadow: 3,
          backgroundColor: 'background.default',
        }}
        role="main"
        aria-label={`${titleMap[type]} interactive visualization`}
      >
        <VisualizationPanel />
      </Box>

      {/* Usage Instructions */}
      <Box sx={{ mt: 4, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
        <Typography variant="h6" gutterBottom sx={{ color: 'text.primary' }}>
          How to Use This Visualization
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {type === 'scatter' && (
            <>
              • Use the X and Y axis selectors to choose which penguin
              measurements to plot against each other
              <br />
              • Points are colored by species (blue=Adelie, orange=Chinstrap,
              green=Gentoo)
              <br />
              • Hover over points to see detailed measurements for individual
              penguins
              <br />• Use the legend to filter species visibility
            </>
          )}
          {type === 'histogram' && (
            <>
              • Select a numeric variable to analyze its distribution across all
              species
              <br />
              • Adjust the number of bins to control histogram granularity
              (5=fine, 20=coarse)
              <br />
              • Overlapping bars show distribution patterns for each species
              <br />• Use the legend to compare specific species distributions
            </>
          )}
          {type === 'box' && (
            <>
              • Select a numeric variable to compare its distribution across
              species
              <br />
              • Each box shows quartiles (Q1, median, Q3) with whiskers
              extending to 1.5×IQR
              <br />
              • Outlier points are shown as circles beyond the whiskers
              <br />
              • Use the legend to focus on specific species comparisons
              <br />• Hover over boxes for detailed statistical information
            </>
          )}
        </Typography>
      </Box>
    </Box>
  );
};
