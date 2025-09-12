import React, { useState, useCallback } from 'react';
import { Box, Chip, Stack } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Species } from '@/types/penguin';

const speciesColors = {
  Adelie: '#1f77b4',
  Chinstrap: '#ff7f0e',
  Gentoo: '#2ca02c',
};

interface ChartLegendProps {
  onVisibilityChange?: (species: Species, visible: boolean) => void;
}

export const ChartLegend: React.FC<ChartLegendProps> = ({
  onVisibilityChange,
}) => {
  const theme = useTheme();
  const [visibleSpecies, setVisibleSpecies] = useState<Species[]>([
    'Adelie',
    'Chinstrap',
    'Gentoo',
  ]);

  const toggleSpecies = useCallback(
    (species: Species) => {
      setVisibleSpecies((prev) => {
        const newVisible = prev.includes(species)
          ? prev.filter((s) => s !== species)
          : [...prev, species];
        onVisibilityChange?.(species, newVisible.includes(species));
        return newVisible;
      });
    },
    [onVisibilityChange]
  );

  return (
    <Box sx={{ mb: 2 }}>
      <Stack direction="row" spacing={1}>
        {(['Adelie', 'Chinstrap', 'Gentoo'] as Species[]).map((species) => (
          <Chip
            key={species}
            label={species}
            onClick={() => toggleSpecies(species)}
            color={visibleSpecies.includes(species) ? 'primary' : 'default'}
            variant={visibleSpecies.includes(species) ? 'filled' : 'outlined'}
            sx={{
              backgroundColor: visibleSpecies.includes(species)
                ? speciesColors[species]
                : 'transparent',
              '& .MuiChip-label': {
                color: visibleSpecies.includes(species)
                  ? 'white'
                  : theme.palette.text.primary,
              },
            }}
          />
        ))}
      </Stack>
    </Box>
  );
};
