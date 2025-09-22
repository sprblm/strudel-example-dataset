import React from 'react';
import { Box, Alert } from '@mui/material';
import { useChartConfig } from '@/hooks/useChartConfig';
import { AxisControls } from './AxisControls';
import { ChartLegend } from './ChartLegend';
import { ScatterPlot } from './charts/ScatterPlot';
import { Histogram } from './charts/Histogram';
import { BoxPlot } from './charts/BoxPlot';
import { ChartContainer } from './charts/ChartContainer';
import { usePenguinData } from '@/hooks/usePenguinData';
import { Penguin } from '@/types/penguin';

export const VisualizationPanel: React.FC = () => {
  const { data: penguins = [] } = usePenguinData();
  const [visibleSpecies, setVisibleSpecies] = React.useState<string[]>([
    'Adelie',
    'Chinstrap',
    'Gentoo',
  ]);
  const { config, updateConfig } = useChartConfig();

  const handleVisibilityChange = (species: string, visible: boolean) => {
    setVisibleSpecies((prev) =>
      visible ? [...prev, species] : prev.filter((s) => s !== species)
    );
  };

  const filteredData = React.useMemo(
    () => penguins.filter((p: Penguin) => visibleSpecies.includes(p.species)),
    [penguins, visibleSpecies]
  );

  if (filteredData.length === 0) {
    return (
      <Alert severity="info" role="alert" aria-live="polite">
        No data available for the selected species. Adjust filters or legend to
        see penguin measurements.
      </Alert>
    );
  }

  const renderChart = () => {
    switch (config.type) {
      case 'scatter':
        return (
          <ChartContainer
            data={filteredData}
            chartType="scatter"
            fields={{ x: config.x!, y: config.y! }}
          >
            <ScatterPlot
              data={filteredData}
              xField={config.x!}
              yField={config.y!}
              visibleSpecies={visibleSpecies}
            />
          </ChartContainer>
        );
      case 'histogram':
        return (
          <ChartContainer
            data={filteredData}
            chartType="histogram"
            fields={{ field: config.field! }}
          >
            <Histogram
              data={filteredData}
              field={config.field!}
              bins={config.bins!}
              visibleSpecies={visibleSpecies}
            />
          </ChartContainer>
        );
      case 'box':
        return (
          <ChartContainer
            data={filteredData}
            chartType="box"
            fields={{ field: config.field! }}
          >
            <BoxPlot
              data={filteredData}
              field={config.field!}
              visibleSpecies={visibleSpecies}
            />
          </ChartContainer>
        );
      default:
        return <Alert severity="warning">Chart type not supported</Alert>;
    }
  };

  return (
    <Box sx={{ p: 2 }} data-testid="visualization-panel">
      <AxisControls config={config} onConfigChange={updateConfig} />
      <ChartLegend onVisibilityChange={handleVisibilityChange} />
      {renderChart()}
    </Box>
  );
};
