import { useCallback, useState } from 'react';
import {
  DEFAULT_CHART_FIELDS,
  NumericField,
} from '@/components/visualizations/types';

export type ChartType = 'scatter' | 'histogram' | 'box';

export interface ChartConfig {
  type: ChartType;
  x?: NumericField;
  y?: NumericField;
  field?: NumericField;
  bins?: number;
}

const INITIAL_CONFIG: ChartConfig = {
  type: 'scatter',
  x: DEFAULT_CHART_FIELDS.x,
  y: DEFAULT_CHART_FIELDS.y,
  field: DEFAULT_CHART_FIELDS.x,
  bins: 12,
};

const normaliseConfig = (config: ChartConfig): ChartConfig => {
  if (config.type === 'scatter') {
    return {
      type: 'scatter',
      x: config.x ?? DEFAULT_CHART_FIELDS.x,
      y: config.y ?? DEFAULT_CHART_FIELDS.y,
      field: undefined,
      bins: undefined,
    };
  }

  if (config.type === 'histogram') {
    return {
      type: 'histogram',
      field: config.field ?? DEFAULT_CHART_FIELDS.x,
      bins: config.bins ?? INITIAL_CONFIG.bins,
    };
  }

  return {
    type: 'box',
    field: config.field ?? DEFAULT_CHART_FIELDS.x,
  };
};

export const useChartConfig = () => {
  const [config, setConfig] = useState<ChartConfig>(INITIAL_CONFIG);

  const updateConfig = useCallback((updates: Partial<ChartConfig>) => {
    setConfig((prev) => normaliseConfig({ ...prev, ...updates }));
  }, []);

  return { config, updateConfig };
};

export default useChartConfig;
