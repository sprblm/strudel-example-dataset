import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { vi } from 'vitest';
import { usePenguinData } from '../usePenguinData';

// Mock fetch
global.fetch = vi.fn();
const mockFetch = fetch as typeof vi.fn;

// Test wrapper for React Query
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
      {children}
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
    year: 2021,
  },
  {
    species: 'Chinstrap',
    island: 'Dream',
    bill_length_mm: 0, // This will be converted to null
    bill_depth_mm: 18.1,
    flipper_length_mm: 245.0,
    body_mass_g: 0, // This will be converted to null
    sex: '',
    diet: 'fish',
    life_stage: 'adult',
    health_metrics: 'normal',
    year: 2021,
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
    expect(result.current.data).toBeUndefined();

    // Wait for data to load
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toHaveLength(2);
    expect(result.current.data?.[0]).toEqual({
      species: 'Adelie',
      island: 'Biscoe',
      bill_length_mm: 53.4,
      bill_depth_mm: 17.8,
      flipper_length_mm: 219.0,
      body_mass_g: 5687.0,
      sex: 'female',
      year: 2021,
    });
    
    // Check transformation of falsy values to null
    expect(result.current.data?.[1]).toEqual({
      species: 'Chinstrap',
      island: 'Dream',
      bill_length_mm: null, // 0 should be converted to null
      bill_depth_mm: 18.1,
      flipper_length_mm: 245.0,
      body_mass_g: null, // 0 should be converted to null
      sex: null, // empty string should be converted to null
      year: 2021,
    });
  });

  it('handles fetch error correctly', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    const wrapper = createWrapper();
    const { result } = renderHook(() => usePenguinData(), { wrapper });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.data).toBeUndefined();
  });

  it('handles HTTP error response', async () => {
    mockFetch.mockResolvedValueOnce({
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
});