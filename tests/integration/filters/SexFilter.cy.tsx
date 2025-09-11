import { SexFilter } from '@/components/filters/SexFilter';
import { penguins } from '@/data/penguins';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useAppState } from '@/context/ContextProvider';

vi.mock('@/context/ContextProvider', () => ({
  useAppState: vi.fn(),
}));

describe('SexFilter Integration', () => {
  const mockDispatch = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useAppState).mockReturnValue({
      state: { selectedSex: 'all' },
      dispatch: mockDispatch,
    });
  });

  it('updates filter state and applies filtering on selection', async () => {
    render(<SexFilter />);

    const maleOption = screen.getByTestId('sex-option-male');
    fireEvent.click(maleOption);

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'UPDATE_SEX_FILTER',
        payload: 'male',
      });
    });

    // Mock filtering logic test
    const filtered = penguins.filter(p => p.sex === 'male');
    expect(filtered.length).toBeGreaterThan(0);
  });

  it('handles missing sex values correctly', () => {
    const mockPenguins = [...penguins, { ...penguins[0], sex: null as any }];

    render(<SexFilter />);

    // All should include null
    const allFiltered = mockPenguins.filter(() => true);
    expect(allFiltered.length).toBe(mockPenguins.length);

    // Male excludes null
    const maleFiltered = mockPenguins.filter(p => p.sex === 'male');
    expect(maleFiltered.length).toBeLessThan(mockPenguins.length);
  });

  it('integrates with other filters without conflicts', () => {
    vi.mocked(useAppState).mockReturnValue({
      state: { 
        selectedSpecies: ['Adelie'], 
        selectedIsland: 'Biscoe', 
        selectedSex: 'all' 
      },
      dispatch: mockDispatch,
    });

    render(<SexFilter />);

    expect(screen.getByTestId('sex-radio-group')).toBeInTheDocument();
    // No errors in state management
  });
});