import { Penguin } from '@/types/penguin';

export const filterPenguinsBySpecies = (penguins: Penguin[], selectedSpecies: string[]): Penguin[] => {
  if (selectedSpecies.length === 0) return [];
  if (selectedSpecies.length === 3) return penguins; // All selected, return all
  return penguins.filter(penguin => selectedSpecies.includes(penguin.species));
};