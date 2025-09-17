import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import ChartLegend from './ChartLegend';

// Mock useTheme since it's used in the component
vi.mock('@mui/material', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useTheme: vi.fn(() => ({})), // Return a simple mock object
  };
});

describe('ChartLegend', () => {
  const mockOnToggleSpecies = vi.fn();
  const ALL_SPECIES = ['Adelie', 'Chinstrap', 'Gentoo']; // All possible species

  beforeEach(() => {
    mockOnToggleSpecies.mockClear();
  });

  it('renders correctly with all species visible initially', () => {
    render(
      <ChartLegend
        allSpecies={ALL_SPECIES}
        initialVisibleSpecies={ALL_SPECIES} // All visible initially
        onToggleSpecies={mockOnToggleSpecies}
      />
    );

    ALL_SPECIES.forEach((s) => {
      expect(screen.getByText(s)).toBeInTheDocument();
      expect(screen.getByLabelText(s)).toBeChecked();
    });
  });

  it('toggles species visibility when a switch is clicked', async () => {
    render(
      <ChartLegend
        allSpecies={ALL_SPECIES}
        initialVisibleSpecies={ALL_SPECIES}
        onToggleSpecies={mockOnToggleSpecies}
      />
    );

    const adelieSwitch = screen.getByLabelText('Adelie');
    await userEvent.click(adelieSwitch);

    expect(adelieSwitch).not.toBeChecked();
    expect(mockOnToggleSpecies).toHaveBeenCalledTimes(1);
    expect(mockOnToggleSpecies).toHaveBeenCalledWith(['Chinstrap', 'Gentoo']);

    await userEvent.click(adelieSwitch);

    expect(adelieSwitch).toBeChecked();
    expect(mockOnToggleSpecies).toHaveBeenCalledTimes(2);
    expect(mockOnToggleSpecies).toHaveBeenCalledWith([
      'Chinstrap',
      'Gentoo',
      'Adelie',
    ]);
  });

  it('correctly displays initial visible species when a subset is provided', () => {
    const INITIAL_VISIBLE_SUBSET = ['Adelie'];
    render(
      <ChartLegend
        allSpecies={ALL_SPECIES} // Pass all species
        initialVisibleSpecies={INITIAL_VISIBLE_SUBSET} // Only Adelie visible
        onToggleSpecies={mockOnToggleSpecies}
      />
    );

    expect(screen.getByLabelText('Adelie')).toBeChecked();
    expect(screen.getByLabelText('Chinstrap')).not.toBeChecked();
    expect(screen.getByLabelText('Gentoo')).not.toBeChecked();
  });
});
