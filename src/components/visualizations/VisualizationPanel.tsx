import { useEffect, useMemo, useRef, useState } from 'react';
import { Box, Alert, Stack, Button } from '@mui/material';
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
import { ShareButton } from '@/components/export/ShareButton';
import { getFieldLabel, type NumericField } from './types';
import { useAppState } from '@/context/ContextProvider';
import {
  updateDietFilter,
  updateIslandFilter,
  updateLifeStageFilter,
  updateSexFilter,
  updateSpeciesFilter,
  updateYearRangeFilter,
} from '@/context/actions';
import { useURLSync } from '@/hooks/useURLSync';
import { useAccessibility } from '@/context/AccessibilityContext';

export const VisualizationPanel: React.FC = () => {
  const { state, dispatch } = useAppState();
  const { data: penguins = [] } = usePenguinData();
  const [visibleSpecies, setVisibleSpecies] = useState<string[]>([
    'Adelie',
    'Chinstrap',
    'Gentoo',
  ]);
  const { config, updateConfig } = useChartConfig();
  const chartContainerRef = useRef<HTMLElement | null>(null);
  const { announce, highContrastEnabled, toggleHighContrast } =
    useAccessibility();
  const hasAnnouncedContrastChange = useRef(false);

  const handleVisibilityChange = (species: string, visible: boolean) => {
    setVisibleSpecies((prev) => {
      if (visible) {
        return prev.includes(species) ? prev : [...prev, species];
      }
      return prev.filter((s) => s !== species);
    });
  };

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

  const { buildShareUrl, hydrated } = useURLSync({
    chartConfig: resolvedConfig,
    onChartConfigChange: updateConfig,
    filters: {
      species: state.selectedSpecies,
      island: state.selectedIsland,
      sex: state.selectedSex,
      diet: state.selectedDiet,
      lifeStage: state.selectedLifeStage,
      yearRange: state.selectedYearRange,
    },
    setFilters: {
      setSpecies: (species: string[]) => dispatch(updateSpeciesFilter(species)),
      setIsland: (island: string) => dispatch(updateIslandFilter(island)),
      setSex: (sex: string) => dispatch(updateSexFilter(sex)),
      setDiet: (diet: string[]) => dispatch(updateDietFilter(diet)),
      setLifeStage: (lifeStage: string) =>
        dispatch(updateLifeStageFilter(lifeStage)),
      setYearRange: (range: readonly [number, number]) =>
        dispatch(updateYearRangeFilter(range)),
    },
  });

  const filteredData = useMemo(
    () => penguins.filter((p: Penguin) => visibleSpecies.includes(p.species)),
    [penguins, visibleSpecies]
  );

  const chartContainerClassName = highContrastEnabled
    ? 'chart-container--high-contrast'
    : undefined;

  useEffect(() => {
    if (!hasAnnouncedContrastChange.current) {
      hasAnnouncedContrastChange.current = true;
      return;
    }

    announce(
      highContrastEnabled
        ? 'High contrast mode enabled. Charts use stronger contrast.'
        : 'Standard contrast restored.'
    );
  }, [announce, highContrastEnabled]);

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
            className={chartContainerClassName}
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
            className={chartContainerClassName}
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
            className={chartContainerClassName}
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
      <Stack spacing={2.5} sx={{ mb: 2.5 }}>
        <Stack
          direction={{ xs: 'column', lg: 'row' }}
          spacing={2}
          alignItems={{ xs: 'stretch', lg: 'center' }}
          justifyContent="space-between"
        >
          <AxisControls config={resolvedConfig} onConfigChange={updateConfig} />
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={1}
            alignItems={{ xs: 'stretch', sm: 'center' }}
          >
            <Button
              component="a"
              href="https://strudel.science/strudel-kit/docs/"
              target="_blank"
              rel="noreferrer"
              variant="outlined"
              aria-label="Open Strudel Kit documentation (opens in a new tab)"
            >
              Documentation
            </Button>
            <Button
              variant={highContrastEnabled ? 'contained' : 'outlined'}
              onClick={() => toggleHighContrast()}
              aria-pressed={highContrastEnabled}
            >
              {highContrastEnabled ? 'Standard contrast' : 'High contrast'}
            </Button>
            <Stack direction="row" spacing={1} alignItems="center">
              <ShareButton
                getShareUrl={buildShareUrl}
                disabled={!hydrated || filteredData.length === 0}
              />
              <ExportButton
                containerRef={chartContainerRef}
                chartType={resolvedConfig.type}
                title={chartTitle}
                disabled={filteredData.length === 0}
              />
            </Stack>
          </Stack>
        </Stack>
      </Stack>
      <ChartLegend
        visibleSpecies={visibleSpecies}
        onVisibilityChange={handleVisibilityChange}
      />
      {renderChart()}
    </Box>
  );
};
