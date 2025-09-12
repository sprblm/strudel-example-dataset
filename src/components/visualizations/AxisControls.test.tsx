import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { AxisControls } from './AxisControls';

const mockOnChange = vi.fn();

const user = userEvent.setup();

describe('AxisControls', () => {
  it('renders X and Y axis selectors with correct options', () => {
    render(
      <AxisControls
        currentX="bill_length_mm"
        currentY="body_mass_g"
        onAxisChange={mockOnChange}
      />
    );

    expect(
      screen.getByRole('combobox', { name: /x axis/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('combobox', { name: /y axis/i })
    ).toBeInTheDocument();

    expect(screen.getByText('Bill Length (mm)')).toBeInTheDocument();
    expect(screen.getByText('Body Mass (g)')).toBeInTheDocument();
  });

  it('calls onAxisChange when X axis is changed', async () => {
    render(
      <AxisControls
        currentX="bill_length_mm"
        currentY="body_mass_g"
        onAxisChange={mockOnChange}
      />
    );

    const xSelect = screen.getByRole('combobox', { name: /x axis/i });
    await user.selectOptions(xSelect, 'flipper_length_mm');

    expect(mockOnChange).toHaveBeenCalledWith('x', 'flipper_length_mm');
  });

  it('calls onAxisChange when Y axis is changed', async () => {
    render(
      <AxisControls
        currentX="bill_length_mm"
        currentY="body_mass_g"
        onAxisChange={mockOnChange}
      />
    );

    const ySelect = screen.getByRole('combobox', { name: /y axis/i });
    await user.selectOptions(ySelect, 'bill_depth_mm');

    expect(mockOnChange).toHaveBeenCalledWith('y', 'bill_depth_mm');
  });
});
