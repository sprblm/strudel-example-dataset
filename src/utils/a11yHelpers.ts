import { Penguin } from '@/types/penguin';

/**
 * Utility functions for generating accessible descriptions and ARIA labels
 */

/**
 * Formats field names for human-readable display
 */
export const formatFieldName = (field: string): string => {
  return field.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
};

/**
 * Generates descriptive summary for chart data
 */
export const generateChartDataSummary = (
  data: Penguin[],
  chartType: string,
  fields: { x?: string; y?: string; field?: string }
): string => {
  const totalPoints = data.length;

  if (totalPoints === 0) {
    return `No data available for the ${chartType} chart. Adjust filters to see penguin measurements.`;
  }

  // Get species distribution
  const speciesCounts = data.reduce(
    (acc, penguin) => {
      acc[penguin.species] = (acc[penguin.species] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const speciesInfo = Object.entries(speciesCounts)
    .map(([species, count]) => `${count} ${species}`)
    .join(', ');

  // Generate chart-specific description
  switch (chartType) {
    case 'scatter':
      return `Scatter plot showing ${totalPoints} penguins (${speciesInfo}) with ${formatFieldName(fields.x!)} on X-axis and ${formatFieldName(fields.y!)} on Y-axis. Each point represents one penguin colored by species.`;

    case 'histogram':
      return `Histogram showing distribution of ${formatFieldName(fields.field!)} for ${totalPoints} penguins (${speciesInfo}). Bars show frequency counts with species overlaid.`;

    case 'box':
      return `Box plot showing ${formatFieldName(fields.field!)} distribution for ${totalPoints} penguins (${speciesInfo}). Boxes show quartiles, median, and outliers by species.`;

    default:
      return `Chart displaying ${totalPoints} penguins (${speciesInfo}).`;
  }
};

/**
 * Generates statistical summary for screen readers
 */
export const generateStatisticalSummary = (
  data: Penguin[],
  field: string
): string => {
  if (data.length === 0) return '';

  const values = data
    .map((d) => (d as any)[field])
    .filter((v) => v != null && !isNaN(v))
    .sort((a, b) => a - b);

  if (values.length === 0) return '';

  const min = values[0];
  const max = values[values.length - 1];
  const median = values[Math.floor(values.length / 2)];
  const mean = values.reduce((sum, v) => sum + v, 0) / values.length;

  return `Statistical summary for ${formatFieldName(field)}: minimum ${min.toFixed(1)}, maximum ${max.toFixed(1)}, median ${median.toFixed(1)}, mean ${mean.toFixed(1)}.`;
};

/**
 * Generates ARIA label for interactive chart elements
 */
export const generatePointAriaLabel = (
  penguin: Penguin,
  fields: { x?: string; y?: string; field?: string }
): string => {
  const parts = [
    `${penguin.species} penguin`,
    `island: ${penguin.island}`,
    penguin.sex ? `sex: ${penguin.sex}` : 'sex: unknown',
  ];

  // Add relevant field values
  if (fields.x && (penguin as any)[fields.x] != null) {
    parts.push(`${formatFieldName(fields.x)}: ${(penguin as any)[fields.x]}`);
  }
  if (fields.y && (penguin as any)[fields.y] != null) {
    parts.push(`${formatFieldName(fields.y)}: ${(penguin as any)[fields.y]}`);
  }
  if (fields.field && (penguin as any)[fields.field] != null) {
    parts.push(
      `${formatFieldName(fields.field)}: ${(penguin as any)[fields.field]}`
    );
  }

  return parts.join(', ');
};

/**
 * Generates live region announcement for chart updates
 */
export const generateChartUpdateAnnouncement = (
  chartType: string,
  dataCount: number,
  filterInfo?: string
): string => {
  const chartName =
    chartType === 'scatter'
      ? 'scatter plot'
      : chartType === 'box'
        ? 'box plot'
        : chartType;

  if (filterInfo) {
    return `${chartName} updated: showing ${dataCount} penguins, ${filterInfo}`;
  }

  return `${chartName} updated: showing ${dataCount} penguins`;
};
