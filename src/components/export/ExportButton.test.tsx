import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, expect, it, vi, afterEach } from 'vitest';
import { ExportButton } from './ExportButton';
import * as useExportModule from '@/hooks/useExport';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('ExportButton', () => {
  it('invokes export when clicked', async () => {
    const exportToPNG = vi.fn().mockResolvedValue(undefined);
    const buildFilename = vi.fn().mockReturnValue('scatter-2025-09-25.png');

    vi.spyOn(useExportModule, 'useExport').mockReturnValue({
      exporting: false,
      exportToPNG,
      buildFilename,
    });

    const container = document.createElement('div');
    const ref = { current: container } as React.RefObject<HTMLElement>;

    render(
      <ExportButton
        containerRef={ref}
        chartType="scatter"
        title="Scatter Plot"
      />
    );

    const button = screen.getByRole('button', {
      name: /download scatter chart as png/i,
    });

    fireEvent.click(button);

    await waitFor(() => {
      expect(buildFilename).toHaveBeenCalledWith({ chartType: 'scatter' });
      expect(exportToPNG).toHaveBeenCalledWith(container, {
        filename: 'scatter-2025-09-25.png',
        chartType: 'scatter',
        title: 'Scatter Plot',
      });
    });
  });

  it('is disabled when requested', () => {
    const exportToPNG = vi.fn();
    const buildFilename = vi.fn();

    vi.spyOn(useExportModule, 'useExport').mockReturnValue({
      exporting: false,
      exportToPNG,
      buildFilename,
    });

    const ref = {
      current: document.createElement('div'),
    } as React.RefObject<HTMLElement>;

    render(
      <ExportButton
        containerRef={ref}
        chartType="scatter"
        title="Scatter Plot"
        disabled
      />
    );

    const button = screen.getByRole('button', {
      name: /download scatter chart as png/i,
    });

    expect(button).toBeDisabled();
    expect(exportToPNG).not.toHaveBeenCalled();
  });
});
