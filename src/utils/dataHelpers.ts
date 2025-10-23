import {
  PENGUIN_DIETS,
  PENGUIN_HEALTH_METRICS,
  PENGUIN_ISLANDS,
  PENGUIN_LIFE_STAGES,
  PENGUIN_SPECIES,
  PENGUIN_YEARS,
  type PenguinDiet,
  type PenguinHealthMetric,
  type PenguinIsland,
  type PenguinLifeStage,
  type PenguinSpecies,
  type PenguinYear,
} from '@/types/penguin';

type BaselinePenguinYear = (typeof PENGUIN_YEARS)[number];

/**
 * Format null/undefined values as em dash for display
 * @param value - The value to format
 * @returns The formatted value or em dash if null/undefined
 */
export const formatValue = (
  value: number | null | undefined
): string | number => {
  if (value === null || value === undefined) {
    return '—'; // em dash
  }
  return value;
};

/**
 * Format numeric values with appropriate precision
 * @param value - The numeric value to format
 * @param decimals - Number of decimal places (default: 1)
 * @returns Formatted number string or em dash if null
 */
export const formatNumericValue = (
  value: number | null | undefined,
  decimals: number = 1
): string => {
  if (value === null || value === undefined) {
    return '—'; // em dash
  }
  return value.toFixed(decimals);
};

/**
 * Check if a value should be considered missing/null
 * @param value - The value to check
 * @returns true if the value is null, undefined, or empty string
 */
export const isMissingValue = (value: unknown): boolean => {
  return value === null || value === undefined || value === '';
};

type CategoryNormalizerConfig<T extends string> = {
  field: string;
  allowed: readonly T[];
  variants?: Record<string, T>;
};

const unexpectedCategories = new Map<string, Set<string>>();

const registerUnexpectedCategory = (field: string, rawValue: string) => {
  const trimmed = rawValue.trim();
  if (!trimmed) {
    return;
  }
  if (!unexpectedCategories.has(field)) {
    unexpectedCategories.set(field, new Set());
  }
  const seenValues = unexpectedCategories.get(field)!;
  if (seenValues.has(trimmed)) {
    return;
  }
  seenValues.add(trimmed);
  // eslint-disable-next-line no-console
  console.warn(
    `[data-normalization] Unexpected ${field} category encountered: "${trimmed}"`
  );
};

const createCategoryNormalizer = <T extends string>(
  config: CategoryNormalizerConfig<T>
) => {
  const allowedSet = new Set(config.allowed);
  const variants = config.variants ?? {};
  const variantMap = new Map<string, T>(
    Object.entries(variants) as [string, T][]
  );
  const variantLowerMap = new Map<string, T>(
    Object.entries(variants).map(([key, value]) => [
      key.toLowerCase(),
      value as T,
    ])
  );
  const allowedLowerMap = new Map<string, T>(
    config.allowed.map((value) => [value.toLowerCase(), value])
  );
  return (value: string | null | undefined): T | null => {
    if (!value) {
      return null;
    }
    const trimmed = value.trim();
    if (!trimmed) {
      return null;
    }
    const directVariant = variantMap.get(trimmed);
    const mapped = (directVariant ?? trimmed) as T | string;
    if (allowedSet.has(mapped as T)) {
      return mapped as T;
    }
    const lower = trimmed.toLowerCase();
    const lowerVariant = variantLowerMap.get(lower);
    if (lowerVariant && allowedSet.has(lowerVariant)) {
      return lowerVariant;
    }
    const caseInsensitiveMatch = allowedLowerMap.get(lower);
    if (caseInsensitiveMatch) {
      return caseInsensitiveMatch;
    }
    registerUnexpectedCategory(config.field, trimmed);
    return null;
  };
};

const isAllowedYear = (year: number): year is BaselinePenguinYear => {
  return PENGUIN_YEARS.includes(year as BaselinePenguinYear);
};

export const normalizeSpeciesValue = createCategoryNormalizer<PenguinSpecies>({
  field: 'species',
  allowed: PENGUIN_SPECIES,
});

export const normalizeIslandValue = createCategoryNormalizer<PenguinIsland>({
  field: 'island',
  allowed: PENGUIN_ISLANDS,
  variants: {
    Torgensen: 'Torgersen',
    Torgesen: 'Torgersen',
    'Biscoe Island': 'Biscoe',
    'Dream Island': 'Dream',
  },
});

export const normalizeDietValue = createCategoryNormalizer<PenguinDiet>({
  field: 'diet',
  allowed: PENGUIN_DIETS,
});

export const normalizeLifeStageValue =
  createCategoryNormalizer<PenguinLifeStage>({
    field: 'life_stage',
    allowed: PENGUIN_LIFE_STAGES,
  });

export const normalizeHealthMetricValue =
  createCategoryNormalizer<PenguinHealthMetric>({
    field: 'health_metrics',
    allowed: PENGUIN_HEALTH_METRICS,
  });

export const normalizeYearValue = (year: number): PenguinYear => {
  if (!Number.isFinite(year)) {
    registerUnexpectedCategory('year', String(year));
    return PENGUIN_YEARS[PENGUIN_YEARS.length - 1];
  }

  const normalized = Math.trunc(year);
  if (isAllowedYear(normalized)) {
    return normalized;
  }

  registerUnexpectedCategory('year', String(year));
  return normalized;
};

export const normalizeSpeciesArray = (
  values: (string | null | undefined)[]
): PenguinSpecies[] => {
  return values
    .map((value) => normalizeSpeciesValue(value))
    .filter((value): value is PenguinSpecies => value !== null);
};

export const getUnexpectedCategorySummary = (): Record<string, string[]> => {
  return Object.fromEntries(
    Array.from(unexpectedCategories.entries()).map(([field, set]) => [
      field,
      Array.from(set.values()),
    ])
  );
};

export const resetUnexpectedCategorySummary = (): void => {
  unexpectedCategories.clear();
};
