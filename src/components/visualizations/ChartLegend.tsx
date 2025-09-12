import React, { useState } from 'react';
import {
  Box,
  Typography,
  Switch,
  FormControlLabel,
  useTheme,
} from '@mui/material';

interface ChartLegendProps {
  allSpecies: string[];
  initialVisibleSpecies: string[];
  onToggleSpecies: (species: string[]) => void;
}

// Define a color mapping for each species
const SPECIES_COLORS: { [key: string]: string } = {
  Adelie: '#FF8C00', // Dark Orange
  Chinstrap: '#9932CC', // Dark Orchid
  Gentoo: '#00CED1', // Dark Turquoise
};

const ChartLegend: React.FC<ChartLegendProps> = ({
  allSpecies,
  initialVisibleSpecies,
  onToggleSpecies,
}) => {
  const theme = useTheme();
  const [visibleSpecies, setVisibleSpecies] = useState<string[]>(
    initialVisibleSpecies
  );

  const handleToggle = (s: string) => {
    const newVisibleSpecies = visibleSpecies.includes(s)
      ? visibleSpecies.filter((item) => item !== s)
      : [...visibleSpecies, s];
    setVisibleSpecies(newVisibleSpecies);
    onToggleSpecies(newVisibleSpecies);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        p: 2,
        border: '1px solid #ccc',
        borderRadius: 1,
      }}
    >
      <Typography variant="h6">Species Legend</Typography>
      {allSpecies.map((s) => (
        <FormControlLabel
          key={s}
          control={
            <Switch
              checked={visibleSpecies.includes(s)}
              onChange={() => handleToggle(s)}
              sx={{
                '& .MuiSwitch-switchBase.Mui-checked': {
                  color: SPECIES_COLORS[s],
                  '&:hover': {
                    backgroundColor: `${SPECIES_COLORS[s]}10`, // Add a slight hover effect
                  },
                },
                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                  backgroundColor: SPECIES_COLORS[s],
                },
              }}
            />
          }
          label={
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box
                sx={{
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  backgroundColor: SPECIES_COLORS[s],
                  mr: 1,
                }}
              />
              <Typography>{s}</Typography>
            </Box>
          }
        />
      ))}
    </Box>
  );
};

export default ChartLegend;
