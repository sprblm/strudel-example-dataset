import React, { FC, useRef, useEffect, useState, useMemo } from 'react';
import * as d3 from 'd3';
import { Penguin } from '@/types/penguin';
import { useTheme } from '@mui/material/styles';

const formatFieldName = (field: string): string => {
  return field.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
};

interface ScatterPlotProps {
  data: Penguin[];
  xField: string;
  yField: string;
  visibleSpecies: Set<string>;
}

export const ScatterPlot: FC<ScatterPlotProps> = ({
  data,
  xField,
  yField,
  visibleSpecies,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    datum: Penguin;
  } | null>(null);
  const theme = useTheme();

  const colorScale = useMemo(
    () =>
      d3
        .scaleOrdinal<string>()
        .domain(['Adelie', 'Chinstrap', 'Gentoo'])
        .range([
          theme.palette.primary.main,
          theme.palette.secondary.main,
          theme.palette.info.main,
        ])
        .unknown('#999'),
    [theme]
  );

  const filteredData = useMemo(() => {
    let fd = data.filter(
      (d) => (d as any)[xField] != null && (d as any)[yField] != null
    );
    if (visibleSpecies.size > 0) {
      fd = fd.filter((d) => visibleSpecies.has(d.species));
    }
    return fd;
  }, [data, xField, yField, visibleSpecies]);

  const [dimensions, setDimensions] = useState({ width: 600, height: 400 });
  useEffect(() => {
    const updateSize = () => {
      const container = svgRef.current?.parentElement;
      if (container) {
        const w = Math.max(300, Math.min(800, container.clientWidth));
        const h = Math.max(300, Math.min(600, (w * 2) / 3));
        setDimensions({ width: w, height: h });
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  useEffect(() => {
    if (!svgRef.current || filteredData.length === 0) return;

    const svg = d3.select(svgRef.current);
    const margin = { top: 20, right: 20, bottom: 40, left: 50 };
    const w = dimensions.width - margin.left - margin.right;
    const h = dimensions.height - margin.top - margin.bottom;

    svg.selectAll('*').remove();

    const xExtent = d3.extent(
      filteredData,
      (d: Penguin) => (d as any)[xField]
    ) as [number, number];
    const yExtent = d3.extent(
      filteredData,
      (d: Penguin) => (d as any)[yField]
    ) as [number, number];

    if (!xExtent[0] || !yExtent[0]) return; // Invalid extents

    const xScale = d3.scaleLinear().domain(xExtent).range([0, w]).nice();
    const yScale = d3.scaleLinear().domain(yExtent).range([h, 0]).nice();

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    g.append('g')
      .attr('transform', `translate(0,${h})`)
      .call(d3.axisBottom(xScale))
      .append('text')
      .attr('x', w / 2)
      .attr('y', 35)
      .attr('fill', 'currentColor')
      .style('text-anchor', 'middle')
      .text(formatFieldName(xField));

    g.append('g')
      .call(d3.axisLeft(yScale))
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', -margin.left)
      .attr('x', -h / 2)
      .attr('fill', 'currentColor')
      .style('text-anchor', 'middle')
      .text(formatFieldName(yField));

    const circles = g
      .selectAll('.data-point')
      .data(filteredData)
      .enter()
      .append('circle')
      .attr('class', 'data-point')
      .attr('cx', (d: Penguin) => xScale((d as any)[xField] as number))
      .attr('cy', (d: Penguin) => yScale((d as any)[yField] as number))
      .attr('r', 4)
      .attr('fill', (d: Penguin) => colorScale(d.species))
      .attr('stroke', '#fff')
      .attr('stroke-width', 1)
      .attr('tabindex', 0)
      .attr('role', 'button')
      .attr(
        'aria-label',
        (d: Penguin) =>
          `Point: ${d.species}, ${formatFieldName(xField)}: ${(d as any)[xField]}, ${formatFieldName(yField)}: ${(d as any)[yField]}`
      );

    const handleMouseEnter = (event: MouseEvent, d: Penguin) => {
      const [x, y] = d3.pointer(event, svg.node()!);
      setTooltip({ x: x + margin.left + 10, y: y + margin.top - 10, datum: d });
    };

    const handleMouseLeave = () => setTooltip(null);

    circles
      .on('mouseenter', handleMouseEnter)
      .on('mouseleave', handleMouseLeave)
      .on('focus', (event, d) => handleMouseEnter(event as any, d as Penguin))
      .on('blur', handleMouseLeave);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        (event.target as SVGElement)?.blur();
        setTooltip(null);
      }
    };
    svg.on('keydown', handleKeyDown);

    return () => {
      svg.on('keydown', null);
      setTooltip(null);
    };
  }, [filteredData, xField, yField, dimensions, colorScale]);

  if (filteredData.length === 0) {
    return (
      <div
        role="img"
        aria-label="No data for scatter plot. Adjust filters or axes."
      >
        <p>No data points to display. Adjust filters or axes.</p>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', width: '100%', minHeight: '300px' }}>
      <svg
        ref={svgRef}
        width={dimensions.width}
        height={dimensions.height}
        role="img"
        aria-label={`Scatter plot of ${formatFieldName(xField)} vs ${formatFieldName(yField)} colored by species`}
        aria-describedby="scatter-desc"
      />
      <div id="scatter-desc" className="sr-only">
        Interactive scatter plot with {filteredData.length} points. Hover or tab
        to explore details.
      </div>
      {tooltip && (
        <div
          style={{
            position: 'absolute',
            left: tooltip.x,
            top: tooltip.y,
            background: 'rgba(0,0,0,0.8)',
            color: 'white',
            padding: '8px',
            borderRadius: '4px',
            pointerEvents: 'none',
            zIndex: 1000,
            fontSize: '12px',
            whiteSpace: 'nowrap',
          }}
        >
          <div>
            <strong>{tooltip.datum.species}</strong>
          </div>
          <div>
            {formatFieldName(xField)}: {tooltip.datum[xField as keyof Penguin]}
          </div>
          <div>
            {formatFieldName(yField)}: {tooltip.datum[yField as keyof Penguin]}
          </div>
          <div>
            Island: {tooltip.datum.island}, Sex:{' '}
            {tooltip.datum.sex || 'Unknown'}
          </div>
        </div>
      )}
    </div>
  );
};
