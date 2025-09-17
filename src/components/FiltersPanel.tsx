import CloseIcon from '@mui/icons-material/Close';
import ClearIcon from '@mui/icons-material/Clear';
import {
  Alert,
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
import { useAppState } from '@/context/ContextProvider';
import { useNavigate } from '@tanstack/react-router';
import { clearAllFilters } from '@/context/actions';

interface FiltersProps extends StackProps {
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

  const activeCount = getActiveFilterCount(state);
  const [announcement, setAnnouncement] = useState('');

  const handleClearFilters = () => {
    // Reset state
    dispatch(clearAllFilters());
    // Clear URL
    navigate({
      to: '/penguins',
      search: (prev) => {
        const newSearch = { ...prev };
        delete newSearch.species;
        delete newSearch.island;
        delete newSearch.sex;
        return newSearch;
      },
    });
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
