import { describe, it, expect } from 'vitest';
import {
  filterPenguinsBySpecies,
  filterPenguinsByIsland,
  filterPenguinsBySex,
  filterPenguinsByDiet,
  filterPenguinsByLifeStage,
  filterPenguinsByYearRange,
  filterPenguins,
} from '@/utils/filtering';
import { Penguin } from '@/types/penguin';

// Mock penguin data for testing
const mockPenguins: Penguin[] = [
  {
    species: 'Adelie',
    island: 'Biscoe',
    bill_length_mm: 39.1,
    bill_depth_mm: 18.7,
    flipper_length_mm: 181,
    body_mass_g: 3750,
    sex: 'male',
    year: 2021,
    diet: 'fish',
    life_stage: 'adult',
    health_metrics: 'healthy',
  },
  {
    species: 'Adelie',
    island: 'Dream',
    bill_length_mm: 39.5,
    bill_depth_mm: 17.4,
    flipper_length_mm: 186,
    body_mass_g: 3800,
    sex: 'female',
    year: 2021,
    diet: 'krill',
    life_stage: 'juvenile',
    health_metrics: 'healthy',
  },
  {
    species: 'Chinstrap',
    island: 'Dream',
    bill_length_mm: 46.5,
    bill_depth_mm: 17.9,
    flipper_length_mm: 192,
    body_mass_g: 3500,
    sex: 'female',
    year: 2022,
    diet: 'krill',
    life_stage: 'adult',
    health_metrics: 'overweight',
  },
  {
    species: 'Gentoo',
    island: 'Biscoe',
    bill_length_mm: 46.1,
    bill_depth_mm: 13.2,
    flipper_length_mm: 211,
    body_mass_g: 4500,
    sex: 'female',
    year: 2023,
    diet: 'squid',
    life_stage: 'adult',
    health_metrics: 'underweight',
  },
  {
    species: 'Gentoo',
    island: 'Torgersen',
    bill_length_mm: 47.8,
    bill_depth_mm: 15.0,
    flipper_length_mm: 215,
    body_mass_g: 5000,
    sex: 'male',
    year: 2024,
    diet: 'fish',
    life_stage: 'adult',
    health_metrics: 'healthy',
  },
  {
    species: 'Adelie',
    island: 'Biscoe',
    bill_length_mm: 40.2,
    bill_depth_mm: 19.1,
    flipper_length_mm: 190,
    body_mass_g: 4000,
    sex: null, // Missing sex value
    year: 2025,
    diet: 'parental',
    life_stage: 'chick',
    health_metrics: 'healthy',
  },
];

const ALL_DIETS = ['fish', 'krill', 'squid', 'parental'];
const ALL_YEAR_RANGE: [number, number] = [2021, 2025];

describe('filterPenguinsBySpecies', () => {
  it('should return empty array when no species selected', () => {
    const result = filterPenguinsBySpecies(mockPenguins, []);
    expect(result).toEqual([]);
  });

  it('should return all penguins when all species selected', () => {
    const result = filterPenguinsBySpecies(mockPenguins, [
      'Adelie',
      'Chinstrap',
      'Gentoo',
    ]);
    expect(result).toEqual(mockPenguins);
  });

  it('should filter by single species', () => {
    const result = filterPenguinsBySpecies(mockPenguins, ['Adelie']);
    expect(result).toHaveLength(3);
    expect(result.every((p) => p.species === 'Adelie')).toBe(true);
  });

  it('should filter by multiple species', () => {
    const result = filterPenguinsBySpecies(mockPenguins, ['Adelie', 'Gentoo']);
    expect(result).toHaveLength(5);
    expect(result.every((p) => ['Adelie', 'Gentoo'].includes(p.species))).toBe(
      true
    );
  });
});

describe('filterPenguinsByIsland', () => {
  it('should return all penguins when "all" is selected', () => {
    const result = filterPenguinsByIsland(mockPenguins, 'all');
    expect(result).toEqual(mockPenguins);
  });

  it('should return all penguins when island is null or undefined', () => {
    const resultNull = filterPenguinsByIsland(mockPenguins, null as any);
    const resultUndefined = filterPenguinsByIsland(
      mockPenguins,
      undefined as any
    );
    expect(resultNull).toEqual(mockPenguins);
    expect(resultUndefined).toEqual(mockPenguins);
  });

  it('should filter by specific island', () => {
    const result = filterPenguinsByIsland(mockPenguins, 'Biscoe');
    expect(result).toHaveLength(3);
    expect(result.every((p) => p.island === 'Biscoe')).toBe(true);
  });

  it('should return empty array for non-existent island', () => {
    const result = filterPenguinsByIsland(mockPenguins, 'NonExistent' as any);
    expect(result).toEqual([]);
  });

  it('should filter correctly for each island', () => {
    const biscoeResult = filterPenguinsByIsland(mockPenguins, 'Biscoe');
    const dreamResult = filterPenguinsByIsland(mockPenguins, 'Dream');
    const torgersenResult = filterPenguinsByIsland(mockPenguins, 'Torgersen');

    expect(biscoeResult).toHaveLength(3);
    expect(dreamResult).toHaveLength(2);
    expect(torgersenResult).toHaveLength(1);

    expect(biscoeResult.every((p) => p.island === 'Biscoe')).toBe(true);
    expect(dreamResult.every((p) => p.island === 'Dream')).toBe(true);
    expect(torgersenResult.every((p) => p.island === 'Torgersen')).toBe(true);
  });
});

