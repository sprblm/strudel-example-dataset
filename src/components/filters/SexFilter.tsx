import React from 'react';
import {
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Typography,
  Box,
} from '@mui/material';
import { useAppState } from '@/context/ContextProvider';

const SEX_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
] as const;

export const SexFilter: React.FC = () => {
  const { state, dispatch } = useAppState();
  const { selectedSex } = state;

  const handleSexChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    dispatch({ type: 'UPDATE_SEX_FILTER' as any, payload: value });
  };

  return (
    <Box data-testid="sex-filter">
      <Typography
        component="legend"
        variant="h6"
        gutterBottom
        id="sex-filter-legend"
        sx={{ fontWeight: 'medium', mb: 1 }}
      >
        Sex Filter
      </Typography>
      <FormControl component="fieldset" sx={{ mt: 1 }}>
        <FormLabel
          component="legend"
          id="sex-radio-group-label"
          sx={{
            fontSize: '0.875rem',
            '&.Mui-focused': {
              color: 'primary.main',
            },
          }}
        >
          Select Sex
        </FormLabel>
        <RadioGroup
          aria-labelledby="sex-radio-group-label"
          value={selectedSex || 'all'}
          onChange={handleSexChange}
          name="sex-filter-radio-group"
          data-testid="sex-radio-group"
          sx={{ mt: 0.5 }}
        >
          {SEX_OPTIONS.map((option) => (
            <FormControlLabel
              key={option.value}
              value={option.value}
              control={
                <Radio
                  data-testid={`sex-radio-${option.value.toLowerCase()}`}
                  sx={{
                    width: 48,
                    height: 48,
                    '&.Mui-checked': {
                      color: 'primary.main',
                    },
                    '&.Mui-focusVisible': {
                      outline: '3px solid',
                      outlineColor: 'primary.main',
                      outlineOffset: '2px',
                    },
                  }}
                />
              }
              label={<Typography variant="body2">{option.label}</Typography>}
              data-testid={`sex-option-${option.value.toLowerCase()}`}
              sx={{
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
                alignItems: 'center',
                minHeight: 48,
                '& .MuiFormControlLabel-label': {
                  fontWeight:
                    selectedSex === option.value ? 'medium' : 'normal',
                },
              }}
            />
          ))}
        </RadioGroup>
      </FormControl>
      {selectedSex && selectedSex !== 'all' && (
        <Typography
          variant="caption"
          sx={{
            display: 'block',
            mt: 0.5,
            color: 'primary.main',
            fontWeight: 'medium',
          }}
          data-testid="sex-filter-feedback"
        >
          Filtering by: {selectedSex}
        </Typography>
      )}
    </Box>
  );
};
