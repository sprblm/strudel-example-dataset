import CloseIcon from '@mui/icons-material/Close';
import ClearIcon from '@mui/icons-material/Clear';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Alert,
  Collapse,
  Divider,
  IconButton,
  Stack,
  StackProps,
  Typography,
  Button,
} from '@mui/material';
import React, { useState } from 'react';
import { SpeciesFilter } from './filters/SpeciesFilter';
import { IslandFilter } from './filters/IslandFilter';
import { SexFilter } from './filters/SexFilter';
import { DietFilter } from './filters/DietFilter';
import { LifeStageFilter } from './filters/LifeStageFilter';
import { YearFilter } from './filters/YearFilter';
import { useAppState } from '@/context/ContextProvider';
import { clearAllFilters } from '@/context/actions';
import { PENGUIN_DIETS, PENGUIN_SPECIES, PENGUIN_YEARS } from '@/types/penguin';

interface FiltersProps extends StackProps {
  onChange?: () => any;
  onClose?: () => any;
}

// Helper to count active filters
const getActiveFilterCount = (state: any) => {
  let count = 0;
  if (state.selectedSpecies.length < PENGUIN_SPECIES.length) count++; // Not all species
  if (state.selectedIsland !== 'all') count++;
  if (state.selectedSex !== 'all') count++;
  if (
    state.selectedDiet.length > 0 &&
    state.selectedDiet.length < PENGUIN_DIETS.length
  )
    count++;
  if (state.selectedLifeStage !== 'all') count++;
  if (
    state.selectedYearRange[0] !== PENGUIN_YEARS[0] ||
    state.selectedYearRange[1] !== PENGUIN_YEARS[PENGUIN_YEARS.length - 1]
  )
    count++;
  return count;
};

export const FiltersPanel: React.FC<FiltersProps> = ({
  onClose,
  children,
  ...rest
}) => {
  const { state, dispatch } = useAppState();

  const activeCount = getActiveFilterCount(state);
  const [announcement, setAnnouncement] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const hasCustomDiet =
    state.selectedDiet.length > 0 &&
    state.selectedDiet.length < PENGUIN_DIETS.length;
  const hasCustomLifeStage = state.selectedLifeStage !== 'all';
  const hasCustomYearRange =
    state.selectedYearRange[0] !== PENGUIN_YEARS[0] ||
    state.selectedYearRange[1] !== PENGUIN_YEARS[PENGUIN_YEARS.length - 1];

  const advancedSummaryParts: string[] = [];
  if (hasCustomDiet) {
    advancedSummaryParts.push(`diet: ${state.selectedDiet.join(', ')}`);
  }
  if (hasCustomLifeStage) {
    advancedSummaryParts.push(`life stage: ${state.selectedLifeStage}`);
  }
  if (hasCustomYearRange) {
    advancedSummaryParts.push(
      `years ${state.selectedYearRange[0]}-${state.selectedYearRange[1]}`
    );
  }

  const hasAdvancedOverrides = advancedSummaryParts.length > 0;
  const advancedSummaryText = advancedSummaryParts.join('; ');

  const handleClearFilters = () => {
    // Reset state
    dispatch(clearAllFilters());
    // Announce
    setAnnouncement('All filters cleared');
    setTimeout(() => setAnnouncement(''), 2000);
  };

  const isAnyFilterActive = activeCount > 0;

  return (
    <Stack {...rest} id="filters" tabIndex={-1}>
      <Stack direction="row" alignItems="center">
        <Typography variant="h6" component="h2" flex={1}>
          FILTERS
        </Typography>
        {onClose && (
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        )}
      </Stack>
      <Stack spacing={2}>
        <SpeciesFilter />
        <IslandFilter />
        <SexFilter />
        {hasAdvancedOverrides && !showAdvanced && (
          <Typography
            variant="body2"
            color="text.secondary"
            data-testid="advanced-summary"
          >
            Advanced filters active: {advancedSummaryText}
          </Typography>
        )}
        <Button
          variant="text"
          onClick={() => setShowAdvanced((prev) => !prev)}
          endIcon={
            <ExpandMoreIcon
              sx={{
                transform: showAdvanced ? 'rotate(180deg)' : 'none',
                transition: 'transform 0.2s ease',
              }}
            />
          }
          aria-expanded={showAdvanced}
          aria-controls="advanced-filters"
          data-testid="toggle-advanced-filters"
          sx={{ alignSelf: 'flex-start', mt: 1 }}
        >
          {showAdvanced ? 'Hide advanced filters' : 'Show advanced filters'}
        </Button>
        <Collapse in={showAdvanced} timeout="auto">
          <Stack
            id="advanced-filters"
            spacing={2}
            sx={{ mt: 1 }}
            data-testid="advanced-filters"
          >
            <Divider sx={{ mt: 1, mb: 1 }} />
            <DietFilter />
            <LifeStageFilter />
            <YearFilter />
          </Stack>
        </Collapse>
        {isAnyFilterActive && (
          <Button
            variant="outlined"
            startIcon={<ClearIcon />}
            onClick={handleClearFilters}
            fullWidth
            data-testid="clear-filters-button"
            sx={{ mt: 1 }}
          >
            Clear {activeCount} filter{activeCount !== 1 ? 's' : ''}
          </Button>
        )}
        {announcement && (
          <Alert
            severity="info"
            role="status"
            aria-live="polite"
            sx={{ fontSize: '0.875rem' }}
          >
            {announcement}
          </Alert>
        )}
      </Stack>
    </Stack>
  );
};
