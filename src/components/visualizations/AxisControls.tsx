import React from 'react';
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Slider,
  SelectChangeEvent,
} from '@mui/material';

type NumericField =
  | 'bill_length_mm'
  | 'bill_depth_mm'
  | 'flipper_length_mm'
  | 'body_mass_g';

interface AxisControlsProps {
  config: {
    type: 'scatter' | 'histogram' | 'box';
    x?: NumericField;
    y?: NumericField;
    field?: NumericField;
    bins?: number;
  };
  onConfigChange: (
    updates: Partial<{
      x?: NumericField;
      y?: NumericField;
      field?: NumericField;
      bins?: number;
    }>
  ) => void;
}

const numericFields: NumericField[] = [
  'bill_length_mm',
  'bill_depth_mm',
  'flipper_length_mm',
  'body_mass_g',
];

const fieldLabels: Record<NumericField, string> = {
  bill_length_mm: 'Bill Length (mm)',
  bill_depth_mm: 'Bill Depth (mm)',
  flipper_length_mm: 'Flipper Length (mm)',
  body_mass_g: 'Body Mass (g)',
} as const;

export const AxisControls: React.FC<AxisControlsProps> = ({
  config,
  onConfigChange,
}) => {
  const handleFieldChange = (event: SelectChangeEvent<NumericField>) => {
    onConfigChange({ field: event.target.value as NumericField });
  };

  const handleBinsChange = (_event: Event, value: number | number[]) => {
    onConfigChange({ bins: value as number });
  };

  if (config.type === 'scatter') {
    return (
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel id="x-axis-label">X Axis</InputLabel>
          <Select
            labelId="x-axis-label"
            value={config.x || ''}
            label="X Axis"
            onChange={(e) =>
              onConfigChange({ x: e.target.value as NumericField })
            }
            aria-label="Select X axis variable"
          >
            {numericFields.map((field) => (
              <MenuItem key={field} value={field}>
                {fieldLabels[field]}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel id="y-axis-label">Y Axis</InputLabel>
          <Select
            labelId="y-axis-label"
            value={config.y || ''}
            label="Y Axis"
            onChange={(e) =>
              onConfigChange({ y: e.target.value as NumericField })
            }
            aria-label="Select Y axis variable"
          >
            {numericFields.map((field) => (
              <MenuItem key={field} value={field}>
                {fieldLabels[field]}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    );
  }

  if (config.type === 'histogram') {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 2 }}>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel id="variable-label">Variable</InputLabel>
          <Select
            labelId="variable-label"
            value={config.field || ''}
            label="Variable"
            onChange={handleFieldChange as any}
            aria-label="Select variable for histogram"
          >
            {numericFields.map((field) => (
              <MenuItem key={field} value={field}>
                {fieldLabels[field]}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <span>Number of Bins:</span>
          <Slider
            value={config.bins || 10}
            onChange={handleBinsChange as any}
            marks={[
              { value: 5, label: '5' },
              { value: 10, label: '10' },
              { value: 20, label: '20' },
            ]}
            min={5}
            max={20}
            step={5}
            valueLabelDisplay="auto"
            aria-label="Adjust number of histogram bins"
          />
        </Box>
      </Box>
    );
  }

  // Box plot - only needs variable selection
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 2 }}>
      <FormControl sx={{ minWidth: 120 }}>
        <InputLabel id="variable-label">Variable</InputLabel>
        <Select
          labelId="variable-label"
          value={config.field || ''}
          label="Variable"
          onChange={handleFieldChange}
          aria-label="Select variable for box plot comparison"
        >
          {numericFields.map((field) => (
            <MenuItem key={field} value={field}>
              {fieldLabels[field]}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};
