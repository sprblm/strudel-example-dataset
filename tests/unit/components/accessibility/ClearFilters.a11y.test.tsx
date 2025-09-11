import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { FiltersPanel } from '@/components/FiltersPanel';

// Mock Context
vi.mock('@/context/ContextProvider', () => ({
  useAppState: vi.fn(() => ({
    state: {
      selectedSpecies: ['Adelie'],
      selectedIsland: 'all',
      selectedSex: 'all',
    },
    dispatch: vi.fn(),
  })),
}));

expect.extend(toHaveNoViolations);

describe('ClearFilters Accessibility', () => {
  it('passes axe-core scan', async () => {
    const { container } = render(<FiltersPanel />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('announces correctly to screen readers', () => {
    render(<FiltersPanel />);
    const button = screen.getByTestId('clear-filters-button');
    fireEvent.click(button);
    expect(screen.getByRole('alert')).toHaveTextContent('All filters cleared');
  });
});
