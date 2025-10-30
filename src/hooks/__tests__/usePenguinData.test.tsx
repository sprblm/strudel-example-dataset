import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { vi } from 'vitest';
import { usePenguinData } from '../usePenguinData';
import { AppProvider } from '../../context/ContextProvider';

// Mock fetch
global.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    json: async () => mockRawData,
  })
) as any;
const mockFetch = global.fetch as any;

// Test wrapper for React Query and App Context
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <AppProvider>{children}</AppProvider>
    </QueryClientProvider>
  );
};

const mockRawData = [
  {
    species: 'Adelie',
    island: 'Biscoe',
    bill_length_mm: 53.4,
    bill_depth_mm: 17.8,
    flipper_length_mm: 219.0,
    body_mass_g: 5687.0,
    sex: 'female',
    diet: 'fish',
    life_stage: 'adult',
    health_metrics: 'overweight',
    year: 2024,
  },
  {
    species: 'Chinstrap',
    island: 'Torgensen',
    bill_length_mm: 0, // This will be converted to null
    bill_depth_mm: 18.1,
    flipper_length_mm: 245.0,
    body_mass_g: 0, // This will be converted to null
    sex: '',
    diet: '',
    life_stage: 'juvenile',
    health_metrics: 'healthy',
    year: 2025,
  },
];

describe('usePenguinData', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches and transforms penguin data successfully', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockRawData,
    } as Response);

    const wrapper = createWrapper();
    const { result } = renderHook(() => usePenguinData(), { wrapper });

    // Initially loading
    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toEqual([]);

    // Wait for data to load
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toHaveLength(2);
    expect(result.current.data[0]).toEqual({
      species: 'Adelie',
      island: 'Biscoe',
      bill_length_mm: 53.4,
      bill_depth_mm: 17.8,
      flipper_length_mm: 219.0,
      body_mass_g: 5687,
      sex: 'female',
      year: 2024,
      diet: 'fish',
      life_stage: 'adult',
      health_metrics: 'overweight',
    });

    // Check transformation of falsy values to null
    expect(result.current.data[1]).toEqual({
      species: 'Chinstrap',
      island: 'Torgersen',
      bill_length_mm: null, // 0 should be converted to null
      bill_depth_mm: 18.1,
      flipper_length_mm: 245.0,
      body_mass_g: null, // 0 should be converted to null
      sex: null, // empty string should be converted to null
      year: 2025,
      diet: null,
      life_stage: 'juvenile',
      health_metrics: 'healthy',
    });
  });

  it('handles fetch error correctly', async () => {
    vi.mocked(global.fetch).mockRejectedValueOnce(new Error('Network error'));

    const wrapper = createWrapper();
    const { result } = renderHook(() => usePenguinData(), { wrapper });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.data).toEqual([]);
  });

  it('handles HTTP error response', async () => {
    vi.mocked(global.fetch).mockResolvedValueOnce({
      ok: false,
      status: 404,
    } as Response);

    const wrapper = createWrapper();
    const { result } = renderHook(() => usePenguinData(), { wrapper });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error?.message).toBe('Failed to fetch penguin data');
  });

  it('applies extended filters for diet, life stage, and year range', async () => {
    const dataset = [
      {
        species: 'Adelie',
        island: 'Biscoe',
        bill_length_mm: 40,
        bill_depth_mm: 18,
        flipper_length_mm: 200,
        body_mass_g: 4000,
        sex: 'female',
        diet: 'fish',
        life_stage: 'adult',
        health_metrics: 'healthy',
        year: 2024,
      },
      {
        species: 'Gentoo',
        island: 'Dream',
        bill_length_mm: 45,
        bill_depth_mm: 15,
        flipper_length_mm: 210,
        body_mass_g: 4500,
        sex: 'male',
        diet: 'krill',
        life_stage: 'juvenile',
        health_metrics: 'healthy',
        year: 2025,
      },
    ];

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => dataset,
    } as Response);

    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>
        <AppProvider
          selectedDiet={['fish']}
          selectedLifeStage="adult"
          selectedYearRange={[2024, 2024]}
        >
          {children}
        </AppProvider>
      </QueryClientProvider>
    );

    const { result } = renderHook(() => usePenguinData(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toHaveLength(1);
    expect(result.current.data[0]).toMatchObject({
      diet: 'fish',
      life_stage: 'adult',
      year: 2024,
    });
  });
});
