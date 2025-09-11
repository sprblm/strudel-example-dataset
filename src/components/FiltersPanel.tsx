import CloseIcon from '@mui/icons-material/Close';
import ClearIcon from '@mui/icons-material/Clear';
import { Alert, IconButton, Stack, StackProps, Typography, Button } from '@mui/material';
import React, { useState } from 'react';
import { SpeciesFilter } from './SpeciesFilter';
import { IslandFilter } from './IslandFilter';
import { SexFilter } from './SexFilter';
import { useAppState } from '@/context/ContextProvider';
import { useNavigate, createSearch } from '@tanstack/react-router';

enum FilterType {
  CHECKBOX_LIST = 'CHECKBOX_LIST',
  RANGE_SLIDER = 'RANGE_SLIDER',
}

interface Filter {
  label: string;
  field: string;
  type: FilterType;
  defaultValue: any;
}

interface FiltersProps extends StackProps {
  filters?: Filter[];
  onChange?: () => any;
  onClose?: () => any;
}

// Helper to count active filters
const getActiveFilterCount = (state: any) => {
  let count = 0;
  if (state.selectedSpecies.length < 3) count++; // Not all species
  if (state.selectedIsland !== 'all') count++;
  if (state.selectedSex !== 'all') count++;
  return count;
};

export const FiltersPanel: React.FC<FiltersProps> = ({
  onClose,
  children,
  ...rest
}) => {
  const { state, dispatch } = useAppState();
  const navigate = useNavigate();
  const search = createSearch({
    from: '/penguins/',
  });

  const activeCount = getActiveFilterCount(state);
  const [announcement, setAnnouncement] = useState('');

  const handleClearFilters = () => {
    // Reset state
    dispatch({ type: 'CLEAR_ALL_FILTERS' as any, payload: null });
    // Clear URL
    navigate({ to: '/penguins/', search: (prev) => ({ ...prev, species: undefined, island: undefined, sex: undefined }) });
    // Announce
    setAnnouncement('All filters cleared');
    setTimeout(() => setAnnouncement(''), 2000);
  };

  const isAnyFilterActive = activeCount > 0;

  return (
    <Stack {...rest}>
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
          <Alert severity="info" role="status" aria-live="polite" sx={{ fontSize: '0.875rem' }}>
            {announcement}
          </Alert>
        )}
      </Stack>
    </Stack>
  );
};