describe('filterPenguinsBySex', () => {
  it('should return all penguins when "all" is selected', () => {
    const result = filterPenguinsBySex(mockPenguins, 'all');
    expect(result).toEqual(mockPenguins);
  });

  it('should return all penguins when sex is null or undefined', () => {
    const resultNull = filterPenguinsBySex(mockPenguins, null as any);
    const resultUndefined = filterPenguinsBySex(mockPenguins, undefined as any);
    expect(resultNull).toEqual(mockPenguins);
    expect(resultUndefined).toEqual(mockPenguins);
  });

  it('should filter by male sex only', () => {
    const result = filterPenguinsBySex(mockPenguins, 'male');
    expect(result).toHaveLength(2);
    expect(result.every((p) => p.sex === 'male')).toBe(true);
  });

  it('should filter by female sex only', () => {
    const result = filterPenguinsBySex(mockPenguins, 'female');
    expect(result).toHaveLength(3);
    expect(result.every((p) => p.sex === 'female')).toBe(true);
  });

  it('should exclude penguins with missing sex values when filtering by specific sex', () => {
    const maleResult = filterPenguinsBySex(mockPenguins, 'male');
    const femaleResult = filterPenguinsBySex(mockPenguins, 'female');

    expect(maleResult.some((p) => p.sex === null)).toBe(false);
    expect(femaleResult.some((p) => p.sex === null)).toBe(false);
  });

  it('should include penguins with missing sex values when "all" is selected', () => {
    const result = filterPenguinsBySex(mockPenguins, 'all');
    expect(result.some((p) => p.sex === null)).toBe(true);
    expect(result).toHaveLength(6); // All 6 penguins including the one with null sex
  });
});

describe('filterPenguinsByDiet', () => {
  it('returns all penguins when all diet options selected', () => {
    const result = filterPenguinsByDiet(mockPenguins, ALL_DIETS);
    expect(result).toEqual(mockPenguins);
  });

  it('filters penguins by selected diet values', () => {
    const result = filterPenguinsByDiet(mockPenguins, ['fish', 'squid']);
    expect(
      result.every((p) => p.diet && ['fish', 'squid'].includes(p.diet))
    ).toBe(true);
    expect(result).toHaveLength(3);
  });

  it('excludes penguins without matching diets', () => {
    const result = filterPenguinsByDiet(mockPenguins, ['parental']);
    expect(result).toHaveLength(1);
    expect(result[0].diet).toBe('parental');
  });
});

describe('filterPenguinsByLifeStage', () => {
  it('returns all penguins when "all" selected', () => {
    const result = filterPenguinsByLifeStage(mockPenguins, 'all');
    expect(result).toEqual(mockPenguins);
  });

  it('filters penguins by life stage selection', () => {
    const result = filterPenguinsByLifeStage(mockPenguins, 'adult');
    expect(result).toHaveLength(3);
    expect(result.every((p) => p.life_stage === 'adult')).toBe(true);
  });
});

describe('filterPenguinsByYearRange', () => {
  it('returns all penguins when using default range', () => {
    const result = filterPenguinsByYearRange(mockPenguins, ALL_YEAR_RANGE);
    expect(result).toEqual(mockPenguins);
  });

  it('filters penguins within the provided range', () => {
    const result = filterPenguinsByYearRange(mockPenguins, [2021, 2022]);
    expect(result).toHaveLength(3);
    expect(result.every((p) => p.year >= 2021 && p.year <= 2022)).toBe(true);
  });

  it('excludes penguins outside of range', () => {
    const result = filterPenguinsByYearRange(mockPenguins, [2024, 2024]);
    expect(result).toHaveLength(1);
    expect(result[0].year).toBe(2024);
  });
});

