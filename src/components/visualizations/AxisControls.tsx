import React from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  useMediaQuery,
  useTheme,
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

export const AxisControls: React.FC<AxisControlsProps> = ({
  xAxis,
  yAxis,
  onAxisChange,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleXAxisChange = (event: SelectChangeEvent<string>) => {
    onAxisChange('x', event.target.value);
  };

  const handleYAxisChange = (event: SelectChangeEvent<string>) => {
    onAxisChange('y', event.target.value);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        gap: 2,
        mb: 2,
      }}
      role="group"
      aria-label="Chart axis controls"
    >
      <FormControl fullWidth>
        <InputLabel
          id="x-axis-select-label"
          sx={{
            '&.Mui-focused': {
              color: 'primary.main',
            },
          }}
        >
          X-Axis
        </InputLabel>
        <Select
          labelId="x-axis-select-label"
          id="x-axis-select"
          value={xAxis}
          label="X-Axis"
          onChange={handleXAxisChange}
          inputProps={{
            'aria-label': 'Select X-axis variable for chart',
            'data-testid': 'axis-x-select',
          }}
          sx={{
            minHeight: isMobile ? 48 : undefined,
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: 'primary.main',
              borderWidth: '2px',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'primary.light',
            },
            '&.Mui-focusVisible': {
              outline: '2px solid',
              outlineColor: 'primary.main',
              outlineOffset: '2px',
            },
          }}
        >
          {NUMERIC_COLUMNS.map((col) => (
            <MenuItem
              key={col}
              value={col}
              sx={{
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
                '&.Mui-selected': {
                  backgroundColor: 'primary.light',
                  '&:hover': {
                    backgroundColor: 'primary.main',
                  },
                },
                '&:focus-visible': {
                  outline: '2px solid',
                  outlineColor: 'primary.main',
                  outlineOffset: '2px',
                },
              }}
            >
              {col.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl fullWidth>
        <InputLabel
          id="y-axis-select-label"
          sx={{
            '&.Mui-focused': {
              color: 'primary.main',
            },
          }}
        >
          Y-Axis
        </InputLabel>
        <Select
          labelId="y-axis-select-label"
          id="y-axis-select"
          value={yAxis}
          label="Y-Axis"
          onChange={handleYAxisChange}
          inputProps={{
            'aria-label': 'Select Y-axis variable for chart',
            'data-testid': 'axis-y-select',
          }}
          sx={{
            minHeight: isMobile ? 48 : undefined,
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: 'primary.main',
              borderWidth: '2px',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'primary.light',
            },
            '&.Mui-focusVisible': {
              outline: '2px solid',
              outlineColor: 'primary.main',
              outlineOffset: '2px',
            },
          }}
        >
          {NUMERIC_COLUMNS.map((col) => (
            <MenuItem
              key={col}
              value={col}
              sx={{
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
                '&.Mui-selected': {
                  backgroundColor: 'primary.light',
                  '&:hover': {
                    backgroundColor: 'primary.main',
                  },
                },
                '&:focus-visible': {
                  outline: '2px solid',
                  outlineColor: 'primary.main',
                  outlineOffset: '2px',
                },
              }}
            >
              {col.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default AxisControls;
