export const PENGUIN_SPECIES = ['Adelie', 'Chinstrap', 'Gentoo'] as const;
export type PenguinSpecies = (typeof PENGUIN_SPECIES)[number];

export const PENGUIN_ISLANDS = ['Biscoe', 'Dream', 'Torgersen'] as const;
export type PenguinIsland = (typeof PENGUIN_ISLANDS)[number];

export const PENGUIN_DIETS = ['fish', 'krill', 'squid', 'parental'] as const;
export type PenguinDiet = (typeof PENGUIN_DIETS)[number];

export const PENGUIN_LIFE_STAGES = ['adult', 'juvenile', 'chick'] as const;
export type PenguinLifeStage = (typeof PENGUIN_LIFE_STAGES)[number];

export const PENGUIN_HEALTH_METRICS = [
  'healthy',
  'overweight',
  'underweight',
] as const;
export type PenguinHealthMetric = (typeof PENGUIN_HEALTH_METRICS)[number];

export const PENGUIN_YEARS = [2021, 2022, 2023, 2024, 2025] as const;
export type PenguinYear = number;

export interface Penguin {
  species: PenguinSpecies;
  island: PenguinIsland;
  bill_length_mm: number | null;
  bill_depth_mm: number | null;
  flipper_length_mm: number | null;
  body_mass_g: number | null;
  sex: 'male' | 'female' | null;
  year: PenguinYear;
  diet: PenguinDiet | null;
  life_stage: PenguinLifeStage | null;
  health_metrics: PenguinHealthMetric | null;
}

/**
 * Raw data interface from the JSON asset prior to transformation.
 * Numeric fields may be null when data is missing; strings may be empty.
 */
export interface RawPenguinData {
  species: string;
  island: string;
  bill_length_mm: number | null;
  bill_depth_mm: number | null;
  flipper_length_mm: number | null;
  body_mass_g: number | null;
  sex: string | null;
  diet: string | null;
  life_stage: string | null;
  health_metrics: string | null;
  year: number;
}
