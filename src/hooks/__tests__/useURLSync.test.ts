import { renderHook, act } from '@testing-library/react';
import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import type { ChartConfig } from '../useChartConfig';
import { useURLSync } from '../useURLSync';

const defaultChartConfig: ChartConfig = {
  type: 'scatter',
  x: 'bill_length_mm',
  y: 'body_mass_g',
  field: undefined,
  bins: undefined,
};

const defaultFilters = {
  species: ['Adelie', 'Chinstrap', 'Gentoo'],
  island: 'all',
  sex: 'all',
};

describe('useURLSync', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    window.history.replaceState({}, '', '/visualizations/');
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('hydrates state from URL and builds share URL', () => {
    window.history.replaceState(
      {},
      '',
      '/visualizations/?chart=histogram&field=body_mass_g&bins=18&species=gentoo&island=Dream&sex=female'
    );

    const onChartConfigChange = vi.fn();
    const setSpecies = vi.fn();
    const setIsland = vi.fn();
    const setSex = vi.fn();

    const { result, rerender } = renderHook(
      ({
        chartConfig,
        filters,
      }: {
        chartConfig: ChartConfig;
        filters: typeof defaultFilters;
      }) =>
        useURLSync({
          chartConfig,
          onChartConfigChange,
          filters,
          setFilters: {
            setSpecies,
            setIsland,
            setSex,
          },
          debounceMs: 0,
        }),
      {
        initialProps: {
          chartConfig: { ...defaultChartConfig },
          filters: { ...defaultFilters },
        },
      }
    );

    expect(result.current.hydrated).toBe(true);
    expect(onChartConfigChange).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'histogram',
        field: 'body_mass_g',
        bins: 18,
      })
    );
    expect(setSpecies).toHaveBeenCalledWith(['Gentoo']);
    expect(setIsland).toHaveBeenCalledWith('Dream');
    expect(setSex).toHaveBeenCalledWith('female');

    rerender({
      chartConfig: {
        type: 'histogram',
        field: 'body_mass_g',
        bins: 18,
        x: undefined,
        y: undefined,
      },
      filters: {
        species: ['Gentoo'],
        island: 'Dream',
        sex: 'female',
      },
    });

    const replaceStateSpy = vi.spyOn(window.history, 'replaceState');

    rerender({
      chartConfig: {
        type: 'box',
        field: 'flipper_length_mm',
        bins: undefined,
        x: undefined,
        y: undefined,
      },
      filters: {
        species: ['Adelie', 'Chinstrap'],
        island: 'Biscoe',
        sex: 'all',
      },
    });

    act(() => {
      vi.runAllTimers();
    });

    expect(replaceStateSpy).toHaveBeenCalled();

    const lastCallArgs = replaceStateSpy.mock.calls.at(-1);
    expect(lastCallArgs?.[2]).toContain('/visualizations/?chart=box');
    expect(result.current.buildShareUrl()).toContain(
      '?chart=box&field=flipper_length_mm'
    );
  });
});
