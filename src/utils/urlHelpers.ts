import { DEFAULT_CHART_CONFIG, type ChartConfig } from '@/hooks/useChartConfig';
import {
  DEFAULT_CHART_FIELDS,
  NUMERIC_FIELDS,
  type NumericField,
} from '@/components/visualizations/types';
import {
  PENGUIN_DIETS,
  PENGUIN_LIFE_STAGES,
  PENGUIN_SPECIES,
  PENGUIN_YEARS,
  type PenguinSpecies,
} from '@/types/penguin';
import {
  normalizeIslandValue,
  normalizeSpeciesValue,
} from '@/utils/dataHelpers';

export type ChartType = ChartConfig['type'];

const CHART_TYPES: readonly ChartType[] = ['scatter', 'histogram', 'box'];
const SPECIES = PENGUIN_SPECIES;
type Species = PenguinSpecies;
const SEXES: readonly string[] = ['all', 'male', 'female'];
const DEFAULT_SPECIES: Species[] = [...SPECIES];
const DEFAULT_ISLAND = 'all';
const DEFAULT_SEX = 'all';
const DEFAULT_BINS = DEFAULT_CHART_CONFIG.bins ?? 12;
const DEFAULT_DIET = [...PENGUIN_DIETS];
const LIFE_STAGE_OPTIONS: readonly string[] = ['all', ...PENGUIN_LIFE_STAGES];
const DEFAULT_LIFE_STAGE = 'all';
const DEFAULT_YEAR_RANGE: readonly [number, number] = [
  PENGUIN_YEARS[0],
  PENGUIN_YEARS[PENGUIN_YEARS.length - 1],
];

export interface FiltersState {
  species: string[];
  island: string;
  sex: string;
  diet: string[];
  lifeStage: string;
  yearRange: readonly [number, number];
}

export interface URLState {
  chart: ChartConfig;
  filters: FiltersState;
}

export interface ShareSearchParams {
  chart?: ChartType;
  x?: NumericField;
  y?: NumericField;
  field?: NumericField;
  bins?: number;
  species?: string[];
  island?: string;
  sex?: string;
  diet?: string[];
  lifeStage?: string;
  years?: string;
}

const toURLSearchParams = (
  input: string | URLSearchParams | Record<string, unknown> | undefined
): URLSearchParams => {
  if (!input) {
    return new URLSearchParams();
  }
  if (typeof input === 'string') {
    return new URLSearchParams(input);
  }
  if (input instanceof URLSearchParams) {
    return input;
  }
  const params = new URLSearchParams();
  Object.entries(input).forEach(([key, value]) => {
    if (value === null || value === undefined) return;
    if (Array.isArray(value)) {
      value.forEach((entry) => params.append(key, String(entry)));
      return;
    }
    params.set(key, String(value));
  });
  return params;
};

const normaliseSpecies = (value: string | null): Species[] => {
  if (!value) {
    return DEFAULT_SPECIES;
  }
  const normalised: Species[] = value
    .split(',')
    .map((token) => token.trim())
    .filter((token): token is string => token.length > 0)
    .map((token) => normalizeSpeciesValue(token))
    .filter((token): token is Species => token !== null);

  const uniqueInOrder = SPECIES.filter((species) =>
    normalised.includes(species)
  );

  return uniqueInOrder.length > 0 ? uniqueInOrder : DEFAULT_SPECIES;
};

const normaliseIsland = (value: string | null): string => {
  if (!value) {
    return DEFAULT_ISLAND;
  }
  if (value.toLowerCase() === 'all') {
    return 'all';
  }
  const normalised = normalizeIslandValue(value);
  return normalised ?? DEFAULT_ISLAND;
};

const normaliseSex = (value: string | null): string => {
  if (!value) return DEFAULT_SEX;
  const normalised = value.toLowerCase();
  const matched = SEXES.find((sex) => sex.toLowerCase() === normalised);
  return matched ?? DEFAULT_SEX;
};

const normaliseDiet = (value: string | null): string[] => {
  if (!value) {
    return DEFAULT_DIET;
  }

  const tokens = value
    .split(',')
    .map((token) => token.trim().toLowerCase())
    .filter((token): token is string => token.length > 0);

  const uniqueInOrder = PENGUIN_DIETS.filter((diet) =>
    tokens.includes(diet.toLowerCase())
  );

  return uniqueInOrder.length > 0 ? uniqueInOrder : DEFAULT_DIET;
};

