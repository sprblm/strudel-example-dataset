import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAppState } from '@/context/ContextProvider';
import { Penguin, RawPenguinData } from '@/types/penguin';
import { filterPenguins } from '@/utils/filtering';
import {
  normalizeDietValue,
  normalizeHealthMetricValue,
  normalizeIslandValue,
  normalizeLifeStageValue,
  normalizeSpeciesValue,
  normalizeYearValue,
} from '@/utils/dataHelpers';

// Transform raw data to match story specification
export const transformPenguinData = (rawData: RawPenguinData[]): Penguin[] => {
  const toNullableMeasurement = (
    value: number | null | undefined
  ): number | null => {
    if (value === null || value === undefined) {
      return null;
    }
    if (value === 0) {
      return null;
    }
    if (Number.isNaN(value)) {
      return null;
    }
    return value;
  };

  const toNormalizedSex = (
    value: string | null | undefined
  ): 'male' | 'female' | null => {
    if (!value) {
      return null;
    }
    const normalized = value.trim().toLowerCase();
    if (normalized === 'male' || normalized === 'm') {
      return 'male';
    }
    if (normalized === 'female' || normalized === 'f') {
      return 'female';
    }
    return null;
  };

  return rawData
    .map((item) => {
      const species = normalizeSpeciesValue(item.species);
      const island = normalizeIslandValue(item.island);
      if (!species || !island) {
        return null;
      }

      return {
        species,
        island,
        bill_length_mm: toNullableMeasurement(item.bill_length_mm),
        bill_depth_mm: toNullableMeasurement(item.bill_depth_mm),
        flipper_length_mm: toNullableMeasurement(item.flipper_length_mm),
        body_mass_g: toNullableMeasurement(item.body_mass_g),
        sex: toNormalizedSex(item.sex),
        year: normalizeYearValue(item.year),
        diet: normalizeDietValue(item.diet),
        life_stage: normalizeLifeStageValue(item.life_stage),
        health_metrics: normalizeHealthMetricValue(item.health_metrics),
      } satisfies Penguin;
    })
    .filter((item): item is Penguin => item !== null);
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
  const { selectedSpecies, selectedIsland, selectedSex } = state;

  const {
    data: allPenguins = [],
    isLoading,
    error,
    isError,
  } = useQuery({
    queryKey: ['penguins'],
    queryFn: fetchPenguinData,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (renamed from cacheTime in v5)
  });

  const filteredPenguins = React.useMemo(() => {
    return filterPenguins(
      allPenguins,
      selectedSpecies,
      selectedIsland,
      selectedSex
    );
  }, [allPenguins, selectedSpecies, selectedIsland, selectedSex]);

  return {
    data: filteredPenguins,
    isLoading,
    error,
    isError,
  };
};
