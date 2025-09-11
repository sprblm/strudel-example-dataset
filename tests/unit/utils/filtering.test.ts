import { describe, it, expect } from 'vitest';
import { 
  filterPenguinsBySpecies, 
  filterPenguinsByIsland, 
  filterPenguins 
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
    year: 2007,
  },
  {
    species: 'Adelie',
    island: 'Dream',
    bill_length_mm: 39.5,
    bill_depth_mm: 17.4,
    flipper_length_mm: 186,
    body_mass_g: 3800,
    sex: 'female',
    year: 2007,
  },
  {
    species: 'Chinstrap',
    island: 'Dream',
    bill_length_mm: 46.5,
    bill_depth_mm: 17.9,
    flipper_length_mm: 192,
    body_mass_g: 3500,
    sex: 'female',
    year: 2007,
  },
  {
    species: 'Gentoo',
    island: 'Biscoe',
    bill_length_mm: 46.1,
    bill_depth_mm: 13.2,
    flipper_length_mm: 211,
    body_mass_g: 4500,
    sex: 'female',
    year: 2007,
  },
  {
    species: 'Gentoo',
    island: 'Torgersen',
    bill_length_mm: 47.8,
    bill_depth_mm: 15.0,
    flipper_length_mm: 215,
    body_mass_g: 5000,
    sex: 'male',
    year: 2008,
  },
];

describe('filterPenguinsBySpecies', () => {
  it('should return empty array when no species selected', () => {
    const result = filterPenguinsBySpecies(mockPenguins, []);
    expect(result).toEqual([]);
  });

  it('should return all penguins when all species selected', () => {
    const result = filterPenguinsBySpecies(mockPenguins, ['Adelie', 'Chinstrap', 'Gentoo']);
    expect(result).toEqual(mockPenguins);
  });

  it('should filter by single species', () => {
    const result = filterPenguinsBySpecies(mockPenguins, ['Adelie']);
    expect(result).toHaveLength(2);
    expect(result.every(p => p.species === 'Adelie')).toBe(true);
  });

  it('should filter by multiple species', () => {
    const result = filterPenguinsBySpecies(mockPenguins, ['Adelie', 'Gentoo']);
    expect(result).toHaveLength(4);
    expect(result.every(p => ['Adelie', 'Gentoo'].includes(p.species))).toBe(true);
  });
});

describe('filterPenguinsByIsland', () => {
  it('should return all penguins when "all" is selected', () => {
    const result = filterPenguinsByIsland(mockPenguins, 'all');
    expect(result).toEqual(mockPenguins);
  });

  it('should return all penguins when island is null or undefined', () => {
    const resultNull = filterPenguinsByIsland(mockPenguins, null as any);
    const resultUndefined = filterPenguinsByIsland(mockPenguins, undefined as any);
    expect(resultNull).toEqual(mockPenguins);
    expect(resultUndefined).toEqual(mockPenguins);
  });

  it('should filter by specific island', () => {
    const result = filterPenguinsByIsland(mockPenguins, 'Biscoe');
    expect(result).toHaveLength(2);
    expect(result.every(p => p.island === 'Biscoe')).toBe(true);
  });

  it('should return empty array for non-existent island', () => {
    const result = filterPenguinsByIsland(mockPenguins, 'NonExistent' as any);
    expect(result).toEqual([]);
  });

  it('should filter correctly for each island', () => {
    const biscoeResult = filterPenguinsByIsland(mockPenguins, 'Biscoe');
    const dreamResult = filterPenguinsByIsland(mockPenguins, 'Dream');
    const torgersenResult = filterPenguinsByIsland(mockPenguins, 'Torgersen');

    expect(biscoeResult).toHaveLength(2);
    expect(dreamResult).toHaveLength(2);
    expect(torgersenResult).toHaveLength(1);

    expect(biscoeResult.every(p => p.island === 'Biscoe')).toBe(true);
    expect(dreamResult.every(p => p.island === 'Dream')).toBe(true);
    expect(torgersenResult.every(p => p.island === 'Torgersen')).toBe(true);
  });
});

describe('filterPenguins (combined filtering)', () => {
  it('should apply both species and island filters', () => {
    const result = filterPenguins(mockPenguins, ['Adelie'], 'Biscoe');
    expect(result).toHaveLength(1);
    expect(result[0].species).toBe('Adelie');
    expect(result[0].island).toBe('Biscoe');
  });

  it('should return empty array when filters don\'t match any penguins', () => {
    const result = filterPenguins(mockPenguins, ['Chinstrap'], 'Torgersen');
    expect(result).toEqual([]);
  });

  it('should work with "all" island selection', () => {
    const result = filterPenguins(mockPenguins, ['Gentoo'], 'all');
    expect(result).toHaveLength(2);
    expect(result.every(p => p.species === 'Gentoo')).toBe(true);
  });

  it('should work with all species selected', () => {
    const result = filterPenguins(mockPenguins, ['Adelie', 'Chinstrap', 'Gentoo'], 'Dream');
    expect(result).toHaveLength(2);
    expect(result.every(p => p.island === 'Dream')).toBe(true);
  });

  it('should handle edge case with no species selected', () => {
    const result = filterPenguins(mockPenguins, [], 'Biscoe');
    expect(result).toEqual([]);
  });

  it('should apply filters in correct order (species first, then island)', () => {
    // This test ensures that the filtering logic works correctly
    // First filter by species, then by island
    const speciesFirst = filterPenguinsBySpecies(mockPenguins, ['Adelie', 'Gentoo']);
    const islandSecond = filterPenguinsByIsland(speciesFirst, 'Biscoe');
    
    const combinedResult = filterPenguins(mockPenguins, ['Adelie', 'Gentoo'], 'Biscoe');
    
    expect(combinedResult).toEqual(islandSecond);
    expect(combinedResult).toHaveLength(2);
  });

  it('should handle multiple species and specific island', () => {
    const result = filterPenguins(mockPenguins, ['Adelie', 'Chinstrap'], 'Dream');
    expect(result).toHaveLength(2);
    expect(result.every(p => p.island === 'Dream')).toBe(true);
    expect(result.every(p => ['Adelie', 'Chinstrap'].includes(p.species))).toBe(true);
  });

  it('should maintain data integrity after filtering', () => {
    const result = filterPenguins(mockPenguins, ['Gentoo'], 'Biscoe');
    expect(result).toHaveLength(1);
    
    const penguin = result[0];
    expect(penguin.species).toBe('Gentoo');
    expect(penguin.island).toBe('Biscoe');
    expect(penguin.bill_length_mm).toBe(46.1);
    expect(penguin.bill_depth_mm).toBe(13.2);
    expect(penguin.flipper_length_mm).toBe(211);
    expect(penguin.body_mass_g).toBe(4500);
    expect(penguin.sex).toBe('female');
    expect(penguin.year).toBe(2007);
  });
});