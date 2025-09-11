import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { AppProvider } from '@/context/ContextProvider';
import { SpeciesFilter } from '@/components/filters/SpeciesFilter';

const theme = createTheme();

describe('SpeciesFilter Integration with Context', () => {
  it('updates filter state when checkbox is toggled', () => {
    render(
      <ThemeProvider theme={theme}>
        <AppProvider>
          <SpeciesFilter />
        </AppProvider>
      </ThemeProvider>
    );

    // Initially all should be checked
    expect(screen.getByRole('checkbox', { name: 'Filter by Adelie penguins' })).toBeChecked();
    expect(screen.getByRole('checkbox', { name: 'Filter by Chinstrap penguins' })).toBeChecked();
    expect(screen.getByRole('checkbox', { name: 'Filter by Gentoo penguins' })).toBeChecked();

    // Click to uncheck Chinstrap
    const chinstrapCheckbox = screen.getByRole('checkbox', { name: 'Filter by Chinstrap penguins' });
    fireEvent.click(chinstrapCheckbox);

    // Chinstrap should be unchecked, others still checked
    expect(screen.getByRole('checkbox', { name: 'Filter by Adelie penguins' })).toBeChecked();
    expect(chinstrapCheckbox).not.toBeChecked();
    expect(screen.getByRole('checkbox', { name: 'Filter by Gentoo penguins' })).toBeChecked();
  });

  it('initially shows all checkboxes selected', () => {
    render(
      <ThemeProvider theme={theme}>
        <AppProvider>
          <SpeciesFilter />
        </AppProvider>
      </ThemeProvider>
    );

    expect(screen.getByRole('checkbox', { name: 'Filter by Adelie penguins' })).toBeChecked();
    expect(screen.getByRole('checkbox', { name: 'Filter by Chinstrap penguins' })).toBeChecked();
    expect(screen.getByRole('checkbox', { name: 'Filter by Gentoo penguins' })).toBeChecked();
  });
});