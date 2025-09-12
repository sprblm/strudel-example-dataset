import { Penguin } from '@/types/penguin';

export const filterPenguinsBySpecies = (
  penguins: Penguin[],
  selectedSpecies: string[]
): Penguin[] => {
  if (selectedSpecies.length === 0) return [];
  if (selectedSpecies.length === 3) return penguins; // All selected, return all
  return penguins.filter((penguin) =>
    selectedSpecies.includes(penguin.species)
  );
};

export const filterPenguinsByIsland = (
  penguins: Penguin[],
  selectedIsland: string
): Penguin[] => {
  if (!selectedIsland || selectedIsland === 'all') return penguins;
  return penguins.filter((penguin) => penguin.island === selectedIsland);
};

export const filterPenguinsBySex = (
  penguins: Penguin[],
  selectedSex: string
): Penguin[] => {
  if (!selectedSex || selectedSex === 'all') return penguins;
  return penguins.filter((penguin) => {
    // Handle missing sex values - include them when "all" is selected
    if (selectedSex === 'all') return true;
    // For specific sex selection, match exactly (null/undefined values will be excluded)
    return penguin.sex === selectedSex;
  });
};

export const filterPenguins = (
  penguins: Penguin[],
  selectedSpecies: string[],
  selectedIsland: string,
  selectedSex: string
): Penguin[] => {
  let filtered = penguins;

  // Apply species filter
  filtered = filterPenguinsBySpecies(filtered, selectedSpecies);

  // Apply island filter
  filtered = filterPenguinsByIsland(filtered, selectedIsland);

  // Apply sex filter
  filtered = filterPenguinsBySex(filtered, selectedSex);

  return filtered;
};
