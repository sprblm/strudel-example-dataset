import React from 'react';
import { Box, Button, Slider, Stack, Typography } from '@mui/material';
import { useAppState } from '@/context/ContextProvider';
import { updateYearRangeFilter } from '@/context/actions';
import { PENGUIN_YEARS } from '@/types/penguin';

const MIN_YEAR = PENGUIN_YEARS[0];
const MAX_YEAR = PENGUIN_YEARS[PENGUIN_YEARS.length - 1];

const marks = PENGUIN_YEARS.map((year) => ({
  value: year,
  label: String(year),
}));

export const YearFilter: React.FC = () => {
  const { state, dispatch } = useAppState();
  const selectedYearRange = state.selectedYearRange;

  const handleChange = (_: Event, value: number | number[]) => {
    if (!Array.isArray(value)) {
      return;
    }
    const [start, end] = value as [number, number];
    const nextRange: [number, number] = [start, end];
    dispatch(updateYearRangeFilter(nextRange));
  };

  const handleReset = () => {
    dispatch(updateYearRangeFilter([MIN_YEAR, MAX_YEAR]));
  };

  const hasCustomRange =
    selectedYearRange[0] !== MIN_YEAR || selectedYearRange[1] !== MAX_YEAR;

  return (
    <Box data-testid="year-filter">
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 1 }}
      >
        <Typography
          component="legend"
          variant="h6"
          id="year-filter-legend"
          sx={{ fontWeight: 'medium' }}
        >
          Year Range
        </Typography>
        <Button
          variant="text"
          size="small"
          onClick={handleReset}
          disabled={!hasCustomRange}
          data-testid="year-reset-button"
        >
          All years
        </Button>
      </Stack>

      <Typography variant="body2" sx={{ mb: 1 }}>
        {`Showing data from ${selectedYearRange[0]} to ${selectedYearRange[1]}`}
      </Typography>
      <Slider
        value={[selectedYearRange[0], selectedYearRange[1]]}
        onChange={handleChange}
        valueLabelDisplay="on"
        min={MIN_YEAR}
        max={MAX_YEAR}
        step={1}
        marks={marks}
        getAriaLabel={() => 'Year range'}
        getAriaValueText={(value) => `${value}`}
        aria-labelledby="year-filter-legend"
        disableSwap
        data-testid="year-range-slider"
        sx={{
          maxWidth: 360,
        }}
      />
    </Box>
  );
};
