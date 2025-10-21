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

/**
 * Normalize categorical values that might have variants
 * Maps known variants to standard forms (e.g., Torgensen → Torgersen)
 * @param value - The categorical value to normalize
 * @returns The normalized categorical value
 */
export const normalizeCategoricalValue = (
  value: string | null | undefined
): string | null => {
  if (!value) {
    return null;
  }

  // Known island name variants
  const islandVariants: Record<string, string> = {
    Torgensen: 'Torgersen',
    Torgesen: 'Torgersen',
    'Biscoe Island': 'Biscoe',
    'Dream Island': 'Dream',
  };

  const normalizedValue = value.trim();
  return islandVariants[normalizedValue] || normalizedValue;
};

/**
 * Normalize an array of categorical values
 * @param values - The array of categorical values to normalize
 * @returns The array of normalized categorical values
 */
export const normalizeCategoricalArray = (
  values: (string | null | undefined)[]
): (string | null)[] => {
  return values.map((value) => normalizeCategoricalValue(value));
};
