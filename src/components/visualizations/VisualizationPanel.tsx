import { useMemo, useRef, useState } from 'react';
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
import { ExportButton } from '@/components/export/ExportButton';
import { getFieldLabel, type NumericField } from './types';

export const VisualizationPanel: React.FC = () => {
  const { data: penguins = [] } = usePenguinData();
  const [visibleSpecies, setVisibleSpecies] = useState<string[]>([
    'Adelie',
    'Chinstrap',
    'Gentoo',
  ]);
  const { config, updateConfig } = useChartConfig();
  const chartContainerRef = useRef<HTMLElement | null>(null);

  const handleVisibilityChange = (species: string, visible: boolean) => {
    setVisibleSpecies((prev) => {
      if (visible) {
        return prev.includes(species) ? prev : [...prev, species];
      }
      return prev.filter((s) => s !== species);
    });
  };

  const filteredData = useMemo(
    () => penguins.filter((p: Penguin) => visibleSpecies.includes(p.species)),
    [penguins, visibleSpecies]
  );

  const resolvedConfig = useMemo(() => {
    const defaultField: NumericField = 'bill_length_mm';
    return {
      ...config,
      x: config.x ?? defaultField,
      y: config.y ?? ('body_mass_g' as NumericField),
      field: config.field ?? defaultField,
      bins: config.bins ?? 12,
    };
  }, [config]);

  const chartTitle = useMemo(() => {
    switch (resolvedConfig.type) {
      case 'scatter':
        return `Scatter Plot: ${getFieldLabel(resolvedConfig.x)} vs ${getFieldLabel(resolvedConfig.y)}`;
      case 'histogram':
        return `Histogram of ${getFieldLabel(resolvedConfig.field)}`;
      case 'box':
        return `Distribution of ${getFieldLabel(resolvedConfig.field)} by Species`;
      default:
        return 'Visualization';
    }
  }, [resolvedConfig]);

  const renderChart = () => {
    if (filteredData.length === 0) {
      return (
        <Alert severity="info" role="alert" aria-live="polite">
          No data available for the selected species. Adjust filters or legend
          to see penguin measurements.
        </Alert>
      );
    }

    switch (resolvedConfig.type) {
      case 'scatter':
        return (
          <ChartContainer
            data={filteredData}
            chartType="scatter"
            fields={{ x: resolvedConfig.x, y: resolvedConfig.y }}
            title={chartTitle}
            ref={chartContainerRef}
          >
            <ScatterPlot
              data={filteredData}
              xField={resolvedConfig.x}
              yField={resolvedConfig.y}
              visibleSpecies={visibleSpecies}
            />
          </ChartContainer>
        );
      case 'histogram':
        return (
          <ChartContainer
            data={filteredData}
            chartType="histogram"
            fields={{ field: resolvedConfig.field }}
            title={chartTitle}
            ref={chartContainerRef}
          >
            <Histogram
              data={filteredData}
              field={resolvedConfig.field}
              bins={resolvedConfig.bins ?? 12}
              visibleSpecies={visibleSpecies}
            />
          </ChartContainer>
        );
      case 'box':
        return (
          <ChartContainer
            data={filteredData}
            chartType="box"
            fields={{ field: resolvedConfig.field }}
            title={chartTitle}
            ref={chartContainerRef}
          >
            <BoxPlot
              data={filteredData}
              field={resolvedConfig.field}
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
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 2,
          mb: 2,
        }}
      >
        <AxisControls config={resolvedConfig} onConfigChange={updateConfig} />
        <ExportButton
          containerRef={chartContainerRef}
          chartType={resolvedConfig.type}
          title={chartTitle}
          disabled={filteredData.length === 0}
        />
      </Box>
      <ChartLegend
        visibleSpecies={visibleSpecies}
        onVisibilityChange={handleVisibilityChange}
      />
      {renderChart()}
    </Box>
  );
};
