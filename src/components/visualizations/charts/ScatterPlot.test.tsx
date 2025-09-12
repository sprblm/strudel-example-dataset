import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ScatterPlot } from './ScatterPlot';
import { Penguin } from '@/types/penguin';

const mockPenguins: Penguin[] = [
  {
    species: 'Adelie',
    island: 'Torgersen',
    bill_length_mm: 39.1,
    bill_depth_mm: 18.7,
    flipper_length_mm: 181,
    body_mass_g: 3750,
    sex: 'male',
    year: 2007,
  },
  {
    species: 'Gentoo',
    island: 'Biscoe',
    bill_length_mm: 46.5,
    bill_depth_mm: 14.8,
    flipper_length_mm: 215,
    body_mass_g: 4850,
    sex: 'female',
    year: 2007,
  },
];

describe('ScatterPlot', () => {
  it('renders SVG element for the plot', () => {
    render(
      <ScatterPlot
        data={mockPenguins}
        xField="bill_length_mm"
        yField="body_mass_g"
      />
    );

    expect(screen.getByRole('img')).toBeInTheDocument();
  });

  it('has correct ARIA label', () => {
    render(
      <ScatterPlot
        data={mockPenguins}
        xField="bill_length_mm"
        yField="body_mass_g"
      />
    );

    const svg = screen.getByRole('img');
    expect(svg).toHaveAttribute(
      'aria-label',
      expect.stringContaining('Scatter plot of bill_length_mm vs body_mass_g')
    );
  });

  it('renders with different dimensions', () => {
    render(
      <ScatterPlot
        data={mockPenguins}
        xField="bill_length_mm"
        yField="body_mass_g"
        width={800}
        height={600}
      />
    );

    const svg = screen.getByRole('img');
    expect(svg).toHaveAttribute('width', '800');
    expect(svg).toHaveAttribute('height', '600');
  });
});
