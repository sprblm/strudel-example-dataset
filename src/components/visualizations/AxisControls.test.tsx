import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import AxisControls from './AxisControls';

describe('AxisControls', () => {
  const mockOnAxisChange = vi.fn();

  beforeEach(() => {
    mockOnAxisChange.mockClear();
  });

  it('renders correctly with initial values', () => {
    render(
      <AxisControls
        xAxis="bill_length_mm"
        yAxis="body_mass_g"
        onAxisChange={mockOnAxisChange}
      />
    );

    // For MUI Select, the value is usually displayed as text content
    expect(screen.getByRole('combobox', { name: 'X-Axis' })).toHaveTextContent(
      'bill_length_mm'
    );
    expect(screen.getByRole('combobox', { name: 'Y-Axis' })).toHaveTextContent(
      'body_mass_g'
    );
  });

  it('calls onAxisChange when X-axis is changed', async () => {
    render(
      <AxisControls
        xAxis="bill_length_mm"
        yAxis="body_mass_g"
        onAxisChange={mockOnAxisChange}
      />
    );

    const xAxisSelect = screen.getByRole('combobox', { name: 'X-Axis' });
    await userEvent.click(xAxisSelect); // Open the dropdown

    // Wait for the MenuItem to appear in the DOM
    await waitFor(() => {
      expect(
        screen.getByRole('option', { name: 'bill_depth_mm' })
      ).toBeInTheDocument();
    });

    const newOption = screen.getByRole('option', { name: 'bill_depth_mm' });
    await userEvent.click(newOption); // Click the new option

    expect(mockOnAxisChange).toHaveBeenCalledTimes(1);
    expect(mockOnAxisChange).toHaveBeenCalledWith('x', 'bill_depth_mm');
  });

  it('calls onAxisChange when Y-axis is changed', async () => {
    render(
      <AxisControls
        xAxis="bill_length_mm"
        yAxis="body_mass_g"
        onAxisChange={mockOnAxisChange}
      />
    );

    const yAxisSelect = screen.getByRole('combobox', { name: 'Y-Axis' });
    await userEvent.click(yAxisSelect); // Open the dropdown

    // Wait for the MenuItem to appear in the DOM
    await waitFor(() => {
      expect(
        screen.getByRole('option', { name: 'flipper_length_mm' })
      ).toBeInTheDocument();
    });

    const newOption = screen.getByRole('option', { name: 'flipper_length_mm' });
    await userEvent.click(newOption); // Click the new option

    expect(mockOnAxisChange).toHaveBeenCalledTimes(1);
    expect(mockOnAxisChange).toHaveBeenCalledWith('y', 'flipper_length_mm');
  });
});
