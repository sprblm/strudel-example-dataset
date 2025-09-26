import React, { useEffect, useState } from 'react';
import { Box, Typography, Switch, FormControlLabel } from '@mui/material';

interface ChartLegendProps {
  allSpecies: string[];
  initialVisibleSpecies: string[];
  onToggleSpecies: (species: string[]) => void;
}

const SPECIES_COLORS: Record<string, string> = {
  Adelie: '#FF8C00',
  Chinstrap: '#9932CC',
  Gentoo: '#00CED1',
};

export const ChartLegend: React.FC<ChartLegendProps> = ({
  allSpecies,
  initialVisibleSpecies,
  onToggleSpecies,
}) => {
  const [visibleSpecies, setVisibleSpecies] = useState<string[]>(
    initialVisibleSpecies
  );

  useEffect(() => {
    setVisibleSpecies(initialVisibleSpecies);
  }, [initialVisibleSpecies.join(',')]);

  const handleToggle = (species: string) => {
    const nextVisible = visibleSpecies.includes(species)
      ? visibleSpecies.filter((item) => item !== species)
      : [...visibleSpecies, species];
    setVisibleSpecies(nextVisible);
    onToggleSpecies(nextVisible);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 1.5,
        p: 2,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
      }}
    >
      <Typography variant="h6" component="h3">
        Species Legend
      </Typography>
      {allSpecies.map((species) => (
        <FormControlLabel
          key={species}
          data-testid={`legend-item-${species.toLowerCase()}`}
          control={
            <Switch
              checked={visibleSpecies.includes(species)}
              onChange={() => handleToggle(species)}
              inputProps={{
                'aria-label': `Toggle ${species} data visibility`,
              }}
              sx={{
                width: 62,
                height: 38,
                padding: 1,
                '& .MuiSwitch-switchBase.Mui-checked': {
                  color: SPECIES_COLORS[species],
                  '&:hover': {
                    backgroundColor: `${SPECIES_COLORS[species]}20`,
                  },
                },
                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                  backgroundColor: SPECIES_COLORS[species],
                },
              }}
            />
          }
          label={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                sx={{
                  width: 18,
                  height: 18,
                  borderRadius: '50%',
                  backgroundColor: SPECIES_COLORS[species],
                }}
              />
              <Typography variant="body2">{species}</Typography>
            </Box>
          }
          sx={{
            marginLeft: 0,
            minHeight: 48,
            paddingX: 1,
          }}
        />
      ))}
    </Box>
  );
};

export default ChartLegend;
