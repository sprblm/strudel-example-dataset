import type { Penguin } from '@/types/penguin';

export type NumericField =
  | 'bill_length_mm'
  | 'bill_depth_mm'
  | 'flipper_length_mm'
  | 'body_mass_g';

export const NUMERIC_FIELDS: readonly NumericField[] = [
  'bill_length_mm',
  'bill_depth_mm',
  'flipper_length_mm',
  'body_mass_g',
];

export const DEFAULT_CHART_FIELDS: Record<'x' | 'y', NumericField> = {
  x: 'bill_length_mm',
  y: 'body_mass_g',
};

export const getFieldLabel = (field: NumericField): string =>
  field.replace(/_/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());

export const coerceNumericValue = (
  value: Penguin[NumericField] | null | undefined
): number | null => {
  if (value === null || value === undefined) {
    return null;
  }
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
};
