import { Penguin } from '@/types/penguin';

export const filterPenguinsBySpecies = (penguins: Penguin[], selectedSpecies: string[]): Penguin[] => {
  if (selectedSpecies.length === 0) return [];
  if (selectedSpecies.length === 3) return penguins; // All selected, return all
  return penguins.filter(penguin => selectedSpecies.includes(penguin.species));
};

export const filterPenguinsByIsland = (penguins: Penguin[], selectedIsland: string): Penguin[] => {
  if (!selectedIsland || selectedIsland === 'all') return penguins;
  return penguins.filter(penguin => penguin.island === selectedIsland);
};

export const filterPenguins = (
  penguins: Penguin[], 
  selectedSpecies: string[], 
  selectedIsland: string
): Penguin[] => {
  let filtered = penguins;
  
  // Apply species filter
  filtered = filterPenguinsBySpecies(filtered, selectedSpecies);
  
  // Apply island filter
  filtered = filterPenguinsByIsland(filtered, selectedIsland);
  
  return filtered;
};