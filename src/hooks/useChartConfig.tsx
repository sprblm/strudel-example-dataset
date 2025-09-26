import { useState, useEffect } from 'react';
import { NumericField } from '@/components/visualizations/types';

export interface ChartConfig {
  type: 'scatter' | 'histogram' | 'box';
  x?: NumericField;
  y?: NumericField;
  field?: NumericField;
  bins?: number;
}

export const useChartConfig = () => {
  const [config, setConfig] = useState<ChartConfig>({
    type: 'scatter' as const,
    x: 'bill_length_mm',
    y: 'body_mass_g',
    field: 'bill_length_mm',
    bins: 10,
  });

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const type = (params.get('type') as ChartConfig['type']) || 'scatter';
    const x = (params.get('x') as NumericField) || 'bill_length_mm';
    const y = (params.get('y') as NumericField) || 'body_mass_g';
    const field = (params.get('field') as NumericField) || 'bill_length_mm';
    const bins = Number(params.get('bins')) || 10;

    setConfig({ type, x, y, field, bins });
  }, []);

  const updateConfig = (updates: Partial<ChartConfig>) => {
    const newConfig = { ...config, ...updates };
    setConfig(newConfig);

    // Sync to URL
    if (typeof window === 'undefined') {
      return;
    }
    const params = new URLSearchParams();
    if (newConfig.type !== 'scatter') params.set('type', newConfig.type);
    if (newConfig.x) params.set('x', newConfig.x);
    if (newConfig.y) params.set('y', newConfig.y);
    if (newConfig.field) params.set('field', newConfig.field);
    if (newConfig.bins && newConfig.type === 'histogram')
      params.set('bins', newConfig.bins.toString());

    const searchString = params.toString();
    const newUrl = `${window.location.pathname}${searchString ? `?${searchString}` : ''}`;
    window.history.replaceState(null, '', newUrl);
  };

  return { config, updateConfig };
};
