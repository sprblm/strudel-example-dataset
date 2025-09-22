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
import React, { useMemo, useState } from 'react';
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
  sx,
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
        const nextSearch = { ...((prev as Record<string, unknown>) ?? {}) };
        delete nextSearch.species;
        delete nextSearch.island;
        delete nextSearch.sex;
        return nextSearch;
      },
    });
    // Announce
    setAnnouncement('All filters cleared');
    setTimeout(() => setAnnouncement(''), 2000);
  };

  const isAnyFilterActive = activeCount > 0;

  const baseStyles = useMemo<StackProps['sx']>(
    () => ({
      p: 2,
      borderRadius: 2,
      backgroundColor: 'background.paper',
      boxShadow: { xs: 'none', md: '0px 4px 8px rgba(0,0,0,0.04)' },
    }),
    []
  );

  const combinedSx = useMemo(() => {
    const extra = Array.isArray(sx) ? sx : sx ? [sx] : [];
    return [baseStyles, ...extra];
  }, [sx, baseStyles]);

  return (
    <Stack spacing={2} {...rest} id="filters" tabIndex={-1} sx={combinedSx}>
      <Stack direction="row" alignItems="center" spacing={1}>
        <Typography variant="h6" component="h2" flex={1}>
          FILTERS
        </Typography>
        {onClose && (
          <IconButton
            onClick={onClose}
            sx={{
              width: 48,
              height: 48,
              '& .MuiSvgIcon-root': {
                fontSize: '1.5rem',
              },
            }}
            aria-label="Close filters"
          >
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
            sx={{
              mt: 1,
              minHeight: 48,
            }}
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
