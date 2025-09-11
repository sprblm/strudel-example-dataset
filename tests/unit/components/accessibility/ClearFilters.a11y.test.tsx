import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { axe } from 'cypress-axe';
import { FiltersPanel } from '@/components/FiltersPanel';

describe('ClearFilters Accessibility', () => {
  it('passes axe-core scan', () => {
    render(<FiltersPanel />);
    cy.checkA11y('[data-testid="clear-filters-button"]');
  });

  it('announces correctly to screen readers', () => {
    // Mock state with active filters
    render(<FiltersPanel />);
    const button = screen.getByTestId('clear-filters-button');
    fireEvent.click(button);
    expect(screen.getByRole('alert')).toHaveTextContent('All filters cleared');
  });
});