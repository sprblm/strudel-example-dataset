import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { HistogramControls } from './HistogramControls';

const mockOnConfigChange = vi.fn();

describe('HistogramControls', () => {
  it('renders variable selector and bin radios with correct options', () => {
    render(
      <HistogramControls
        config={{
          field: 'bill_length_mm',
          bins: 10,
        }}
        onConfigChange={mockOnConfigChange}
      />
    );

    expect(
      screen.getByRole('combobox', { name: /variable/i })
    ).toBeInTheDocument();
    expect(screen.getByText('Bill Length (mm)')).toBeInTheDocument();
    expect(screen.getByLabelText('5 Bins')).toBeInTheDocument();
    expect(screen.getByLabelText('10 Bins')).toBeInTheDocument();
    expect(screen.getByLabelText('20 Bins')).toBeInTheDocument();
  });

  it('calls onConfigChange when variable is changed', async () => {
    render(
      <HistogramControls
        config={{
          field: 'bill_length_mm',
          bins: 10,
        }}
        onConfigChange={mockOnConfigChange}
      />
    );

    const select = screen.getByRole('combobox', { name: 'Variable' });
    fireEvent.mouseDown(select);

    const option = screen.getByText('Flipper Length (mm)');
    fireEvent.click(option);

    expect(mockOnConfigChange).toHaveBeenCalledWith({
      field: 'flipper_length_mm',
    });
  });

  it('calls onConfigChange when bins are changed to 5', async () => {
    render(
      <HistogramControls
        config={{
          field: 'bill_length_mm',
          bins: 10,
        }}
        onConfigChange={mockOnConfigChange}
      />
    );

    const radio5 = screen.getByLabelText('5 Bins');
    fireEvent.click(radio5);

    expect(mockOnConfigChange).toHaveBeenCalledWith({ bins: 5 });
  });

  it('calls onConfigChange when bins are changed to 20', async () => {
    render(
      <HistogramControls
        config={{
          field: 'bill_length_mm',
          bins: 10,
        }}
        onConfigChange={mockOnConfigChange}
      />
    );

    const radio20 = screen.getByLabelText('20 Bins');
    fireEvent.click(radio20);

    expect(mockOnConfigChange).toHaveBeenCalledWith({ bins: 20 });
  });

  it('defaults to bill_length_mm and 10 bins when no config provided', () => {
    render(<HistogramControls onConfigChange={mockOnConfigChange} />);

    expect(screen.getByText('Bill Length (mm)')).toBeInTheDocument();

    const radio10 = screen.getByLabelText('10 Bins');
    expect(radio10).toBeChecked();
  });
});
