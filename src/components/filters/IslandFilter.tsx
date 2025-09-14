import React from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Box,
  SelectChangeEvent,
} from '@mui/material';
import { useAppState } from '@/context/ContextProvider';

const ISLAND_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'Biscoe', label: 'Biscoe' },
  { value: 'Dream', label: 'Dream' },
  { value: 'Torgersen', label: 'Torgersen' },
] as const;

export const IslandFilter: React.FC = () => {
  const { state, dispatch } = useAppState();
  const { selectedIsland } = state;

  const handleIslandChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value;
    dispatch({ type: 'UPDATE_ISLAND_FILTER' as any, payload: value });
  };

  return (
    <Box data-testid="island-filter">
      <Typography
        component="legend"
        variant="h6"
        gutterBottom
        id="island-filter-legend"
        sx={{ fontWeight: 'medium', mb: 1 }}
      >
        Island Filter
      </Typography>
      <FormControl fullWidth size="small" sx={{ mt: 1 }}>
        <InputLabel
          id="island-select-label"
          sx={{
            '&.Mui-focused': {
              color: 'primary.main',
            },
          }}
        >
          Select Island
        </InputLabel>
        <Select
          labelId="island-select-label"
          value={selectedIsland || 'all'}
          label="Select Island"
          onChange={handleIslandChange}
          inputProps={{
            'aria-label': 'Filter penguins by island',
          }}
          data-testid="island-select"
          sx={{
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: 'primary.main',
              borderWidth: '2px',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'primary.light',
            },
            '&.Mui-focusVisible': {
              outline: '3px solid',
              outlineColor: 'primary.main',
              outlineOffset: '2px',
            },
          }}
        >
          {ISLAND_OPTIONS.map((option) => (
            <MenuItem
              key={option.value}
              value={option.value}
              data-testid={`island-option-${option.value.toLowerCase()}`}
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
              }}
            >
              <Typography variant="body2">{option.label}</Typography>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {selectedIsland && selectedIsland !== 'all' && (
        <Typography
          variant="caption"
          sx={{
            display: 'block',
            mt: 0.5,
            color: 'primary.main',
            fontWeight: 'medium',
          }}
          data-testid="island-filter-feedback"
        >
          Filtering by: {selectedIsland}
        </Typography>
      )}
    </Box>
  );
};
