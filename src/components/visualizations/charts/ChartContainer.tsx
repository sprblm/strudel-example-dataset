import React, { useEffect, useRef } from 'react';
import { Box } from '@mui/material';
import { Penguin } from '@/types/penguin';
import {
  generateChartDataSummary,
  generateStatisticalSummary,
} from '@/utils/a11yHelpers';

interface ChartContainerProps {
  children: React.ReactNode;
  data: Penguin[];
  chartType: 'scatter' | 'histogram' | 'box';
  fields: { x?: string; y?: string; field?: string };
  title?: string;
  className?: string;
}

/**
 * Accessible container for chart components that provides:
 * - Dynamic descriptions based on filtered data
 * - Statistical summaries for screen readers
 * - Proper ARIA labeling and structure
 */
export const ChartContainer: React.FC<ChartContainerProps> = ({
  children,
  data,
  chartType,
  fields,
  title,
  className,
}) => {
  const descriptionRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  // Generate dynamic descriptions
  const chartDescription = generateChartDataSummary(data, chartType, fields);
  const statisticalSummary = fields.field
    ? generateStatisticalSummary(data, fields.field)
    : fields.x && fields.y
      ? generateStatisticalSummary(data, fields.x) +
        ' ' +
        generateStatisticalSummary(data, fields.y)
      : '';

  // Update descriptions when data changes
  useEffect(() => {
    if (descriptionRef.current) {
      descriptionRef.current.textContent = chartDescription;
    }
    if (statsRef.current && statisticalSummary) {
      statsRef.current.textContent = statisticalSummary;
    }
  }, [chartDescription, statisticalSummary]);

  const descId = `chart-desc-${chartType}`;
  const statsId = `chart-stats-${chartType}`;

  return (
    <Box
      component="figure"
      role="img"
      aria-labelledby={title ? `chart-title-${chartType}` : undefined}
      aria-describedby={`${descId} ${statisticalSummary ? statsId : ''}`.trim()}
      className={className}
      sx={{
        margin: 0,
        padding: 2,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
        backgroundColor: 'background.paper',
      }}
    >
      {title && (
        <Box
          component="figcaption"
          id={`chart-title-${chartType}`}
          sx={{
            fontSize: '1.1rem',
            fontWeight: 'bold',
            marginBottom: 1,
            textAlign: 'center',
          }}
        >
          {title}
        </Box>
      )}

      {/* Chart content */}
      <Box sx={{ position: 'relative', width: '100%' }}>{children}</Box>

      {/* Accessible descriptions (screen reader only) */}
      <Box
        ref={descriptionRef}
        id={descId}
        sx={{
          position: 'absolute',
          left: '-10000px',
          width: '1px',
          height: '1px',
          overflow: 'hidden',
        }}
        aria-live="polite"
        aria-atomic="true"
      >
        {chartDescription}
      </Box>

      {statisticalSummary && (
        <Box
          ref={statsRef}
          id={statsId}
          sx={{
            position: 'absolute',
            left: '-10000px',
            width: '1px',
            height: '1px',
            overflow: 'hidden',
          }}
        >
          {statisticalSummary}
        </Box>
      )}

      {/* Visible summary for all users */}
      <Box
        sx={{
          marginTop: 1,
          fontSize: '0.875rem',
          color: 'text.secondary',
          textAlign: 'center',
        }}
      >
        Showing {data.length} penguin{data.length !== 1 ? 's' : ''}
        {data.length > 0 && (
          <>
            {' '}
            (
            {Object.entries(
              data.reduce(
                (acc, p) => {
                  acc[p.species] = (acc[p.species] || 0) + 1;
                  return acc;
                },
                {} as Record<string, number>
              )
            )
              .map(([species, count]) => `${count} ${species}`)
              .join(', ')}
            )
          </>
        )}
      </Box>
    </Box>
  );
};
