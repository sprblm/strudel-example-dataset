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
  const mockOnVisibilityChange = vi.fn();
  const ALL_SPECIES = ['Adelie', 'Chinstrap', 'Gentoo']; // All possible species

  beforeEach(() => {
    mockOnVisibilityChange.mockClear();
  });

  it('renders correctly with all species visible initially', () => {
    render(
      <ChartLegend
        visibleSpecies={ALL_SPECIES}
        onVisibilityChange={mockOnVisibilityChange}
      />
    );

    ALL_SPECIES.forEach((s) => {
      expect(screen.getByText(s)).toBeInTheDocument();
      expect(screen.getByLabelText(`Toggle ${s} series off`)).toBeChecked();
    });
  });

  it('toggles species visibility when a switch is clicked', async () => {
    let visibleSpecies = [...ALL_SPECIES];

    const handleVisibilityChange = (species: string, visible: boolean) => {
      mockOnVisibilityChange(species, visible);
      if (!visible) {
        visibleSpecies = visibleSpecies.filter((s) => s !== species);
      } else {
        visibleSpecies = [...visibleSpecies, species];
      }
    };

    const { rerender } = render(
      <ChartLegend
        visibleSpecies={visibleSpecies}
        onVisibilityChange={handleVisibilityChange}
      />
    );

    const adelieSwitch = screen.getByLabelText('Toggle Adelie series off');
    await userEvent.click(adelieSwitch);

    expect(mockOnVisibilityChange).toHaveBeenCalledTimes(1);
    expect(mockOnVisibilityChange).toHaveBeenCalledWith('Adelie', false);

    // Rerender with updated visible species
    rerender(
      <ChartLegend
        visibleSpecies={visibleSpecies}
        onVisibilityChange={handleVisibilityChange}
      />
    );

    expect(screen.getByLabelText('Toggle Adelie series on')).not.toBeChecked();

    await userEvent.click(screen.getByLabelText('Toggle Adelie series on'));

    expect(mockOnVisibilityChange).toHaveBeenCalledTimes(2);
    expect(mockOnVisibilityChange).toHaveBeenCalledWith('Adelie', true);
  });

  it('correctly displays initial visible species when a subset is provided', () => {
    const INITIAL_VISIBLE_SUBSET = ['Adelie'];
    render(
      <ChartLegend
        visibleSpecies={INITIAL_VISIBLE_SUBSET} // Only Adelie visible
        onVisibilityChange={mockOnVisibilityChange}
      />
    );

    expect(screen.getByLabelText('Toggle Adelie series off')).toBeChecked();
    expect(
      screen.getByLabelText('Toggle Chinstrap series on')
    ).not.toBeChecked();
    expect(screen.getByLabelText('Toggle Gentoo series on')).not.toBeChecked();
  });
});
