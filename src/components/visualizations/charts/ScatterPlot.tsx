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

const fieldLabels: Record<NumericField, string> = {
  bill_length_mm: 'Bill Length (mm)',
  bill_depth_mm: 'Bill Depth (mm)',
  flipper_length_mm: 'Flipper Length (mm)',
  body_mass_g: 'Body Mass (g)',
};

const ScatterPlotComponent: React.FC<ScatterPlotProps> = ({
  data,
  xField,
  yField,
  visibleSpecies = ['Adelie', 'Chinstrap', 'Gentoo'],
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

    // Filter out null/undefined values for safe domain calculation
    const xValues = data
      .map((d) => d[xField] as number)
      .filter((v) => v != null && !isNaN(v));
    const yValues = data
      .map((d) => d[yField] as number)
      .filter((v) => v != null && !isNaN(v));

    if (xValues.length === 0 || yValues.length === 0) {
      const g = svg
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);
      g.append('text')
        .attr('x', innerWidth / 2)
        .attr('y', innerHeight / 2)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('fill', '#999')
        .text('No valid data for selected fields');
      return () => {
        svg.selectAll('*').remove();
      };
    }

    const xScale = d3
      .scaleLinear()
      .domain([Math.min(...xValues), Math.max(...xValues)])
      .range([0, innerWidth]);

    const yScale = d3
      .scaleLinear()
      .domain([Math.min(...yValues), Math.max(...yValues)])
      .range([innerHeight, 0]);

    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    g.append('g').attr('transform', `translate(0,${innerHeight})`).call(xAxis);
    g.append('g').call(yAxis);

    const filteredData = data.filter((d) => visibleSpecies.includes(d.species));

    if (filteredData.length === 0) {
      g.append('text')
        .attr('x', innerWidth / 2)
        .attr('y', innerHeight / 2)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .text('No data visible');
      return () => {
        svg.selectAll('*').remove();
      };
    }

    g.selectAll('circle')
      .data(filteredData)
      .enter()
      .append('circle')
      .attr('cx', (d) => {
        const value = d[xField] as number;
        return xScale(value ?? 0);
      })
      .attr('cy', (d) => {
        const value = d[yField] as number;
        return yScale(value ?? 0);
      })
      .attr('r', 4)
      .attr('tabindex', 0)
      .attr('role', 'img')
      .attr(
        'aria-label',
        (d) =>
          `Penguin point: ${d.species}, ${fieldLabels[xField]}: ${(d[xField] as number).toFixed(1)}, ${fieldLabels[yField]}: ${(d[yField] as number).toFixed(1)}`
      )
      .attr(
        'fill',
        (d) => speciesColors[d.species as keyof typeof speciesColors] || '#999'
      )
      .attr('stroke', 'white')
      .attr('stroke-width', 1)
      .on('mouseover', function (event, d) {
        d3.select(this).attr('r', 6);
        if (!tooltipRef.current) return;
        const pageX = (event as MouseEvent).pageX;
        const pageY = (event as MouseEvent).pageY;
        d3.select(tooltipRef.current)
          .style('opacity', 1)
          .style('left', `${pageX + 10}px`)
          .style('top', `${pageY - 10}px`)
          .html(
            `<div><strong>${d.species}</strong></div>` +
              `<div>${fieldLabels[xField]}: ${d[xField] ?? 'N/A'}</div>` +
              `<div>${fieldLabels[yField]}: ${d[yField] ?? 'N/A'}</div>` +
              `<div>Island: ${d.island}</div>` +
              `<div>Sex: ${d.sex || 'Unknown'}</div>` +
              `<div>Year: ${d.year}</div>`
          );
      })
      .on('mouseout', function () {
        d3.select(this).attr('r', 4);
        d3.select(tooltipRef.current).style('opacity', 0);
      })
      .on('focus', function () {
        d3.select(this).attr('r', 6);
      })
      .on('blur', function () {
        d3.select(this).attr('r', 4);
      });

    // ARIA description elements
    const titleId = `scatter-title-${xField}-${yField}`;
    const descId = `scatter-desc-${xField}-${yField}`;

    svg
      .append('title')
      .attr('id', titleId)
      .text(`Scatter Plot: ${fieldLabels[xField]} vs ${fieldLabels[yField]}`);

    svg
      .append('desc')
      .attr('id', descId)
      .text(
        `Interactive scatter plot showing relationships between ${fieldLabels[xField]} and ${fieldLabels[yField]} ` +
          `for ${filteredData.length} penguin data points, colored by species. ` +
          `Hover over points for detailed measurements. Use Tab key to navigate.`
      );

    svg.attr('aria-labelledby', titleId).attr('aria-describedby', descId);

    return () => {
      svg.selectAll('*').remove();
    };
  }, [data, xField, yField, visibleSpecies, width, height, margin]);

  return (
    <Box
      sx={{
        position: 'relative',
        minWidth: 400,
        width: '100%',
        height: 'auto',
      }}
    >
      <svg
        ref={svgRef}
        width={width}
        height={height}
        role="img"
        style={{ maxWidth: '100%', height: 'auto' }}
      />
      <div
        ref={tooltipRef}
        style={{
          position: 'absolute',
          background: 'rgba(0, 0, 0, 0.9)',
          color: 'white',
          padding: '8px 12px',
          borderRadius: '4px',
          fontSize: '14px',
          pointerEvents: 'none',
          opacity: 0,
          transition: 'opacity 0.2s',
          zIndex: 1000,
          maxWidth: '250px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
          lineHeight: 1.4,
        }}
        role="tooltip"
        aria-live="polite"
      />
      <Box
        component="div"
        id={`scatter-desc-${xField}-${yField}`}
        sx={{
          position: 'absolute',
          left: -9999,
          width: 1,
          height: 1,
          overflow: 'hidden',
        }}
        aria-hidden="true"
      >
        Interactive scatter plot showing relationships between variables for
        penguin data, points colored by species. Use keyboard navigation to
        explore points. Hover or focus for details.
      </Box>
    </Box>
  );
};

export const ScatterPlot = React.memo(ScatterPlotComponent);
ScatterPlot.displayName = 'ScatterPlot';
