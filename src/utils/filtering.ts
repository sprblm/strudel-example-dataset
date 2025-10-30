import {
  Penguin,
  PENGUIN_DIETS,
  PENGUIN_LIFE_STAGES,
  PENGUIN_YEARS,
} from '@/types/penguin';

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

export const filterPenguinsByDiet = (
  penguins: Penguin[],
  selectedDiet: string[]
): Penguin[] => {
  if (!selectedDiet || selectedDiet.length === 0) {
    return penguins;
  }
  const hasAllSelected = PENGUIN_DIETS.every((diet) =>
    selectedDiet.includes(diet)
  );
  if (hasAllSelected) {
    return penguins;
  }
  const allowed = new Set(selectedDiet);
  return penguins.filter(
    (penguin) => penguin.diet && allowed.has(penguin.diet)
  );
};

export const filterPenguinsByLifeStage = (
  penguins: Penguin[],
  selectedLifeStage: string
): Penguin[] => {
  if (
    !selectedLifeStage ||
    selectedLifeStage === 'all' ||
    !PENGUIN_LIFE_STAGES.includes(selectedLifeStage as any)
  ) {
    return penguins;
  }
  return penguins.filter((penguin) => penguin.life_stage === selectedLifeStage);
};

export const filterPenguinsByYearRange = (
  penguins: Penguin[],
  selectedYearRange: readonly [number, number]
): Penguin[] => {
  if (
    !selectedYearRange ||
    selectedYearRange.length !== 2 ||
    (selectedYearRange[0] === PENGUIN_YEARS[0] &&
      selectedYearRange[1] === PENGUIN_YEARS[PENGUIN_YEARS.length - 1])
  ) {
    return penguins;
  }

  const [minYear, maxYear] = selectedYearRange;
  return penguins.filter((penguin) => {
    if (!Number.isFinite(penguin.year)) {
      return false;
    }
    return penguin.year >= minYear && penguin.year <= maxYear;
  });
};

export const filterPenguins = (
  penguins: Penguin[],
  selectedSpecies: string[],
  selectedIsland: string,
  selectedSex: string,
  selectedDiet: string[],
  selectedLifeStage: string,
  selectedYearRange: readonly [number, number]
): Penguin[] => {
  let filtered = penguins;

  // Apply species filter
  filtered = filterPenguinsBySpecies(filtered, selectedSpecies);

  // Apply island filter
  filtered = filterPenguinsByIsland(filtered, selectedIsland);

  // Apply sex filter
  filtered = filterPenguinsBySex(filtered, selectedSex);

  filtered = filterPenguinsByDiet(filtered, selectedDiet);
  filtered = filterPenguinsByLifeStage(filtered, selectedLifeStage);
  filtered = filterPenguinsByYearRange(filtered, selectedYearRange);

  return filtered;
};
