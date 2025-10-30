import React from 'react';
import { Box, Button, Stack, Typography, Chip } from '@mui/material';
import { useAppState } from '@/context/ContextProvider';
import { updateDietFilter } from '@/context/actions';
import { PENGUIN_DIETS } from '@/types/penguin';

const formatDietLabel = (diet: string): string =>
  diet.charAt(0).toUpperCase() + diet.slice(1);

export const DietFilter: React.FC = () => {
  const { state, dispatch } = useAppState();
  const selectedDiet = state.selectedDiet;

  const handleToggleDiet = (diet: string) => () => {
    const nextSelection = selectedDiet.includes(diet)
      ? selectedDiet.filter((value) => value !== diet)
      : [...selectedDiet, diet];

    // Preserve canonical order for persistence
    const canonical = PENGUIN_DIETS.filter((option) =>
      nextSelection.includes(option)
    );
    dispatch(updateDietFilter(canonical));
  };

  const handleReset = () => {
    dispatch(updateDietFilter([...PENGUIN_DIETS]));
  };

  const hasCustomSelection =
    selectedDiet.length > 0 && selectedDiet.length < PENGUIN_DIETS.length;

  const summary = hasCustomSelection ? selectedDiet : ['All diets'];

  return (
    <Box data-testid="diet-filter">
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 1 }}
      >
        <Typography
          component="legend"
          variant="h6"
          id="diet-filter-legend"
          sx={{ fontWeight: 'medium' }}
        >
          Diet Filter
        </Typography>
        <Button
          variant="text"
          size="small"
          onClick={handleReset}
          disabled={!hasCustomSelection}
          data-testid="diet-reset-button"
        >
          Reset
        </Button>
      </Stack>

      <Typography variant="body2" component="p" sx={{ mb: 1 }}>
        Selected:
      </Typography>
      <Stack
        direction="row"
        spacing={1}
        useFlexGap
        flexWrap="wrap"
        sx={{ mb: 2 }}
        data-testid="diet-summary"
      >
        {summary.map((diet) => (
          <Chip
            key={diet}
            label={formatDietLabel(diet)}
            size="small"
            color={hasCustomSelection ? 'primary' : 'default'}
            variant={hasCustomSelection ? 'filled' : 'outlined'}
          />
        ))}
      </Stack>

      <Stack
        direction="row"
        spacing={1}
        useFlexGap
        flexWrap="wrap"
        aria-labelledby="diet-filter-legend"
      >
        {PENGUIN_DIETS.map((diet) => {
          const selected = selectedDiet.includes(diet);
          return (
            <Chip
              key={diet}
              label={formatDietLabel(diet)}
              color={selected ? 'primary' : 'default'}
              variant={selected ? 'filled' : 'outlined'}
              onClick={handleToggleDiet(diet)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  handleToggleDiet(diet)();
                }
              }}
              role="switch"
              aria-checked={selected}
              clickable
              sx={{
                minWidth: 72,
                '&.Mui-focusVisible': {
                  outline: '3px solid',
                  outlineColor: 'primary.main',
                  outlineOffset: '2px',
                },
              }}
              data-testid={`diet-chip-${diet}`}
            />
          );
        })}
      </Stack>
    </Box>
  );
};
