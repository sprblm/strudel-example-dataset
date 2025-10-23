import {
  formatValue,
  formatNumericValue,
  getUnexpectedCategorySummary,
  isMissingValue,
  normalizeDietValue,
  normalizeHealthMetricValue,
  normalizeIslandValue,
  normalizeLifeStageValue,
  normalizeYearValue,
  resetUnexpectedCategorySummary,
} from '../dataHelpers';
import { vi } from 'vitest';

describe('dataHelpers', () => {
  describe('formatValue', () => {
    it('returns em dash for null values', () => {
      expect(formatValue(null)).toEqual('—');
    });

    it('returns em dash for undefined values', () => {
      expect(formatValue(undefined)).toBe('—');
    });

    it('returns the original value for valid numbers', () => {
      expect(formatValue(42)).toBe(42);
      expect(formatValue(0)).toBe(0);
      expect(formatValue(-15.5)).toBe(-15.5);
    });
  });

  describe('formatNumericValue', () => {
    it('returns em dash for null values', () => {
      expect(formatNumericValue(null)).toBe('—');
    });

    it('returns em dash for undefined values', () => {
      expect(formatNumericValue(undefined)).toBe('—');
    });

    it('formats numbers with default 1 decimal place', () => {
      expect(formatNumericValue(42.456)).toBe('42.5');
      expect(formatNumericValue(0)).toBe('0.0');
      expect(formatNumericValue(15)).toBe('15.0');
    });

    it('formats numbers with custom decimal places', () => {
      expect(formatNumericValue(42.456, 2)).toBe('42.46');
      expect(formatNumericValue(42.456, 0)).toBe('42');
      expect(formatNumericValue(42.456, 3)).toBe('42.456');
    });
  });

  describe('isMissingValue', () => {
    it('returns true for null', () => {
      expect(isMissingValue(null)).toBe(true);
    });

    it('returns true for undefined', () => {
      expect(isMissingValue(undefined)).toBe(true);
    });

    it('returns true for empty string', () => {
      expect(isMissingValue('')).toBe(true);
    });

    it('returns false for valid values', () => {
      expect(isMissingValue(0)).toBe(false);
      expect(isMissingValue(42)).toBe(false);
      expect(isMissingValue('hello')).toBe(false);
      expect(isMissingValue(false)).toBe(false);
    });
  });

  describe('normalizers', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    afterEach(() => {
      warnSpy.mockClear();
      resetUnexpectedCategorySummary();
    });

    afterAll(() => {
      warnSpy.mockRestore();
    });

    it('normalizes known variants for island names', () => {
      expect(normalizeIslandValue('Torgensen')).toBe('Torgersen');
      expect(normalizeIslandValue('Dream')).toBe('Dream');
      expect(normalizeIslandValue('')).toBeNull();
    });

    it('guards and records unexpected categories', () => {
      expect(normalizeDietValue('krill')).toBe('krill');
      expect(normalizeDietValue('unknown')).toBeNull();
      expect(normalizeHealthMetricValue('healthy')).toBe('healthy');
      expect(normalizeLifeStageValue('hatchling')).toBeNull();
      expect(normalizeYearValue(2026)).toBe(2026);

      expect(warnSpy).toHaveBeenCalledTimes(3);
      expect(getUnexpectedCategorySummary()).toEqual({
        diet: ['unknown'],
        life_stage: ['hatchling'],
        year: ['2026'],
      });
    });
  });
});
