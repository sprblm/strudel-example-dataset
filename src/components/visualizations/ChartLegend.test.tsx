import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ChartLegend } from './ChartLegend';

const mockOnChange = vi.fn();

describe('ChartLegend', () => {
  it('renders legend chips for all species', () => {
    render(<ChartLegend onVisibilityChange={mockOnChange} />);

    expect(screen.getByText('Adelie')).toBeInTheDocument();
    expect(screen.getByText('Chinstrap')).toBeInTheDocument();
    expect(screen.getByText('Gentoo')).toBeInTheDocument();
  });

  it('toggles species visibility on click', async () => {
    render(<ChartLegend onVisibilityChange={mockOnChange} />);

    const adelieChip = screen.getByRole('button', { name: /Adelie/i });
    fireEvent.click(adelieChip);

    expect(mockOnChange).toHaveBeenCalledWith('Adelie', false);
  });

  it('calls onVisibilityChange with correct parameters', async () => {
    render(<ChartLegend onVisibilityChange={mockOnChange} />);

    const chinstrapChip = screen.getByText('Chinstrap');
    fireEvent.click(chinstrapChip);

    expect(mockOnChange).toHaveBeenCalledWith('Chinstrap', false);
  });
});
