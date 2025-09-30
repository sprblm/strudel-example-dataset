import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Penguin } from '@/types/penguin';
import { NumericField, coerceNumericValue, getFieldLabel } from '../types';

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
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const g = svg
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Filter data by visible species
    const filteredData = data.filter((penguin) =>
      visibleSpecies.includes(penguin.species)
    );

    const groupedData = d3.group(filteredData, (penguin) => penguin.species);

    const boxPlotData = Array.from(groupedData, ([species, penguins]) => {
      const values = penguins
        .map((penguin) => coerceNumericValue(penguin[field]))
        .filter((value): value is number => value !== null)
        .sort(d3.ascending);

      if (values.length === 0) {
        return null;
      }

      const min = d3.min(values);
      const max = d3.max(values);
      const median = d3.median(values);
      const q1 = d3.quantile(values, 0.25);
      const q3 = d3.quantile(values, 0.75);

      if (
        min == null ||
        max == null ||
        median == null ||
        q1 == null ||
        q3 == null
      ) {
        return null;
      }

      return {
        species,
        count: values.length,
        min,
        max,
        median,
        q1,
        q3,
      };
    })
      .filter((entry): entry is NonNullable<typeof entry> => entry !== null)
      .filter((entry) => entry.count > 0);

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

    const fieldName = getFieldLabel(field);
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
  }, [data, field, visibleSpecies]);

  return (
    <svg
      ref={svgRef}
      role="img"
      aria-label={`Box plot showing distribution of ${field} by species`}
    />
  );
};
