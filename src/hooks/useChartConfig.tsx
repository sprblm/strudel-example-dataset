import { useState, useEffect } from 'react';
import { useSearch, useNavigate } from '@tanstack/router';
import { NumericField } from '@/components/visualizations/types';

export interface ChartConfig {
  type: 'scatter' | 'histogram' | 'box';
  x?: NumericField;
  y?: NumericField;
  field?: NumericField;
  bins?: number;
}

export const useChartConfig = () => {
  const navigate = useNavigate();
  const search = useSearch({ from: '/visualize' });

  const [config, setConfig] = useState<ChartConfig>({
    type: 'scatter' as const,
    x: 'bill_length_mm',
    y: 'body_mass_g',
    field: 'bill_length_mm',
    bins: 10,
  });

  useEffect(() => {
    const type = (search.type as ChartConfig['type']) || 'scatter';
    const x = (search.x as NumericField) || 'bill_length_mm';
    const y = (search.y as NumericField) || 'body_mass_g';
    const field = (search.field as NumericField) || 'bill_length_mm';
    const bins = Number(search.bins) || 10;

    setConfig({ type, x, y, field, bins });
  }, [search]);

  const updateConfig = (updates: Partial<ChartConfig>) => {
    const newConfig = { ...config, ...updates };
    setConfig(newConfig);

    // Sync to URL
    const params = new URLSearchParams();
    if (newConfig.type !== 'scatter') params.set('type', newConfig.type);
    if (newConfig.x) params.set('x', newConfig.x);
    if (newConfig.y) params.set('y', newConfig.y);
    if (newConfig.field) params.set('field', newConfig.field);
    if (newConfig.bins && newConfig.type === 'histogram')
      params.set('bins', newConfig.bins.toString());

    navigate({ search: params.toString() }, { replace: true });
  };

  return { config, updateConfig };
};
