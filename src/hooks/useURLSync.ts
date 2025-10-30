import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ChartConfig } from './useChartConfig';
import {
  areSpeciesEqual,
  buildShareQueryString,
  parseShareSearchParams,
  type FiltersState,
  type URLState,
} from '@/utils/urlHelpers';

interface UseURLSyncOptions {
  chartConfig: ChartConfig;
  onChartConfigChange: (update: Partial<ChartConfig>) => void;
  filters: FiltersState;
  setFilters: {
    setSpecies: (species: string[]) => void;
    setIsland: (island: string) => void;
    setSex: (sex: string) => void;
    setDiet: (diet: string[]) => void;
    setLifeStage: (lifeStage: string) => void;
    setYearRange: (range: readonly [number, number]) => void;
  };
  debounceMs?: number;
}

export interface UseURLSyncResult {
  buildShareUrl: () => string;
  hydrated: boolean;
}

const chartsEqual = (a: ChartConfig, b: ChartConfig) => {
  if (a.type !== b.type) return false;
  return a.x === b.x && a.y === b.y && a.field === b.field && a.bins === b.bins;
};

const filtersEqual = (a: FiltersState, b: FiltersState) => {
  return (
    areSpeciesEqual(a.species, b.species) &&
    a.island === b.island &&
    a.sex === b.sex &&
    areSpeciesEqual(a.diet, b.diet) &&
    a.lifeStage === b.lifeStage &&
    a.yearRange[0] === b.yearRange[0] &&
    a.yearRange[1] === b.yearRange[1]
  );
};

const buildRelativeUrl = (query: string): string => {
  const basePath = window.location.pathname;
  const hash = window.location.hash ?? '';
  if (!query) {
    return `${basePath}${hash}`;
  }
  return `${basePath}?${query}${hash}`;
};

const applyChartConfig = (
  next: ChartConfig,
  onChartConfigChange: UseURLSyncOptions['onChartConfigChange']
) => {
  onChartConfigChange({
    type: next.type,
    x: next.x,
    y: next.y,
    field: next.field,
    bins: next.bins,
  });
};

const applyFilters = (
  next: FiltersState,
  setFilters: UseURLSyncOptions['setFilters'],
  current: FiltersState
) => {
  if (!areSpeciesEqual(current.species, next.species)) {
    setFilters.setSpecies(next.species);
  }
  if (current.island !== next.island) {
    setFilters.setIsland(next.island);
  }
  if (current.sex !== next.sex) {
    setFilters.setSex(next.sex);
  }
  if (!areSpeciesEqual(current.diet, next.diet)) {
    setFilters.setDiet(next.diet);
  }
  if (current.lifeStage !== next.lifeStage) {
    setFilters.setLifeStage(next.lifeStage);
  }
  if (
    current.yearRange[0] !== next.yearRange[0] ||
    current.yearRange[1] !== next.yearRange[1]
  ) {
    setFilters.setYearRange(next.yearRange);
  }
};

export const useURLSync = ({
  chartConfig,
  onChartConfigChange,
  filters,
  setFilters,
  debounceMs = 100,
}: UseURLSyncOptions): UseURLSyncResult => {
  const [hydrated, setHydrated] = useState(false);
  const isHydratingRef = useRef(true);
  const searchRef = useRef<string>('');
  const debounceRef = useRef<number>();

  const currentState = useMemo<URLState>(
    () => ({
      chart: chartConfig,
      filters,
    }),
    [chartConfig, filters]
  );

  const hydrateFromUrl = useCallback(
    (searchString: string) => {
      const nextState = parseShareSearchParams(searchString);
      searchRef.current = buildShareQueryString(nextState);

      if (!chartsEqual(chartConfig, nextState.chart)) {
        applyChartConfig(nextState.chart, onChartConfigChange);
      }

      if (!filtersEqual(filters, nextState.filters)) {
        applyFilters(nextState.filters, setFilters, filters);
      }
    },
    [chartConfig, filters, onChartConfigChange, setFilters]
  );

  useEffect(() => {
    isHydratingRef.current = true;
    hydrateFromUrl(window.location.search);
    isHydratingRef.current = false;
    setHydrated(true);

    const handlePopState = () => {
      isHydratingRef.current = true;
      hydrateFromUrl(window.location.search);
      isHydratingRef.current = false;
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [hydrateFromUrl]);

  useEffect(() => {
    if (!hydrated || isHydratingRef.current) {
      return;
    }

    const state: URLState = {
      chart: currentState.chart,
      filters: currentState.filters,
    };

    const nextQuery = buildShareQueryString(state);

    if (nextQuery === searchRef.current) {
      return;
    }

    window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(() => {
      searchRef.current = nextQuery;
      const nextUrl = buildRelativeUrl(nextQuery);
      window.history.replaceState({}, '', nextUrl);
    }, debounceMs) as unknown as number;

    return () => {
      window.clearTimeout(debounceRef.current);
    };
  }, [currentState, hydrated, debounceMs]);

  const buildShareUrl = useCallback(() => {
    const state: URLState = {
      chart: currentState.chart,
      filters: currentState.filters,
    };
    const query = buildShareQueryString(state);
    const url = new URL(window.location.href);
    url.search = query;
    return url.toString();
  }, [currentState]);

  return { buildShareUrl, hydrated };
};

export default useURLSync;