const normaliseLifeStage = (value: string | null): string => {
  if (!value) {
    return DEFAULT_LIFE_STAGE;
  }
  const normalised = value.trim().toLowerCase();
  const matched = LIFE_STAGE_OPTIONS.find(
    (stage) => stage.toLowerCase() === normalised
  );
  return matched ?? DEFAULT_LIFE_STAGE;
};

const normaliseYearRange = (
  value: string | null
): readonly [number, number] => {
  if (!value) {
    return DEFAULT_YEAR_RANGE;
  }

  const parts = value.split('-').map((token) => Number.parseInt(token, 10));
  if (parts.length !== 2 || parts.some((part) => !Number.isFinite(part))) {
    return DEFAULT_YEAR_RANGE;
  }

  let [start, end] = parts as [number, number];
  if (start > end) {
    [start, end] = [end, start];
  }

  const minYear = PENGUIN_YEARS[0];
  const maxYear = PENGUIN_YEARS[PENGUIN_YEARS.length - 1];
  const clampedStart = Math.max(minYear, Math.min(start, maxYear));
  const clampedEnd = Math.max(clampedStart, Math.min(end, maxYear));

  if (clampedStart === minYear && clampedEnd === maxYear) {
    return DEFAULT_YEAR_RANGE;
  }

  return [clampedStart, clampedEnd];
};

const normaliseNumericField = (
  value: string | null,
  fallback: NumericField
): NumericField => {
  if (!value) return fallback;
  const candidate = value as NumericField;
  return NUMERIC_FIELDS.includes(candidate) ? candidate : fallback;
};

const normaliseBins = (value: string | null): number => {
  if (!value) return DEFAULT_BINS;
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return DEFAULT_BINS;
  }
  return Math.min(parsed, 100);
};

const normaliseChartType = (value: string | null): ChartType => {
  if (!value) return DEFAULT_CHART_CONFIG.type;
  const candidate = value as ChartType;
  return CHART_TYPES.includes(candidate)
    ? candidate
    : DEFAULT_CHART_CONFIG.type;
};

export const parseShareSearchParams = (
  search: string | URLSearchParams | Record<string, unknown> | undefined
): URLState => {
  const params = toURLSearchParams(search);
  const chartType = normaliseChartType(params.get('chart'));

  if (chartType === 'scatter') {
    const chart: ChartConfig = {
      type: 'scatter',
      x: normaliseNumericField(params.get('x'), DEFAULT_CHART_FIELDS.x),
      y: normaliseNumericField(params.get('y'), DEFAULT_CHART_FIELDS.y),
      field: undefined,
      bins: undefined,
    };
    return {
      chart,
      filters: {
        species: normaliseSpecies(params.get('species')),
        island: normaliseIsland(params.get('island')),
        sex: normaliseSex(params.get('sex')),
        diet: normaliseDiet(params.get('diet')),
        lifeStage: normaliseLifeStage(params.get('lifeStage')),
        yearRange: normaliseYearRange(params.get('years')),
      },
    };
  }

  if (chartType === 'histogram') {
    const chart: ChartConfig = {
      type: 'histogram',
      field: normaliseNumericField(params.get('field'), DEFAULT_CHART_FIELDS.x),
      bins: normaliseBins(params.get('bins')),
      x: undefined,
      y: undefined,
    };
    return {
      chart,
      filters: {
        species: normaliseSpecies(params.get('species')),
        island: normaliseIsland(params.get('island')),
        sex: normaliseSex(params.get('sex')),
        diet: normaliseDiet(params.get('diet')),
        lifeStage: normaliseLifeStage(params.get('lifeStage')),
        yearRange: normaliseYearRange(params.get('years')),
      },
    };
  }

  const chart: ChartConfig = {
    type: 'box',
    field: normaliseNumericField(params.get('field'), DEFAULT_CHART_FIELDS.x),
    bins: undefined,
    x: undefined,
    y: undefined,
  };

  return {
    chart,
    filters: {
      species: normaliseSpecies(params.get('species')),
      island: normaliseIsland(params.get('island')),
      sex: normaliseSex(params.get('sex')),
      diet: normaliseDiet(params.get('diet')),
      lifeStage: normaliseLifeStage(params.get('lifeStage')),
      yearRange: normaliseYearRange(params.get('years')),
    },
  };
};

