import React from 'react';
import {
  Box,
  FormControl,
  FormLabel,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { useAppState } from '@/context/ContextProvider';
import { updateLifeStageFilter } from '@/context/actions';

const LIFE_STAGE_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'adult', label: 'Adult' },
  { value: 'juvenile', label: 'Juvenile' },
  { value: 'chick', label: 'Chick' },
] as const;

export const LifeStageFilter: React.FC = () => {
  const { state, dispatch } = useAppState();
  const { selectedLifeStage } = state;

  const handleChange = (
    _event: React.MouseEvent<HTMLElement>,
    value: string | null
  ) => {
    if (!value) {
      return;
    }
    dispatch(updateLifeStageFilter(value));
  };

  return (
    <Box data-testid="lifestage-filter">
      <Typography
        component="legend"
        variant="h6"
        gutterBottom
        id="life-stage-filter-legend"
        sx={{ fontWeight: 'medium' }}
      >
        Life Stage
      </Typography>
      <FormControl component="fieldset">
        <FormLabel
          component="legend"
          id="life-stage-toggle-label"
          sx={{ fontSize: '0.875rem', mb: 1 }}
        >
          Select life stage
        </FormLabel>
        <ToggleButtonGroup
          exclusive
          value={selectedLifeStage}
          onChange={handleChange}
          aria-labelledby="life-stage-toggle-label"
          size="small"
          sx={{ flexWrap: 'wrap', gap: 1 }}
        >
          {LIFE_STAGE_OPTIONS.map((option) => (
            <ToggleButton
              key={option.value}
              value={option.value}
              aria-label={option.label}
              data-testid={`life-stage-${option.value}`}
              sx={{
                textTransform: 'none',
                minWidth: 72,
                '&.Mui-selected': {
                  backgroundColor: 'primary.main',
                  color: 'primary.contrastText',
                },
                '&.Mui-selected:hover': {
                  backgroundColor: 'primary.dark',
                },
              }}
            >
              {option.label}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </FormControl>
    </Box>
  );
};
