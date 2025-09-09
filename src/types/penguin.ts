export interface Penguin {
  species: 'Adelie' | 'Chinstrap' | 'Gentoo';
  island: 'Biscoe' | 'Dream' | 'Torgersen';
  bill_length_mm: number | null;
  bill_depth_mm: number | null;
  flipper_length_mm: number | null;
  body_mass_g: number | null;
  sex: 'male' | 'female' | null;
  year: number; // 2007, 2008, 2009
}

// Raw data interface from the actual JSON file
export interface RawPenguinData {
  species: string;
  island: string;
  bill_length_mm: number;
  bill_depth_mm: number;
  flipper_length_mm: number;
  body_mass_g: number;
  sex: string;
  diet: string;
  life_stage: string;
  health_metrics: string;
  year: number;
}