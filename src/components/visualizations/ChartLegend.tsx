import { Box, Typography, Switch, FormControlLabel } from '@mui/material';

const SPECIES = ['Adelie', 'Chinstrap', 'Gentoo'] as const;

interface ChartLegendProps {
  visibleSpecies: string[];
  onVisibilityChange: (species: string, visible: boolean) => void;
}

const ChartLegend = ({
  visibleSpecies,
  onVisibilityChange,
}: ChartLegendProps) => {
  const handleToggle =
    (species: (typeof SPECIES)[number]) =>
    (_event: unknown, checked: boolean) => {
      onVisibilityChange(species, checked);
    };

  const getColorForSpecies = (species: (typeof SPECIES)[number]) => {
    switch (species) {
      case 'Adelie':
        return '#FF8C00';
      case 'Chinstrap':
        return '#9932CC';
      case 'Gentoo':
      default:
        return '#00CED1';
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        p: 2,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
        minWidth: 240,
      }}
      role="group"
      aria-label="Toggle species visibility"
    >
      <Typography variant="subtitle1" component="h3">
        Species Legend
      </Typography>
      {SPECIES.map((species) => {
        const isVisible = visibleSpecies.includes(species);
        const color = getColorForSpecies(species);

        return (
          <FormControlLabel
            key={species}
            data-testid={`species-checkbox-${species.toLowerCase()}`}
            control={
              <Switch
                checked={isVisible}
                onChange={handleToggle(species)}
                color="primary"
                inputProps={{
                  'aria-label': `Toggle ${species} series ${
                    isVisible ? 'off' : 'on'
                  }`,
                }}
              />
            }
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box
                  sx={{
                    width: 16,
                    height: 16,
                    borderRadius: '50%',
                    backgroundColor: color,
                  }}
                  aria-hidden
                />
                <Typography>{species}</Typography>
              </Box>
            }
          />
        );
      })}
    </Box>
  );
};

export default ChartLegend;
export { ChartLegend };
