import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ExportButton } from '../ExportButton';

const exportToPNG = vi.fn();
const buildFilename = vi.fn(({ chartType }: { chartType: string }) => {
  return `${chartType}-2025-10-07.png`;
});

vi.mock('@/hooks/useExport', () => ({
  useExport: () => ({
    exporting: false,
    exportToPNG,
    buildFilename,
  }),
}));

describe('ExportButton (export/__tests__)', () => {
  beforeEach(() => {
    exportToPNG.mockReset();
    buildFilename.mockClear();
  });

  const renderButton = (options?: {
    chartType?: string;
    title?: string;
    disabled?: boolean;
    withSvg?: boolean;
  }) => {
    const {
      chartType = 'scatter',
      title = 'Scatter Plot',
      disabled = false,
    } = options ?? {};

    const container = document.createElement('figure');
    if (options?.withSvg !== false) {
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      container.appendChild(svg);
    }

    const ref = { current: container } as React.RefObject<HTMLElement>;

    render(
      <ExportButton
        containerRef={ref}
        chartType={chartType}
        title={title}
        disabled={disabled}
      />
    );

    return { container, chartType, title, ref };
  };

  it('calls export utilities with the generated filename', async () => {
    const user = userEvent.setup();
    const { container, chartType, title } = renderButton();

    await user.click(
      screen.getByRole('button', {
        name: /download scatter chart as png/i,
      })
    );

    expect(buildFilename).toHaveBeenCalledWith({ chartType });
    expect(exportToPNG).toHaveBeenCalledWith(container, {
      filename: `${chartType}-2025-10-07.png`,
      chartType,
      title,
    });
  });

  it('does not invoke export when disabled', () => {
    renderButton({ disabled: true });

    const button = screen.getByRole('button', {
      name: /download scatter chart as png/i,
    });

    expect(button).toBeDisabled();
    expect(exportToPNG).not.toHaveBeenCalled();
  });

  it('prevents export when the container ref is empty', async () => {
    const user = userEvent.setup();
    const ref = { current: null } as React.RefObject<HTMLElement>;

    render(
      <ExportButton
        containerRef={ref}
        chartType="histogram"
        title="Histogram"
      />
    );

    await user.click(
      screen.getByRole('button', {
        name: /download histogram chart as png/i,
      })
    );

    expect(buildFilename).not.toHaveBeenCalled();
    expect(exportToPNG).not.toHaveBeenCalled();
  });
});
