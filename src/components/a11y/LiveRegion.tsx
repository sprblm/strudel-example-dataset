import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { useAppState } from '@/context/ContextProvider';
import { usePenguinData } from '@/hooks/usePenguinData';

/**
 * Live region component for announcing dynamic updates to screen readers.
 * Centralizes all announcements to prevent screen reader conflicts.
 * Uses ARIA polite announcements with debouncing for better UX.
 */
export const LiveRegion: React.FC = () => {
  const { state } = useAppState();
  const { data: filteredPenguins, isLoading } = usePenguinData();
  const [announcement, setAnnouncement] = useState('');

  // Generate filter summary message
  const generateFilterSummary = React.useCallback(() => {
    const { selectedSpecies, selectedIsland, selectedSex } = state;
    const totalCount = filteredPenguins.length;

    // Build concise filter description
    const filterParts: string[] = [];

    // Species filter
    if (selectedSpecies.length === 3) {
      // All species selected - omit from summary
    } else if (selectedSpecies.length === 1) {
      filterParts.push(`${selectedSpecies[0]} penguins`);
    } else if (selectedSpecies.length === 2) {
      filterParts.push(`${selectedSpecies.join(' and ')} penguins`);
    } else {
      filterParts.push('no species selected');
    }

    // Island filter
    if (selectedIsland !== 'all') {
      filterParts.push(`from ${selectedIsland} island`);
    }

    // Sex filter
    if (selectedSex !== 'all') {
      filterParts.push(`${selectedSex} only`);
    }

    // Construct final message
    if (filterParts.length === 0) {
      return `Showing all ${totalCount} penguins`;
    } else {
      const filterDescription = filterParts.join(', ');
      return `Showing ${totalCount} ${filterDescription}`;
    }
  }, [state, filteredPenguins.length]);

  // Generate loading state message
  const generateLoadingMessage = React.useCallback((loading: boolean) => {
    if (loading) {
      return 'Loading penguin data...';
    } else {
      return 'Penguin data loaded successfully';
    }
  }, []);

  // Debounced announcement update
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (isLoading) {
        setAnnouncement(generateLoadingMessage(true));
      } else {
        // Only announce filter changes after loading is complete
        setAnnouncement(generateFilterSummary());
      }
    }, 300); // 300ms debounce to prevent rapid-fire announcements

    return () => clearTimeout(timeoutId);
  }, [isLoading, generateFilterSummary, generateLoadingMessage]);

  // Clear announcement after it's been read
  useEffect(() => {
    if (announcement) {
      const clearTimeoutId = setTimeout(() => {
        setAnnouncement('');
      }, 1000); // Clear after 1 second to allow screen reader to finish

      return () => clearTimeout(clearTimeoutId);
    }
  }, [announcement]);

  return (
    <Box
      aria-live="polite"
      aria-atomic="true"
      sx={{
        position: 'absolute',
        left: '-10000px',
        width: '1px',
        height: '1px',
        overflow: 'hidden',
      }}
      data-testid="live-region"
    >
      {announcement}
    </Box>
  );
};
