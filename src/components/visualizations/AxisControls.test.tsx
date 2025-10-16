import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import AxisControls from './AxisControls';
import type { ChartConfig } from '@/hooks/useChartConfig';

describe('AxisControls', () => {
  const mockOnConfigChange = vi.fn();

  beforeEach(() => {
    mockOnConfigChange.mockClear();
  });

  const defaultConfig: ChartConfig = {
    type: 'scatter',
    x: 'bill_length_mm',
    y: 'body_mass_g',
  };

  it('renders correctly with initial values', () => {
    render(
      <AxisControls
        config={defaultConfig}
        onConfigChange={mockOnConfigChange}
      />
    );

    expect(
      screen.getByRole('combobox', { name: 'Chart Type' })
    ).toHaveTextContent('Scatter');
    expect(screen.getByRole('combobox', { name: 'X-axis' })).toHaveTextContent(
      'Bill Length Mm'
    );
    expect(screen.getByRole('combobox', { name: 'Y-axis' })).toHaveTextContent(
      'Body Mass G'
    );
  });

  it('calls onConfigChange when chart type is changed', async () => {
    render(
      <AxisControls
        config={defaultConfig}
        onConfigChange={mockOnConfigChange}
      />
    );

    const chartTypeSelect = screen.getByRole('combobox', {
      name: 'Chart Type',
    });
    await userEvent.click(chartTypeSelect);

    const histogramOption = screen.getByRole('option', { name: 'Histogram' });
    await userEvent.click(histogramOption);

    expect(mockOnConfigChange).toHaveBeenCalledTimes(1);
    expect(mockOnConfigChange).toHaveBeenCalledWith({ type: 'histogram' });
  });

  it('calls onConfigChange when X-axis is changed', async () => {
    render(
      <AxisControls
        config={defaultConfig}
        onConfigChange={mockOnConfigChange}
      />
    );

    const xAxisSelect = screen.getByRole('combobox', { name: 'X-axis' });
    await userEvent.click(xAxisSelect);

    await waitFor(() => {
      expect(
        screen.getByRole('option', { name: 'Bill Depth Mm' })
      ).toBeInTheDocument();
    });

    const newOption = screen.getByRole('option', { name: 'Bill Depth Mm' });
    await userEvent.click(newOption);

    expect(mockOnConfigChange).toHaveBeenCalledTimes(1);
    expect(mockOnConfigChange).toHaveBeenCalledWith({ x: 'bill_depth_mm' });
  });

  it('calls onConfigChange when Y-axis is changed', async () => {
    render(
      <AxisControls
        config={defaultConfig}
        onConfigChange={mockOnConfigChange}
      />
    );

    const yAxisSelect = screen.getByRole('combobox', { name: 'Y-axis' });
    await userEvent.click(yAxisSelect);

    await waitFor(() => {
      expect(
        screen.getByRole('option', { name: 'Flipper Length Mm' })
      ).toBeInTheDocument();
    });

    const newOption = screen.getByRole('option', { name: 'Flipper Length Mm' });
    await userEvent.click(newOption);

    expect(mockOnConfigChange).toHaveBeenCalledTimes(1);
    expect(mockOnConfigChange).toHaveBeenCalledWith({ y: 'flipper_length_mm' });
  });

  it('renders field select for non-scatter charts', () => {
    const histogramConfig: ChartConfig = {
      type: 'histogram',
      field: 'bill_length_mm',
      bins: 10,
    };

    render(
      <AxisControls
        config={histogramConfig}
        onConfigChange={mockOnConfigChange}
      />
    );

    expect(
      screen.getByRole('combobox', { name: 'Chart Type' })
    ).toHaveTextContent('Histogram');
    expect(screen.getByRole('combobox', { name: 'Field' })).toHaveTextContent(
      'Bill Length Mm'
    );
    expect(screen.getByRole('combobox', { name: 'Bins' })).toHaveTextContent(
      '10'
    );
  });

  it('does not render axis controls for non-scatter charts', () => {
    const histogramConfig: ChartConfig = {
      type: 'histogram',
      field: 'bill_length_mm',
      bins: 10,
    };

    render(
      <AxisControls
        config={histogramConfig}
        onConfigChange={mockOnConfigChange}
      />
    );

    expect(
      screen.queryByRole('combobox', { name: 'X-axis' })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('combobox', { name: 'Y-axis' })
    ).not.toBeInTheDocument();
  });
});