describe('filterPenguins (combined filtering)', () => {
  it('should apply species, island, and sex filters', () => {
    const result = filterPenguins(
      mockPenguins,
      ['Adelie'],
      'Biscoe',
      'all',
      ALL_DIETS,
      'all',
      ALL_YEAR_RANGE
    );
    expect(result).toHaveLength(2); // Both Adelie penguins on Biscoe (including one with null sex)
    expect(result.every((p) => p.species === 'Adelie')).toBe(true);
    expect(result.every((p) => p.island === 'Biscoe')).toBe(true);
  });

  it("should return empty array when filters don't match any penguins", () => {
    const result = filterPenguins(
      mockPenguins,
      ['Chinstrap'],
      'Torgersen',
      'all',
      ALL_DIETS,
      'all',
      ALL_YEAR_RANGE
    );
    expect(result).toEqual([]);
  });

  it('should work with "all" island and sex selection', () => {
    const result = filterPenguins(
      mockPenguins,
      ['Gentoo'],
      'all',
      'all',
      ALL_DIETS,
      'all',
      ALL_YEAR_RANGE
    );
    expect(result).toHaveLength(2);
    expect(result.every((p) => p.species === 'Gentoo')).toBe(true);
  });

  it('should work with all species selected and specific island', () => {
    const result = filterPenguins(
      mockPenguins,
      ['Adelie', 'Chinstrap', 'Gentoo'],
      'Dream',
      'all',
      ALL_DIETS,
      'all',
      ALL_YEAR_RANGE
    );
    expect(result).toHaveLength(2);
    expect(result.every((p) => p.island === 'Dream')).toBe(true);
  });

  it('should handle edge case with no species selected', () => {
    const result = filterPenguins(
      mockPenguins,
      [],
      'Biscoe',
      'all',
      ALL_DIETS,
      'all',
      ALL_YEAR_RANGE
    );
    expect(result).toEqual([]);
  });

  it('should filter by sex while maintaining other filters', () => {
    const result = filterPenguins(
      mockPenguins,
      ['Adelie', 'Chinstrap', 'Gentoo'],
      'all',
      'female',
      ALL_DIETS,
      'all',
      ALL_YEAR_RANGE
    );
    expect(result).toHaveLength(3);
    expect(result.every((p) => p.sex === 'female')).toBe(true);
  });

  it('should exclude missing sex values when filtering by specific sex', () => {
    const result = filterPenguins(
      mockPenguins,
      ['Adelie'],
      'Biscoe',
      'male',
      ALL_DIETS,
      'all',
      ALL_YEAR_RANGE
    );
    expect(result).toHaveLength(1); // Only the male Adelie on Biscoe
    expect(result[0].sex).toBe('male');
  });

  it('should apply filters in correct order (species first, then island, then sex)', () => {
    // This test ensures that the filtering logic works correctly
    const speciesFirst = filterPenguinsBySpecies(mockPenguins, [
      'Adelie',
      'Gentoo',
    ]);
    const islandSecond = filterPenguinsByIsland(speciesFirst, 'Biscoe');
    const sexThird = filterPenguinsBySex(islandSecond, 'all');

    const combinedResult = filterPenguins(
      mockPenguins,
      ['Adelie', 'Gentoo'],
      'Biscoe',
      'all',
      ALL_DIETS,
      'all',
      ALL_YEAR_RANGE
    );

    expect(combinedResult).toEqual(sexThird);
    expect(combinedResult).toHaveLength(3); // Updated to include the penguin with null sex
  });

  it('should handle multiple species and specific island with sex filter', () => {
    const result = filterPenguins(
      mockPenguins,
      ['Adelie', 'Chinstrap'],
      'Dream',
      'female',
      ALL_DIETS,
      'all',
      ALL_YEAR_RANGE
    );
    expect(result).toHaveLength(2);
    expect(result.every((p) => p.island === 'Dream')).toBe(true);
    expect(
      result.every((p) => ['Adelie', 'Chinstrap'].includes(p.species))
    ).toBe(true);
    expect(result.every((p) => p.sex === 'female')).toBe(true);
  });

  it('should maintain data integrity after combined filtering', () => {
    const result = filterPenguins(
      mockPenguins,
      ['Gentoo'],
      'Biscoe',
      'female',
      ALL_DIETS,
      'all',
      ALL_YEAR_RANGE
    );
    expect(result).toHaveLength(1);

    const penguin = result[0];
    expect(penguin.species).toBe('Gentoo');
    expect(penguin.island).toBe('Biscoe');
    expect(penguin.bill_length_mm).toBe(46.1);
    expect(penguin.bill_depth_mm).toBe(13.2);
    expect(penguin.flipper_length_mm).toBe(211);
    expect(penguin.body_mass_g).toBe(4500);
    expect(penguin.sex).toBe('female');
    expect(penguin.year).toBe(2023);
  });

  it('should apply diet-specific filtering when subset selected', () => {
    const result = filterPenguins(
      mockPenguins,
      ['Adelie', 'Gentoo', 'Chinstrap'],
      'all',
      'all',
      ['fish', 'squid'],
      'all',
      ALL_YEAR_RANGE
    );
    expect(result.every((p) => p.diet && ['fish', 'squid'].includes(p.diet)))
      .toBe(true);
  });

  it('should apply life stage filtering', () => {
    const result = filterPenguins(
      mockPenguins,
      ['Adelie', 'Gentoo', 'Chinstrap'],
      'all',
      'all',
      ALL_DIETS,
      'juvenile',
      ALL_YEAR_RANGE
    );
    expect(result).toHaveLength(1);
    expect(result[0].life_stage).toBe('juvenile');
  });

  it('should apply year range filtering', () => {
    const result = filterPenguins(
      mockPenguins,
      ['Adelie', 'Gentoo', 'Chinstrap'],
      'all',
      'all',
      ALL_DIETS,
      'all',
      [2024, 2025]
    );
    expect(result.every((p) => p.year >= 2024 && p.year <= 2025)).toBe(true);
    expect(result).toHaveLength(2);
  });
});
