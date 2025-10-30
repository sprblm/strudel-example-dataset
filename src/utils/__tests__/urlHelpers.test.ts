import { afterAll, afterEach, describe, expect, it, vi } from 'vitest';
import {
  buildShareQueryString,
  buildShareSearchParams,
  defaultURLState,
  parseShareSearchParams,
  areSpeciesEqual,
} from '../urlHelpers';

describe('urlHelpers', () => {
  const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

  afterEach(() => {
    warnSpy.mockClear();
  });

  afterAll(() => {
    warnSpy.mockRestore();
  });

  it('returns default state when search params are empty', () => {
    const result = parseShareSearchParams('');
    expect(result).toEqual(defaultURLState);
  });

  it('normalises scatter chart parameters', () => {
    const result = parseShareSearchParams({
      chart: 'scatter',
      x: 'flipper_length_mm',
      y: 'bill_depth_mm',
      species: 'gentoo,adelie',
      island: 'Dream',
      sex: 'female',
      diet: 'fish,squid',
      lifeStage: 'adult',
      years: '2022-2024',
    });

    expect(result.chart).toEqual({
      type: 'scatter',
      x: 'flipper_length_mm',
      y: 'bill_depth_mm',
      field: undefined,
      bins: undefined,
    });
    expect(result.filters).toEqual({
      species: ['Adelie', 'Gentoo'],
      island: 'Dream',
      sex: 'female',
      diet: ['fish', 'squid'],
      lifeStage: 'adult',
      yearRange: [2022, 2024],
    });
  });

  it('normalises histogram parameters and ignores invalid values', () => {
    const result = parseShareSearchParams(
      'chart=histogram&field=body_mass_g&bins=24&species=chinstrap,invalid&island=unknown&diet=fish,krill&lifeStage=juvenile&years=2021-2023'
    );

    expect(result.chart).toEqual({
      type: 'histogram',
      field: 'body_mass_g',
      bins: 24,
      x: undefined,
      y: undefined,
    });
    expect(result.filters).toEqual({
      species: ['Chinstrap'],
      island: 'all',
      sex: 'all',
      diet: ['fish', 'krill'],
      lifeStage: 'juvenile',
      yearRange: [2021, 2023],
    });
  });

  it('normalises known island variants in search params', () => {
    const result = parseShareSearchParams({
      chart: 'scatter',
      island: 'Torgensen',
    });

    expect(result.filters.island).toBe('Torgersen');
  });

  it('serialises non-default state to query string', () => {
    const query = buildShareQueryString({
      chart: {
        type: 'histogram',
        field: 'body_mass_g',
        bins: 18,
      },
      filters: {
        species: ['Adelie'],
        island: 'Dream',
        sex: 'male',
        diet: ['fish', 'squid'],
        lifeStage: 'adult',
        yearRange: [2022, 2024],
      },
    });

    expect(query.split('&').sort()).toEqual(
      [
        'chart=histogram',
        'field=body_mass_g',
        'bins=18',
        'species=Adelie',
        'island=Dream',
        'sex=male',
        'diet=fish,squid',
        'lifeStage=adult',
        'years=2022-2024',
      ].sort()
    );
  });

  it('omits default values when building search params (except chart type)', () => {
    const params = buildShareSearchParams(defaultURLState);
    // Chart type is always included for clarity in shared URLs
    expect(params).toEqual({ chart: 'scatter' });
  });

  it('compares species arrays preserving order', () => {
    expect(
      areSpeciesEqual(['Adelie', 'Chinstrap'], ['Adelie', 'Chinstrap'])
    ).toBe(true);
    expect(
      areSpeciesEqual(['Chinstrap', 'Adelie'], ['Adelie', 'Chinstrap'])
    ).toBe(false);
  });
});
