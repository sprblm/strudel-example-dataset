import React from 'react';
import { Box, Alert, Stack } from '@mui/material';
import { useChartConfig } from '@/hooks/useChartConfig';
import AxisControls from './AxisControls';
import ChartLegend from './ChartLegend';
import { ScatterPlot } from './charts/ScatterPlot';
import { Histogram } from './charts/Histogram';
import { BoxPlot } from './charts/BoxPlot';
import { ChartContainer } from './charts/ChartContainer';
import { usePenguinData } from '@/hooks/usePenguinData';
import { Penguin } from '@/types/penguin';
import { ExportButton } from '@/components/export/ExportButton';
import { formatFieldName } from '@/utils/chartHelpers';

export const VisualizationPanel: React.FC = () => {
  const { data: penguins = [] } = usePenguinData();
  const ALL_SPECIES = React.useMemo(
    () => ['Adelie', 'Chinstrap', 'Gentoo'],
    []
  );
  const [visibleSpecies, setVisibleSpecies] =
    React.useState<string[]>(ALL_SPECIES);
  const { config, updateConfig } = useChartConfig();
  const chartRef = React.useRef<HTMLDivElement>(null);
  const chartTitle = React.useMemo(() => {
    switch (config.type) {
      case 'scatter':
        if (config.x && config.y) {
          return `Scatter Plot: ${formatFieldName(config.x)} vs ${formatFieldName(config.y)}`;
        }
        return 'Scatter Plot';
      case 'histogram':
        if (config.field) {
          return `Histogram: ${formatFieldName(config.field)} (${config.bins ?? 10} bins)`;
        }
        return 'Histogram';
      case 'box':
        if (config.field) {
          return `Box Plot: ${formatFieldName(config.field)}`;
        }
        return 'Box Plot';
      default:
        return 'Chart';
    }
  }, [config]);

  const handleSpeciesToggle = (updatedSpecies: string[]) => {
    setVisibleSpecies(updatedSpecies);
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
            ref={chartRef}
            data={filteredData}
            chartType="scatter"
            fields={{ x: config.x!, y: config.y! }}
            title={chartTitle}
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
            ref={chartRef}
            data={filteredData}
            chartType="histogram"
            fields={{ field: config.field! }}
            title={chartTitle}
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
            ref={chartRef}
            data={filteredData}
            chartType="box"
            fields={{ field: config.field! }}
            title={chartTitle}
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
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={2}
        alignItems={{ xs: 'stretch', md: 'center' }}
        justifyContent="space-between"
        sx={{ mb: 2 }}
      >
        <AxisControls config={config} onConfigChange={updateConfig} />
        <Box
          sx={{
            display: 'flex',
            justifyContent: { xs: 'flex-start', md: 'flex-end' },
          }}
        >
          <ExportButton chartRef={chartRef} chartConfig={config} />
        </Box>
      </Stack>
      <ChartLegend
        allSpecies={ALL_SPECIES}
        initialVisibleSpecies={visibleSpecies}
        onToggleSpecies={handleSpeciesToggle}
      />
      {renderChart()}
    </Box>
  );
};
