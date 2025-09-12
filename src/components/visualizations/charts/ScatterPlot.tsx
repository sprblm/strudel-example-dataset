import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Box } from '@mui/material';
import { Penguin } from '@/types/penguin';

type NumericField =
  | 'bill_length_mm'
  | 'bill_depth_mm'
  | 'flipper_length_mm'
  | 'body_mass_g';

interface ScatterPlotProps {
  data: Penguin[];
  xField: NumericField;
  yField: NumericField;
  visibleSpecies?: string[];
  width?: number;
  height?: number;
  margin?: { top: number; right: number; bottom: number; left: number };
}

const speciesColors = {
  Adelie: '#1f77b4',
  Chinstrap: '#ff7f0e',
  Gentoo: '#2ca02c',
};

export const ScatterPlot: React.FC<ScatterPlotProps> = ({
  data,
  xField,
  yField,
  visibleSpecies,
  width = 600,
  height = 400,
  margin = { top: 20, right: 30, bottom: 40, left: 50 },
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!svgRef.current || data.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const xScale = d3
      .scaleLinear()
      .domain(d3.extent(data, (d) => d[xField]) as [number, number])
      .range([0, innerWidth]);

    const yScale = d3
      .scaleLinear()
      .domain(d3.extent(data, (d) => d[yField]) as [number, number])
      .range([innerHeight, 0]);

    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    g.append('g').attr('transform', `translate(0,${innerHeight})`).call(xAxis);

    g.append('g').call(yAxis);

    const filteredData = visibleSpecies ? data.filter(d => visibleSpecies.includes(d.species)) : data;

    if (filteredData.length === 0) {
      g.append('text')
        .attr('x', innerWidth / 2)
        .attr('y', innerHeight / 2)
        .attr('text-anchor', 'middle')
        .text('No data visible');
      return () => {
        svg.selectAll('*').remove();
      };
    }

    g
      .selectAll('circle')
      .data(filteredData)
      .enter()
      .append('circle')
      .attr('cx', (d) => xScale(d[xField]))
      .attr('cy', (d) => yScale(d[yField]))
      .attr('r', 5)
      .attr('fill', (d) => speciesColors[d.species])
      .on('mouseover', function (event, d) {
        d3.select(tooltipRef.current)
          .style('opacity', 1)
          .style('left', event.pageX + 10 + 'px')
          .style('top', event.pageY - 10 + 'px')
          .html(`Species: ${d.species}<br>X: ${d[xField]}<br>Y: ${d[yField]}`);
      })
      .on('mouseout', () => {
        d3.select(tooltipRef.current).style('opacity', 0);
      });

    // ARIA description
    svg.attr(
      'aria-label',
      `Scatter plot of ${xField} vs ${yField} colored by species`
    );

    return () => {
      svg.selectAll('*').remove();
    };
  }, [data, xField, yField, width, height, margin]);

  return (
    <Box sx={{ position: 'relative' }}>
      <svg
        ref={svgRef}
        width={width}
        height={height}
        role="img"
        aria-labelledby="scatter-title scatter-desc"
      >
        <title id="scatter-title">
          Scatter Plot: {xField} vs {yField}
        </title>
        <desc id="scatter-desc">
          Interactive scatter plot showing relationships between {xField} and{' '}
          {yField} for penguin data, points colored by species.
        </desc>
      </svg>
      <div
        ref={tooltipRef}
        style={{
          position: 'absolute',
          background: 'rgba(0,0,0,0.8)',
          color: 'white',
          padding: '5px',
          borderRadius: '4px',
          fontSize: '12px',
          pointerEvents: 'none',
          opacity: 0,
          transition: 'opacity 0.2s',
          zIndex: 1000,
        }}
      />
    </Box>
  );
};
