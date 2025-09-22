import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Penguin } from '@/types/penguin';
import { NumericField } from '../types';

interface BoxPlotProps {
  data: Penguin[];
  field: NumericField;
  visibleSpecies: string[];
}

export const BoxPlot: React.FC<BoxPlotProps> = ({
  data,
  field,
  visibleSpecies,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 600, height: 400 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const width = Math.max(260, Math.min(840, entry.contentRect.width));
      const height = Math.max(260, Math.min(560, (width * 2) / 3));
      setDimensions({ width, height });
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  // Define colors for each species
  const speciesColors: { [key: string]: string } = {
    Adelie: '#FF8C00', // Dark Orange
    Chinstrap: '#9932CC', // Dark Orchid
    Gentoo: '#00CED1', // Dark Turquoise
  };

  useEffect(() => {
    if (!svgRef.current || data.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const margin = { top: 20, right: 30, bottom: 50, left: 60 };
    const width = dimensions.width - margin.left - margin.right;
    const height = dimensions.height - margin.top - margin.bottom;

    const g = svg
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Filter data by visible species
    const filteredData = data.filter((p) => visibleSpecies.includes(p.species));

    // Prepare data for box plot (group by species)
    const groupedData = d3.group(filteredData, (d) => d.species);

    // Calculate statistics for each species
    const boxPlotData = Array.from(groupedData, ([species, penguins]) => {
      const values = penguins
        .map((p) => p[field])
        .filter((value): value is number => value != null)
        .sort(d3.ascending);
      return {
        species,
        count: values.length,
        min: d3.min(values)!,
        max: d3.max(values)!,
        median: d3.median(values)!,
        q1: d3.quantile(values, 0.25)!,
        q3: d3.quantile(values, 0.75)!,
      };
    }).filter((d) => d.count > 0); // Only include species with data

    if (boxPlotData.length === 0) return;

    // Set up scales
    const xScale = d3
      .scaleBand()
      .domain(boxPlotData.map((d) => d.species))
      .range([0, width])
      .padding(0.2);

    const yScale = d3
      .scaleLinear()
      .domain([
        d3.min(boxPlotData, (d) => d.min)! * 0.9,
        d3.max(boxPlotData, (d) => d.max)! * 1.1,
      ])
      .nice()
      .range([height, 0]);

    // Add axes
    g.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale));

    g.append('g').call(d3.axisLeft(yScale));

    // Add axis labels
    g.append('text')
      .attr(
        'transform',
        `translate(${width / 2},${height + margin.bottom - 10})`
      )
      .style('text-anchor', 'middle')
      .text('Species');

    const fieldName = field
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (letter: string) => letter.toUpperCase());
    g.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 0 - margin.left)
      .attr('x', 0 - height / 2)
      .attr('dy', '1em')
      .style('text-anchor', 'middle')
      .text(fieldName);

    // Draw box plots
    const boxGroups = g
      .selectAll('.box')
      .data(boxPlotData)
      .enter()
      .append('g')
      .attr('class', 'box')
      .attr('transform', (d) => `translate(${xScale(d.species)},0)`);

    // Draw boxes
    boxGroups
      .append('rect')
      .attr('x', -20)
      .attr('y', (d) => yScale(d.q3))
      .attr('width', 40)
      .attr('height', (d) => yScale(d.q1) - yScale(d.q3))
      .attr('fill', (d) => speciesColors[d.species])
      .attr('opacity', 0.5);

    // Draw median lines
    boxGroups
      .append('line')
      .attr('x1', -20)
      .attr('x2', 20)
      .attr('y1', (d) => yScale(d.median))
      .attr('y2', (d) => yScale(d.median))
      .attr('stroke', 'black')
      .attr('stroke-width', 2);

    // Draw whiskers
    boxGroups
      .append('line')
      .attr('x1', 0)
      .attr('x2', 0)
      .attr('y1', (d) => yScale(d.min))
      .attr('y2', (d) => yScale(d.q1))
      .attr('stroke', 'black');

    boxGroups
      .append('line')
      .attr('x1', 0)
      .attr('x2', 0)
      .attr('y1', (d) => yScale(d.q3))
      .attr('y2', (d) => yScale(d.max))
      .attr('stroke', 'black');

    // Draw caps
    boxGroups
      .append('line')
      .attr('x1', -10)
      .attr('x2', 10)
      .attr('y1', (d) => yScale(d.min))
      .attr('y2', (d) => yScale(d.min))
      .attr('stroke', 'black');

    boxGroups
      .append('line')
      .attr('x1', -10)
      .attr('x2', 10)
      .attr('y1', (d) => yScale(d.max))
      .attr('y2', (d) => yScale(d.max))
      .attr('stroke', 'black');
  }, [data, field, visibleSpecies, dimensions]);

  return (
    <div ref={containerRef} style={{ width: '100%' }}>
      <svg
        ref={svgRef}
        role="img"
        aria-label={`Box plot showing distribution of ${field} by species`}
      />
    </div>
  );
};
