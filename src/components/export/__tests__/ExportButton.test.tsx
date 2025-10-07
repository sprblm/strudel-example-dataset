import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ExportButton } from '../ExportButton';
import { ChartConfig } from '@/hooks/useChartConfig';

const exportToPNG = vi.fn();
const buildFilename = vi.fn((options: { chartType: string }) => {
  return `test-${options.chartType}.png`;
});

vi.mock('@/hooks/useExport', () => ({
  useExport: () => ({
    exporting: false,
    exportToPNG,
    buildFilename,
  }),
}));

vi.mock('dayjs', () => ({
  default: () => ({
    format: () => '20250101',
  }),
}));

describe('ExportButton', () => {
  beforeEach(() => {
    exportToPNG.mockReset();
  });

  const renderButton = (override?: Partial<ChartConfig>, chartReady = true) => {
    const chartRef = {
      current: chartReady ? document.createElement('div') : null,
    } as React.RefObject<HTMLElement>;

    if (chartRef.current) {
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      chartRef.current.appendChild(svg);
    }

    const config: ChartConfig = {
      type: 'scatter',
      x: 'bill_length_mm',
      y: 'body_mass_g',
      field: 'bill_length_mm',
      bins: 10,
      ...override,
    };

    render(<ExportButton chartRef={chartRef} chartConfig={config} />);

    return chartRef;
  };

  it('invokes export with constructed filename for scatter plots', async () => {
    const chartRef = renderButton();
    const user = userEvent.setup();

    await user.click(screen.getByRole('button', { name: /download png/i }));

    await waitFor(() => {
      expect(exportToPNG).toHaveBeenCalledWith(chartRef.current, {
        filename: 'penguins-scatter-bill-length-mm-vs-body-mass-g-20250101.png',
        scale: 2,
      });
    });
  });

  it('uses field-based filename for histogram', async () => {
    renderButton({ type: 'histogram', field: 'body_mass_g' });
    const user = userEvent.setup();

    await user.click(screen.getByRole('button', { name: /download png/i }));

    await waitFor(() => {
      expect(exportToPNG).toHaveBeenCalledWith(expect.any(Object), {
        filename: 'penguins-histogram-body-mass-g-20250101.png',
        scale: 2,
      });
    });
  });

  it('displays error when chart reference is not ready', async () => {
    renderButton({}, false);
    const user = userEvent.setup();

    await user.click(screen.getByRole('button', { name: /download png/i }));

    expect(exportToPNG).not.toHaveBeenCalled();

    await waitFor(() => {
      expect(
        screen.getByText('Chart is not ready yet. Try again in a moment.')
      ).toBeInTheDocument();
    });
  });
});
