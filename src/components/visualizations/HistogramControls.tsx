import React from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormGroup,
  FormControlLabel,
  Radio,
  Box,
  SelectChangeEvent,
} from '@mui/material';

type NumericField =
  | 'bill_length_mm'
  | 'bill_depth_mm'
  | 'flipper_length_mm'
  | 'body_mass_g';

interface HistogramControlsProps {
  config?: {
    field?: NumericField;
    bins?: number;
  };
  onConfigChange: (
    updates: Partial<{
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

export const HistogramControls: React.FC<HistogramControlsProps> = ({
  config,
  onConfigChange,
}) => {
  const safeConfig = config || {};
  const effectiveField = safeConfig.field || 'bill_length_mm';
  const effectiveBins = safeConfig.bins || 10;
  const handleFieldChange = (event: SelectChangeEvent<NumericField>) => {
    onConfigChange({ field: event.target.value as NumericField });
  };

  const handleBinsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onConfigChange({ bins: parseInt(event.target.value, 10) });
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 2 }}>
      <FormControl sx={{ minWidth: 120 }}>
        <InputLabel id="variable-label">Variable</InputLabel>
        <Select
          labelId="variable-label"
          value={effectiveField}
          label="Variable"
          onChange={handleFieldChange}
          aria-label="Select variable for histogram"
        >
          {numericFields.map((field) => (
            <MenuItem key={field} value={field}>
              {fieldLabels[field]}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl component="fieldset">
        <FormGroup>
          <FormControlLabel
            control={
              <Radio
                checked={effectiveBins === 5}
                onChange={handleBinsChange}
                value={5}
              />
            }
            label="5 Bins"
          />
          <FormControlLabel
            control={
              <Radio
                checked={effectiveBins === 10}
                onChange={handleBinsChange}
                value={10}
              />
            }
            label="10 Bins"
          />
          <FormControlLabel
            control={
              <Radio
                checked={effectiveBins === 20}
                onChange={handleBinsChange}
                value={20}
              />
            }
            label="20 Bins"
          />
        </FormGroup>
      </FormControl>
    </Box>
  );
};
