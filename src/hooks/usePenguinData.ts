import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAppState } from '@/context/ContextProvider';
import { Penguin, RawPenguinData } from '@/types/penguin';
import { filterPenguinsBySpecies } from '@/utils/filtering';

// Transform raw data to match story specification
const transformPenguinData = (rawData: RawPenguinData[]): Penguin[] => {
  return rawData.map((item) => ({
    species: item.species as 'Adelie' | 'Chinstrap' | 'Gentoo',
    island: item.island as 'Biscoe' | 'Dream' | 'Torgersen',
    bill_length_mm: item.bill_length_mm === 0 ? null : item.bill_length_mm,
    bill_depth_mm: item.bill_depth_mm === 0 ? null : item.bill_depth_mm,
    flipper_length_mm: item.flipper_length_mm === 0 ? null : item.flipper_length_mm,
    body_mass_g: item.body_mass_g === 0 ? null : item.body_mass_g,
    sex: (item.sex === '' || !item.sex) ? null : (item.sex as 'male' | 'female'),
    year: item.year,
  }));
};

const fetchPenguinData = async (): Promise<Penguin[]> => {
  const response = await fetch('/data/penguins.json');
  if (!response.ok) {
    throw new Error('Failed to fetch penguin data');
  }
  const rawData: RawPenguinData[] = await response.json();
  return transformPenguinData(rawData);
};

export const usePenguinData = () => {
  const { state } = useAppState();
  const { selectedSpecies } = state;

  const { data: allPenguins = [], isLoading, error, isError } = useQuery({
    queryKey: ['penguins'],
    queryFn: fetchPenguinData,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (renamed from cacheTime in v5)
  });

  const filteredPenguins = React.useMemo(() => {
    return filterPenguinsBySpecies(allPenguins, selectedSpecies);
  }, [allPenguins, selectedSpecies]);

  return {
    data: filteredPenguins,
    isLoading,
    error,
    isError,
  };
};