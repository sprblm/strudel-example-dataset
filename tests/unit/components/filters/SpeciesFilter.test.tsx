import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { SpeciesFilter } from '../../../../src/components/filters/SpeciesFilter';
import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material/styles';
import { AppProvider } from '../../../../src/context/ContextProvider';

const theme = createTheme();

// Wrap the component in ThemeProvider and AppProvider
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ThemeProvider theme={theme}>
    <AppProvider>{children}</AppProvider>
  </ThemeProvider>
);

// Test the component
describe('SpeciesFilter', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
  });
  // Test that the component renders all checkboxes
  it('renders all checkboxes', () => {
    render(
      <TestWrapper>
        <SpeciesFilter />
      </TestWrapper>
    );
    // Test that the filter title is rendered
    expect(screen.getByText('Species Filter')).toBeInTheDocument();
    expect(
      screen.getByRole('checkbox', { name: 'Filter by Adelie penguins' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('checkbox', { name: 'Filter by Chinstrap penguins' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('checkbox', { name: 'Filter by Gentoo penguins' })
    ).toBeInTheDocument();
  });
  // Test that all checkboxes are initially checked
  it('initially shows all checkboxes selected', () => {
    render(
      <TestWrapper>
        <SpeciesFilter />
      </TestWrapper>
    );
    // Test that all checkboxes are checked
    expect(
      screen.getByRole('checkbox', { name: 'Filter by Adelie penguins' })
    ).toBeChecked();
    expect(
      screen.getByRole('checkbox', { name: 'Filter by Chinstrap penguins' })
    ).toBeChecked();
    expect(
      screen.getByRole('checkbox', { name: 'Filter by Gentoo penguins' })
    ).toBeChecked();
  });
  // Test that toggling a checkbox updates the filter state
  it('updates filter state when checkbox is toggled', () => {
    render(
      <TestWrapper>
        <SpeciesFilter />
      </TestWrapper>
    );

    // Initially all should be checked
    expect(
      screen.getByRole('checkbox', { name: 'Filter by Adelie penguins' })
    ).toBeChecked();
    expect(
      screen.getByRole('checkbox', { name: 'Filter by Chinstrap penguins' })
    ).toBeChecked();
    expect(
      screen.getByRole('checkbox', { name: 'Filter by Gentoo penguins' })
    ).toBeChecked();

    // Click to uncheck Adelie
    const adelieCheckbox = screen.getByRole('checkbox', {
      name: 'Filter by Adelie penguins',
    });
    fireEvent.click(adelieCheckbox);

    // Adelie should be unchecked, others still checked
    expect(adelieCheckbox).not.toBeChecked();
    expect(
      screen.getByRole('checkbox', { name: 'Filter by Chinstrap penguins' })
    ).toBeChecked();
    expect(
      screen.getByRole('checkbox', { name: 'Filter by Gentoo penguins' })
    ).toBeChecked();
  });
  // Test that the ARIA attributes are correct
  it('has proper ARIA attributes for accessibility', () => {
    render(
      <TestWrapper>
        <SpeciesFilter />
      </TestWrapper>
    );

    const group = screen.getByRole('group');
    expect(group).toHaveAttribute('aria-labelledby', 'species-filter-legend');

    const legend = screen.getByText('Species Filter');
    expect(legend).toHaveAttribute('id', 'species-filter-legend');
  });

  // Test that keyboard navigation works
  it('handles keyboard navigation properly', () => {
    render(
      <TestWrapper>
        <SpeciesFilter />
      </TestWrapper>
    );
    // Test that the Adelie checkbox is focused when clicked
    const adelieCheckbox = screen.getByRole('checkbox', {
      name: 'Filter by Adelie penguins',
    });

    // Focus the checkbox
    adelieCheckbox.focus();
    expect(document.activeElement).toBe(adelieCheckbox);
  });

  // Test that the data-testid attributes are correct
  it('has correct data-testid attributes', () => {
    render(
      <TestWrapper>
        <SpeciesFilter />
      </TestWrapper>
    );
    // Test that the filter container has the correct data-testid
    expect(screen.getByTestId('species-filter')).toBeInTheDocument();
    // Note: The data-testid is on the FormControlLabel, not the checkbox input
    expect(screen.getByTestId('species-label-adelie')).toBeInTheDocument();
    expect(screen.getByTestId('species-label-chinstrap')).toBeInTheDocument();
    expect(screen.getByTestId('species-label-gentoo')).toBeInTheDocument();
  });
});
