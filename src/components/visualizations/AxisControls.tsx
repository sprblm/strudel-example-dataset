import React from 'react';
import { Select, MenuItem, FormControl, InputLabel, Box } from '@mui/material';

type NumericField =
  | 'bill_length_mm'
  | 'bill_depth_mm'
  | 'flipper_length_mm'
  | 'body_mass_g';

interface AxisControlsProps {
  currentX: NumericField;
  currentY: NumericField;
  onAxisChange: (axis: 'x' | 'y', value: NumericField) => void;
}

const numericFields: NumericField[] = [
  'bill_length_mm',
  'bill_depth_mm',
  'flipper_length_mm',
  'body_mass_g',
];

const fieldLabels = {
  bill_length_mm: 'Bill Length (mm)',
  bill_depth_mm: 'Bill Depth (mm)',
  flipper_length_mm: 'Flipper Length (mm)',
  body_mass_g: 'Body Mass (g)',
};

export const AxisControls: React.FC<AxisControlsProps> = ({
  currentX,
  currentY,
  onAxisChange,
}) => {
  return (
    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
      <FormControl sx={{ minWidth: 120 }}>
        <InputLabel id="x-axis-label">X Axis</InputLabel>
        <Select
          labelId="x-axis-label"
          value={currentX}
          label="X Axis"
          onChange={(e) => onAxisChange('x', e.target.value as NumericField)}
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
          value={currentY}
          label="Y Axis"
          onChange={(e) => onAxisChange('y', e.target.value as NumericField)}
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
