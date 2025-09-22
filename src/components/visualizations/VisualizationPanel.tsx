import React from 'react';
import { Alert, Box, Stack, useMediaQuery, useTheme } from '@mui/material';
import { useChartConfig } from '@/hooks/useChartConfig';
import { AxisControls } from './AxisControls';
import { ChartLegend } from './ChartLegend';
import { ScatterPlot } from './charts/ScatterPlot';
import { Histogram } from './charts/Histogram';
import { BoxPlot } from './charts/BoxPlot';
import { ChartContainer } from './charts/ChartContainer';
import { usePenguinData } from '@/hooks/usePenguinData';
import { Penguin } from '@/types/penguin';
import { NumericField } from './types';

export const VisualizationPanel: React.FC = () => {
  const { data: penguins = [] } = usePenguinData();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [visibleSpecies, setVisibleSpecies] = React.useState<string[]>([
    'Adelie',
    'Chinstrap',
    'Gentoo',
  ]);
  const { config, updateConfig } = useChartConfig();

  const handleVisibilityChange = (speciesList: string[]) => {
    setVisibleSpecies(speciesList);
  };

  const filteredData = React.useMemo(
    () => penguins.filter((p: Penguin) => visibleSpecies.includes(p.species)),
    [penguins, visibleSpecies]
  );

  const renderChart = () => {
    if (filteredData.length === 0) {
      return (
        <Alert severity="info" role="alert" aria-live="polite">
          No data available for the selected species. Adjust filters or legend
          to see penguin measurements.
        </Alert>
      );
    }

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
    <Stack
      spacing={isMobile ? 2 : 3}
      sx={{
        p: { xs: 1, md: 2 },
        borderRadius: 2,
        backgroundColor: 'background.paper',
      }}
      data-testid="visualization-panel"
    >
      {config.type === 'scatter' && (
        <AxisControls
          xAxis={config.x ?? 'bill_length_mm'}
          yAxis={config.y ?? 'body_mass_g'}
          onAxisChange={(axis, value) =>
            updateConfig(
              axis === 'x'
                ? { x: value as NumericField }
                : { y: value as NumericField }
            )
          }
        />
      )}
      <ChartLegend
        allSpecies={['Adelie', 'Chinstrap', 'Gentoo']}
        initialVisibleSpecies={visibleSpecies}
        onToggleSpecies={handleVisibilityChange}
      />
      <Box>{renderChart()}</Box>
    </Stack>
  );
};
