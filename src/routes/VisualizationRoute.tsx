import React, { useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { usePenguinData } from '@/hooks/usePenguinData';
import { AxisControls } from '@/components/visualizations/AxisControls';
import { ChartLegend } from '@/components/visualizations/ChartLegend';
import { ScatterPlot } from '@/components/visualizations/charts/ScatterPlot';
import { useTheme } from '@mui/material/styles';

const NUMERIC_FIELDS = [
  'bill_length_mm',
  'bill_depth_mm',
  'flipper_length_mm',
  'body_mass_g',
];

import React, { lazy, Suspense, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { usePenguinData } from '@/hooks/usePenguinData';
import { AxisControls } from '@/components/visualizations/AxisControls';
import { ChartLegend } from '@/components/visualizations/ChartLegend';

const ScatterPlot = lazy(
  () => import('@/components/visualizations/charts/ScatterPlot')
);

const NUMERIC_FIELDS = [
  'bill_length_mm',
  'bill_depth_mm',
  'flipper_length_mm',
  'body_mass_g',
];

const VisualizationRoute: React.FC = () => {
  const { chartType } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [visibleSpecies, setVisibleSpecies] = useState(
    new Set(['Adelie', 'Chinstrap', 'Gentoo'])
  );
  const { data: penguins } = usePenguinData();

  const x = searchParams.get('x') || 'bill_length_mm';
  const y = searchParams.get('y') || 'body_mass_g';

  // Validate axes
  const validX = NUMERIC_FIELDS.includes(x as any) ? x : 'bill_length_mm';
  const validY = NUMERIC_FIELDS.includes(y as any) ? y : 'body_mass_g';
  if (x !== validX || y !== validY) {
    searchParams.set('x', validX);
    searchParams.set('y', validY);
    setSearchParams(searchParams);
    return <div>Loading valid axes...</div>; // Temporary message
  }

  const handleAxisChange = (axis: 'x' | 'y', value: string) => {
    searchParams.set(axis, value);
    setSearchParams(searchParams, { replace: true });
  };

  const handleToggleSpecies = (speciesList: string[]) => {
    setVisibleSpecies(new Set(speciesList));
  };

  if (chartType !== 'scatter') {
    return <div>Please select a scatter plot view.</div>;
  }

  return (
    <div>
      <AxisControls xAxis={x} yAxis={y} onAxisChange={handleAxisChange} />
      <ChartLegend
        allSpecies={['Adelie', 'Chinstrap', 'Gentoo']}
        initialVisibleSpecies={Array.from(visibleSpecies)}
        onToggleSpecies={handleToggleSpecies}
      />
      <Suspense fallback={<div>Loading chart...</div>}>
        <ScatterPlot
          data={penguins || []}
          xField={x}
          yField={y}
          visibleSpecies={visibleSpecies}
        />
      </Suspense>
    </div>
  );
};

export default VisualizationRoute;
