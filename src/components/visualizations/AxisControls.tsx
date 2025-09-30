import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  type SelectChangeEvent,
} from '@mui/material';
import type { ChartConfig, ChartType } from '@/hooks/useChartConfig';
import { NUMERIC_FIELDS, getFieldLabel, type NumericField } from './types';

interface AxisControlsProps {
  config: ChartConfig;
  onConfigChange: (updates: Partial<ChartConfig>) => void;
}

const chartTypes: ReadonlyArray<{ label: string; value: ChartType }> = [
  { label: 'Scatter', value: 'scatter' },
  { label: 'Histogram', value: 'histogram' },
  { label: 'Box Plot', value: 'box' },
];

const AxisControls = ({ config, onConfigChange }: AxisControlsProps) => {
  const handleTypeChange = (event: SelectChangeEvent<ChartType>) => {
    onConfigChange({ type: event.target.value as ChartType });
  };

  const handleAxisChange =
    (axis: 'x' | 'y') => (event: SelectChangeEvent<NumericField>) => {
      onConfigChange({ [axis]: event.target.value as NumericField });
    };

  const handleFieldChange = (event: SelectChangeEvent<NumericField>) => {
    onConfigChange({ field: event.target.value as NumericField });
  };

  const handleBinsChange = (event: SelectChangeEvent<number>) => {
    const parsed = Number(event.target.value);
    onConfigChange({ bins: Number.isFinite(parsed) ? parsed : undefined });
  };

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 2,
        flexWrap: 'wrap',
        alignItems: 'center',
      }}
      role="group"
      aria-label="Chart configuration controls"
    >
      <FormControl size="small" sx={{ minWidth: 160 }}>
        <InputLabel id="chart-type-label">Chart Type</InputLabel>
        <Select
          labelId="chart-type-label"
          id="chart-type-select"
          value={config.type}
          label="Chart Type"
          onChange={handleTypeChange}
        >
          {chartTypes.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {config.type === 'scatter' && (
        <>
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel id="x-axis-select-label">X-axis</InputLabel>
            <Select
              labelId="x-axis-select-label"
              id="x-axis-select"
              value={config.x ?? NUMERIC_FIELDS[0]}
              label="X-axis"
              onChange={handleAxisChange('x')}
            >
              {NUMERIC_FIELDS.map((field) => (
                <MenuItem key={field} value={field}>
                  {getFieldLabel(field)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel id="y-axis-select-label">Y-axis</InputLabel>
            <Select
              labelId="y-axis-select-label"
              id="y-axis-select"
              value={config.y ?? NUMERIC_FIELDS[1]}
              label="Y-axis"
              onChange={handleAxisChange('y')}
            >
              {NUMERIC_FIELDS.map((field) => (
                <MenuItem key={field} value={field}>
                  {getFieldLabel(field)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </>
      )}

      {config.type !== 'scatter' && (
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel id="field-select-label">Field</InputLabel>
          <Select
            labelId="field-select-label"
            id="field-select"
            value={config.field ?? NUMERIC_FIELDS[0]}
            label="Field"
            onChange={handleFieldChange}
          >
            {NUMERIC_FIELDS.map((field) => (
              <MenuItem key={field} value={field}>
                {getFieldLabel(field)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}

      {config.type === 'histogram' && (
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel id="histogram-bins-label">Bins</InputLabel>
          <Select
            labelId="histogram-bins-label"
            id="histogram-bins-select"
            value={config.bins ?? 10}
            label="Bins"
            onChange={handleBinsChange}
          >
            {[8, 10, 12, 15, 20].map((binCount) => (
              <MenuItem key={binCount} value={binCount}>
                {binCount}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
    </Box>
  );
};

export default AxisControls;
export { AxisControls };