const isDefaultSpecies = (species: string[]): boolean => {
  if (species.length !== DEFAULT_SPECIES.length) return false;
  return SPECIES.every((item, index) => species[index] === item);
};

const isDefaultDiet = (diet: string[]): boolean => {
  if (!diet || diet.length !== PENGUIN_DIETS.length) {
    return false;
  }
  return PENGUIN_DIETS.every((item) => diet.includes(item));
};

const isDefaultYearRange = (range: readonly [number, number]): boolean => {
  return (
    range[0] === DEFAULT_YEAR_RANGE[0] && range[1] === DEFAULT_YEAR_RANGE[1]
  );
};

export const buildShareSearchParams = (state: URLState): ShareSearchParams => {
  const params: ShareSearchParams = {};
  const { chart, filters } = state;

  // Always include chart type for clarity in shared URLs
  params.chart = chart.type;

  if (chart.type === 'scatter') {
    if (chart.x && chart.x !== DEFAULT_CHART_FIELDS.x) {
      params.x = chart.x;
    }
    if (chart.y && chart.y !== DEFAULT_CHART_FIELDS.y) {
      params.y = chart.y;
    }
  }

  if (chart.type === 'histogram') {
    params.chart = 'histogram';
    if (chart.field) {
      params.field = chart.field;
    }
    if (chart.bins && chart.bins !== DEFAULT_BINS) {
      params.bins = chart.bins;
    }
  }

  if (chart.type === 'box') {
    params.chart = 'box';
    if (chart.field) {
      params.field = chart.field;
    }
  }

  if (!isDefaultSpecies(filters.species)) {
    params.species = SPECIES.filter((species) =>
      filters.species.includes(species)
    );
  }

  if (filters.island !== DEFAULT_ISLAND) {
    params.island = filters.island;
  }

  if (filters.sex !== DEFAULT_SEX) {
    params.sex = filters.sex;
  }

  if (!isDefaultDiet(filters.diet)) {
    params.diet = filters.diet;
  }

  if (filters.lifeStage !== DEFAULT_LIFE_STAGE) {
    params.lifeStage = filters.lifeStage;
  }

  if (!isDefaultYearRange(filters.yearRange)) {
    params.years = `${filters.yearRange[0]}-${filters.yearRange[1]}`;
  }

  return params;
};

export const buildShareQueryString = (state: URLState): string => {
  const params = new URLSearchParams();
  const searchParams = buildShareSearchParams(state);

  if (searchParams.chart) {
    params.set('chart', searchParams.chart);
  }
  if (searchParams.x) {
    params.set('x', searchParams.x);
  }
  if (searchParams.y) {
    params.set('y', searchParams.y);
  }
  if (searchParams.field) {
    params.set('field', searchParams.field);
  }
  if (typeof searchParams.bins === 'number') {
    params.set('bins', String(searchParams.bins));
  }
  if (searchParams.species && searchParams.species.length > 0) {
    params.set('species', searchParams.species.join(','));
  }
  if (searchParams.island) {
    params.set('island', searchParams.island);
  }
  if (searchParams.sex) {
    params.set('sex', searchParams.sex);
  }
  if (searchParams.diet && searchParams.diet.length > 0) {
    params.set('diet', searchParams.diet.join(','));
  }
  if (searchParams.lifeStage) {
    params.set('lifeStage', searchParams.lifeStage);
  }
  if (searchParams.years) {
    params.set('years', searchParams.years);
  }

  return params.toString();
};

export const areSpeciesEqual = (a: string[], b: string[]): boolean => {
  if (a.length !== b.length) return false;
  return a.every((value, index) => value === b[index]);
};

export const mergeURLState = (
  base: URLState,
  overrides: Partial<URLState>
): URLState => ({
  chart: { ...base.chart, ...(overrides.chart ?? {}) },
  filters: { ...base.filters, ...(overrides.filters ?? {}) },
});

export const defaultURLState: URLState = {
  chart: {
    type: DEFAULT_CHART_CONFIG.type,
    x: DEFAULT_CHART_CONFIG.x,
    y: DEFAULT_CHART_CONFIG.y,
    field: undefined,
    bins: undefined,
  },
  filters: {
    species: DEFAULT_SPECIES,
    island: DEFAULT_ISLAND,
    sex: DEFAULT_SEX,
    diet: DEFAULT_DIET,
    lifeStage: DEFAULT_LIFE_STAGE,
    yearRange: DEFAULT_YEAR_RANGE,
  },
};
