/**
 * Format null/undefined values as em dash for display
 * @param value - The value to format
 * @returns The formatted value or em dash if null/undefined
 */
export const formatValue = (value: number | null | undefined): string | number => {
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