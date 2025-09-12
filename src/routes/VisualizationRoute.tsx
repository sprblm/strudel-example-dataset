import React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { Box } from '@mui/material';
import { VisualizationPanel } from '@/components/visualizations/VisualizationPanel';

import { NumericField } from '@/components/visualizations/types';

export const Route = createFileRoute('/visualize/scatter')({
  parseParams: () => ({}),
  parseSearch: (search) => ({
    x: search.x as NumericField || 'bill_length_mm',
    y: search.y as NumericField || 'body_mass_g',
  }),
  stringifySearch: (search) => ({
    x: search.x,
    y: search.y,
  }),
});

export const VisualizationRoute = () => {
  return (
    <Box sx={{ p: 3 }}>
      <h1>Scatter Plot Visualization</h1>
      <VisualizationPanel />
    </Box>
  );
};
