import DownloadIcon from '@mui/icons-material/Download';
import { Alert, Box, Button, Tooltip, Typography } from '@mui/material';
import dayjs from 'dayjs';
import React from 'react';
import { useExport } from '@/hooks/useExport';
import { ChartConfig } from '@/hooks/useChartConfig';

const chartLabels: Record<ChartConfig['type'], string> = {
  scatter: 'scatter',
  histogram: 'histogram',
  box: 'box-plot',
};

const sanitizeSegment = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-');

const buildFilename = (chartType: ChartConfig['type'], config: ChartConfig) => {
  const segments = ['penguins', chartLabels[chartType]];

  if (chartType === 'scatter' && config.x && config.y) {
    segments.push(sanitizeSegment(`${config.x}-vs-${config.y}`));
  } else if (config.field) {
    segments.push(sanitizeSegment(config.field));
  }

  segments.push(dayjs().format('YYYYMMDD'));

  return `${segments.filter(Boolean).join('-')}.png`;
};

export interface ExportButtonProps {
  chartRef: React.RefObject<HTMLElement>;
  chartConfig: ChartConfig;
}

export const ExportButton: React.FC<ExportButtonProps> = ({
  chartRef,
  chartConfig,
}) => {
  const { exportToPNG } = useExport();
  const [isExporting, setIsExporting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleExport = async () => {
    if (!chartRef.current) {
      setError('Chart is not ready yet. Try again in a moment.');
      return;
    }

    setIsExporting(true);
    setError(null);

    try {
      const filename = buildFilename(chartConfig.type, chartConfig);
      await exportToPNG(chartRef.current, { filename, scale: 2 });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to export chart. Please try again.'
      );
    } finally {
      setIsExporting(false);
    }
  };

  const label = 'Download chart as PNG';

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      <Tooltip title={label} placement="top">
        <span>
          <Button
            variant="outlined"
            size="medium"
            startIcon={<DownloadIcon />}
            disabled={isExporting}
            onClick={handleExport}
            data-testid="export-chart-button"
          >
            {isExporting ? 'Exporting…' : 'Download PNG'}
          </Button>
        </span>
      </Tooltip>
      {error && (
        <Alert severity="error" variant="outlined">
          <Typography variant="caption" component="span">
            {error}
          </Typography>
        </Alert>
      )}
    </Box>
  );
};
