import React, { useRef, useEffect, useMemo } from 'react';
import * as d3 from 'd3';
import { Box, Typography } from '@mui/material';
import { Penguin } from '@/types/penguin';
import { NumericField } from '../types';

const fieldLabels: Record<NumericField, string> = {
  bill_length_mm: 'Bill Length (mm)',
  bill_depth_mm: 'Bill Depth (mm)',
  flipper_length_mm: 'Flipper Length (mm)',
  body_mass_g: 'Body Mass (g)',
} as const;

interface HistogramProps {
  data: Penguin[];
  field: NumericField;
  bins: number;
  visibleSpecies: string[];
  width?: number;
  height?: number;
}

const margin = { top: 20, right: 30, bottom: 40, left: 50 };

export const Histogram: React.FC<HistogramProps> = ({
  data,
  field,
  bins,
  visibleSpecies,
  width = 600,
  height = 400,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredData = useMemo(
    () =>
      data.filter(
        (p) =>
          visibleSpecies.includes(p.species) &&
          p[field] != null &&
          !isNaN(p[field] as number)
      ),
    [data, field, visibleSpecies]
  );

  const speciesColors: Record<string, string> = useMemo(
    () => ({
      Adelie: '#1976d2', // MUI primary
      Chinstrap: '#f44336', // MUI secondary
      Gentoo: '#4caf50', // MUI success/tertiary
    }),
    []
  );

  useEffect(() => {
    if (!svgRef.current || filteredData.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Scales
    const xValues = filteredData
      .map((d) => d[field] as number)
      .filter((v) => v != null && !isNaN(v));

    const x = d3
      .scaleLinear()
      .domain(
        xValues.length > 0
          ? [Math.min(...xValues), Math.max(...xValues)]
          : [0, 1]
      )
      .range([0, innerWidth])
      .nice();

    const histogram = d3
      .histogram<Penguin, number>()
      .value((d) => d[field] as number)
      .domain(x.domain())
      .thresholds(bins);

    const allBins = histogram(filteredData);
    const maxBinCount =
      allBins.length > 0 ? Math.max(...allBins.map((bin) => bin.length)) : 1;
    const y = d3.scaleLinear().domain([0, maxBinCount]).range([innerHeight, 0]);

    // Group data by species
    const speciesData = visibleSpecies.reduce(
      (acc, species) => {
        const speciesPenguins = filteredData.filter(
          (p) => p.species === species
        );
        acc[species] = histogram(speciesPenguins) as d3.Bin<Penguin, number>[];
        return acc;
      },
      {} as Record<string, d3.Bin<Penguin, number>[]>
    );

    // Max y for all species
    const allSpeciesBins = Object.values(speciesData).flat();
    const maxY =
      allSpeciesBins.length > 0
        ? Math.max(...allSpeciesBins.map((bin) => bin.length))
        : 1;
    y.domain([0, maxY]);

    svg.attr('width', width).attr('height', height);

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // X axis
    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x));

    // Y axis
    g.append('g')
      .call(d3.axisLeft(y))
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', -margin.left)
      .attr('x', -innerHeight / 2)
      .attr('dy', '0.32em')
      .text('Count');

    // X label
    g.append('text')
      .attr('x', innerWidth / 2)
      .attr('y', innerHeight + margin.bottom - 5)
      .attr('text-anchor', 'middle')
      .text(fieldLabels[field] || field);

    // Title
    svg
      .append('text')
      .attr('x', width / 2)
      .attr('y', margin.top / 2)
      .attr('text-anchor', 'middle')
      .text(`Histogram of ${fieldLabels[field]}`);

    // Render bars for each species (overlapping)
    Object.entries(speciesData).forEach(([species, binsData]) => {
      const color = speciesColors[species as keyof typeof speciesColors];

      g.selectAll(`bars-${species}`)
        .data(binsData)
        .enter()
        .append('rect')
        .attr('x', (d) => {
          if (d.x0 == null || d.x1 == null) return 0;
          return x(d.x0) - 0.5; // Overlap by half bar width
        })
        .attr('y', (d) => y(d.length))
        .attr('width', (d) => {
          if (d.x0 == null || d.x1 == null) return 1;
          return Math.max(x(d.x1) - x(d.x0) - 1, 1); // -1 for overlap
        })
        .attr('height', (d) => innerHeight - y(d.length))
        .attr('fill', color)
        .attr('fill-opacity', 0.7)
        .attr('stroke', color)
        .attr('stroke-width', 0.5)
        .attr('tabindex', 0)
        .attr('role', 'img')
        .attr(
          'aria-label',
          (d) =>
            `Histogram bar: ${species}, range ${(d.x0 ?? 0).toFixed(1)} to ${(d.x1 ?? 0).toFixed(1)}, ${d.length} penguins`
        )
        .on('mouseover', function () {
          d3.select(this).attr('fill-opacity', 1);
          // TODO: Add MUI Tooltip for histogram bins
        })
        .on('mouseout', function () {
          d3.select(this).attr('fill-opacity', 0.7);
        })
        .on('focus', function () {
          d3.select(this).attr('fill-opacity', 1);
        })
        .on('blur', function () {
          d3.select(this).attr('fill-opacity', 0.7);
        });
    });

    // Alt text for a11y
    svg.attr(
      'aria-label',
      `Histogram of ${fieldLabels[field]} by species with ${bins} bins`
    );
  }, [filteredData, field, bins, visibleSpecies, width, height]);

  if (filteredData.length === 0) {
    return (
      <Box sx={{ p: 2, textAlign: 'center' }} role="alert" aria-live="polite">
        <Typography variant="body1" color="text.secondary">
          No data available for selected filters and species.
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      ref={containerRef}
      sx={{ minWidth: 400, width: '100%', height: 'auto' }}
    >
      <svg ref={svgRef} />
    </Box>
  );
};
