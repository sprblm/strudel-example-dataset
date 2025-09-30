import React from 'react';
import {
  FormGroup,
  FormControlLabel,
  Checkbox,
  Typography,
  Box,
} from '@mui/material';
import { useAppState } from '@/context/ContextProvider';

const SPECIES_OPTIONS = ['Adelie', 'Chinstrap', 'Gentoo'] as const;

export const SpeciesFilter: React.FC = () => {
  const { state, dispatch } = useAppState();
  const { selectedSpecies } = state;

  const handleSpeciesChange =
    (species: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      const isChecked = event.target.checked;

      if (isChecked) {
        const newSpecies = [...selectedSpecies, species].filter(
          (s, index, arr) => arr.indexOf(s) === index
        ); // Avoid duplicates
        dispatch({ type: 'UPDATE_SPECIES_FILTER' as any, payload: newSpecies });
      } else {
        const newSpecies = selectedSpecies.filter((s) => s !== species);
        dispatch({ type: 'UPDATE_SPECIES_FILTER' as any, payload: newSpecies });
      }
    };

  return (
    <Box data-testid="species-filter">
      <Typography
        component="legend"
        variant="h6"
        gutterBottom
        id="species-filter-legend"
        sx={{ fontWeight: 'medium', mb: 1 }}
      >
        Species Filter
      </Typography>
      <FormGroup
        role="group"
        aria-labelledby="species-filter-legend"
        sx={{ ml: 1 }}
      >
        {SPECIES_OPTIONS.map((species) => (
          <FormControlLabel
            key={species}
            control={
              <Checkbox
                checked={selectedSpecies.includes(species)}
                onChange={handleSpeciesChange(species)}
                name={species.toLowerCase()}
                inputProps={{
                  'aria-label': `Filter by ${species} penguins`,
                }}
                data-testid={`species-checkbox-${species.toLowerCase()}`}
                sx={{
                  width: 48,
                  height: 48,
                  '&.Mui-focusVisible': {
                    outline: '3px solid',
                    outlineColor: 'primary.main',
                    outlineOffset: '2px',
                  },
                }}
              />
            }
            label={
              <Typography
                variant="body2"
                sx={{
                  userSelect: 'none',
                  cursor: 'pointer',
                }}
              >
                {species}
              </Typography>
            }
            data-testid={`species-label-${species.toLowerCase()}`}
            sx={{
              alignItems: 'center',
              minHeight: 48,
              gap: 1,
              pl: 0,
              '& .MuiTypography-root': {
                fontSize: '0.95rem',
              },
            }}
          />
        ))}
      </FormGroup>
    </Box>
  );
};
