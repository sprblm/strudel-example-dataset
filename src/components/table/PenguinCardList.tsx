import React from 'react';
import {
  Alert,
  Box,
  Card,
  CardContent,
  CardHeader,
  Chip,
  CircularProgress,
  Stack,
  Typography,
} from '@mui/material';
import { Penguin } from '@/types/penguin';
import { formatValue } from '@/utils/dataHelpers';

interface PenguinCardListProps {
  penguins: Penguin[];
  isLoading: boolean;
  isError: boolean;
  error: unknown;
}

const formatMeasurement = (value: number | null | undefined, unit: string) => {
  const formatted = formatValue(value);
  return formatted === '—' ? formatted : `${formatted} ${unit}`;
};

const DetailRow: React.FC<{ label: string; value: React.ReactNode }> = ({
  label,
  value,
}) => (
  <Stack direction="row" spacing={1} alignItems="center">
    <Typography
      variant="overline"
      sx={{
        fontWeight: 600,
        letterSpacing: 0.5,
        textTransform: 'uppercase',
      }}
    >
      {label}
    </Typography>
    <Typography variant="body2" color="text.primary">
      {value}
    </Typography>
  </Stack>
);

export const PenguinCardList: React.FC<PenguinCardListProps> = ({
  penguins,
  isLoading,
  isError,
  error,
}) => {
  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight={320}
        flexDirection="column"
        gap={2}
        role="status"
        aria-live="polite"
      >
        <CircularProgress />
        <Typography>Loading penguin data...</Typography>
      </Box>
    );
  }

  if (isError) {
    return (
      <Alert severity="error" role="alert">
        Failed to load penguin data:{' '}
        {error instanceof Error ? error.message : 'Unknown error'}
      </Alert>
    );
  }

  if (!penguins.length) {
    return (
      <Alert severity="info" role="status" aria-live="polite">
        No penguins match the current filters. Try adjusting your selections.
      </Alert>
    );
  }

  return (
    <Stack spacing={2} data-testid="penguin-card-list">
      {penguins.map((penguin, index) => (
        <Card
          key={`${penguin.species}-${penguin.island}-${index}`}
          variant="outlined"
          sx={{
            borderRadius: 3,
            boxShadow: '0px 2px 8px rgba(15, 23, 42, 0.08)',
          }}
        >
          <CardHeader
            title={penguin.species}
            subheader={`Island: ${penguin.island}`}
            titleTypographyProps={{
              variant: 'h6',
              component: 'h3',
            }}
            subheaderTypographyProps={{
              variant: 'body2',
              color: 'text.secondary',
            }}
            action={
              <Chip
                label={penguin.sex ? penguin.sex : 'Unknown'}
                color={
                  !penguin.sex
                    ? 'default'
                    : penguin.sex === 'female'
                      ? 'secondary'
                      : 'primary'
                }
                variant="outlined"
                sx={{
                  minHeight: 32,
                  fontWeight: 600,
                  textTransform: 'capitalize',
                }}
                data-testid="penguin-sex-chip"
                aria-label={`Sex: ${penguin.sex ? penguin.sex : 'Unknown'}`}
              />
            }
          />
          <CardContent sx={{ pt: 0 }}>
            <Stack spacing={1.5}>
              <DetailRow
                label="Bill Length"
                value={formatMeasurement(penguin.bill_length_mm, 'mm')}
              />
              <DetailRow
                label="Bill Depth"
                value={formatMeasurement(penguin.bill_depth_mm, 'mm')}
              />
              <DetailRow
                label="Flipper Length"
                value={formatMeasurement(penguin.flipper_length_mm, 'mm')}
              />
              <DetailRow
                label="Body Mass"
                value={formatMeasurement(penguin.body_mass_g, 'g')}
              />
              <DetailRow label="Year" value={penguin.year} />
            </Stack>
          </CardContent>
        </Card>
      ))}
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ textAlign: 'center', mt: 1 }}
      >
        Showing {penguins.length} penguin{penguins.length !== 1 ? 's' : ''}
      </Typography>
    </Stack>
  );
};
