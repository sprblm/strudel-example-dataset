import React from 'react';
import { Box } from '@mui/material';
import { AxisControls } from './AxisControls';
import { ChartLegend } from './ChartLegend';
import { ScatterPlot } from './charts/ScatterPlot';
import { useSearch } from '@tanstack/router';
import { usePenguinData } from '@/hooks/usePenguinData';
import { NumericField } from './types';

export const VisualizationPanel: React.FC = () => {
  const { data: penguins } = usePenguinData();
  const [currentX, setCurrentX] =
    React.useState<NumericField>('bill_length_mm');
  const [currentY, setCurrentY] = React.useState<NumericField>('body_mass_g');
  const [visibleSpecies, setVisibleSpecies] = React.useState<string[]>([
    'Adelie',
    'Chinstrap',
    'Gentoo',
  ]);

  const handleAxisChange = (axis: 'x' | 'y', value: NumericField) => {
    if (axis === 'x') setCurrentX(value);
    else setCurrentY(value);
  };

  const search = useSearch({ from: '/visualize/scatter' });
  const handleVisibilityChange = (species: string, visible: boolean) => {
    setVisibleSpecies((prev) =>
      visible ? [...prev, species] : prev.filter((s) => s !== species)
    );
  };

  React.useEffect(() => {
    const params = new URLSearchParams();
    if (currentX) params.set('x', currentX);
    if (currentY) params.set('y', currentY);
    // Note: visibleSpecies could be serialized to URL if needed
    const url = `/visualize/scatter?${params.toString()}`;
    window.history.replaceState({}, '', url);
  }, [currentX, currentY]);

  React.useEffect(() => {
    if (search.x) setCurrentX(search.x as NumericField);
    if (search.y) setCurrentY(search.y as NumericField);
  }, [search]);

  const filteredData =
    penguins?.filter((p) => visibleSpecies.includes(p.species)) || [];

  return (
    <Box sx={{ p: 2 }}>
      <AxisControls
        currentX={currentX}
        currentY={currentY}
        onAxisChange={handleAxisChange}
      />
      <ChartLegend onVisibilityChange={handleVisibilityChange} />
      <ScatterPlot data={filteredData} xField={currentX} yField={currentY} visibleSpecies={visibleSpecies} />
    </Box>
  );
};
