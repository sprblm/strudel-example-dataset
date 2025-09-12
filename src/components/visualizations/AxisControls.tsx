import React from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';

const NUMERIC_COLUMNS = [
  'bill_length_mm',
  'bill_depth_mm',
  'flipper_length_mm',
  'body_mass_g',
];

interface AxisControlsProps {
  xAxis: string;
  yAxis: string;
  onAxisChange: (axis: 'x' | 'y', value: string) => void;
}

const AxisControls: React.FC<AxisControlsProps> = ({
  xAxis,
  yAxis,
  onAxisChange,
}) => {
  const handleXAxisChange = (event: SelectChangeEvent<string>) => {
    onAxisChange('x', event.target.value);
  };

  const handleYAxisChange = (event: SelectChangeEvent<string>) => {
    onAxisChange('y', event.target.value);
  };

  return (
    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
      <FormControl fullWidth>
        <InputLabel id="x-axis-select-label">X-Axis</InputLabel>
        <Select
          labelId="x-axis-select-label"
          id="x-axis-select"
          value={xAxis}
          label="X-Axis"
          onChange={handleXAxisChange}
        >
          {NUMERIC_COLUMNS.map((col) => (
            <MenuItem key={col} value={col}>
              {col}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl fullWidth>
        <InputLabel id="y-axis-select-label">Y-Axis</InputLabel>
        <Select
          labelId="y-axis-select-label"
          id="y-axis-select"
          value={yAxis}
          label="Y-Axis"
          onChange={handleYAxisChange}
        >
          {NUMERIC_COLUMNS.map((col) => (
            <MenuItem key={col} value={col}>
              {col}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default AxisControls;
