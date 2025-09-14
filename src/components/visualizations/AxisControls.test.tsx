import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { AxisControls } from './AxisControls';

const mockOnConfigChange = vi.fn();

describe('AxisControls', () => {
  it('renders X and Y axis selectors with correct options', () => {
    render(
      <AxisControls
        config={{
          type: 'scatter',
          x: 'bill_length_mm',
          y: 'body_mass_g',
        }}
        onConfigChange={mockOnConfigChange}
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

  it('calls onConfigChange when X axis is changed', async () => {
    render(
      <AxisControls
        config={{
          type: 'scatter',
          x: 'bill_length_mm',
          y: 'body_mass_g',
        }}
        onConfigChange={mockOnConfigChange}
      />
    );

    const xSelect = screen.getByRole('combobox', { name: 'X Axis' });
    fireEvent.mouseDown(xSelect);

    const option = screen.getByText('Flipper Length (mm)');
    fireEvent.click(option);

    expect(mockOnConfigChange).toHaveBeenCalledWith({ x: 'flipper_length_mm' });
  });

  it('calls onConfigChange when Y axis is changed', async () => {
    render(
      <AxisControls
        config={{
          type: 'scatter',
          x: 'bill_length_mm',
          y: 'body_mass_g',
        }}
        onConfigChange={mockOnConfigChange}
      />
    );

    const ySelect = screen.getByRole('combobox', { name: 'Y Axis' });
    fireEvent.mouseDown(ySelect);

    const option = screen.getByText('Bill Depth (mm)');
    fireEvent.click(option);

    expect(mockOnConfigChange).toHaveBeenCalledWith({ y: 'bill_depth_mm' });
  });
});
