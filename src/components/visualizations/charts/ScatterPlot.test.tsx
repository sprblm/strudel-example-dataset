import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from '@/theme';
import { ScatterPlot } from './ScatterPlot';
import { Penguin } from '@/types/penguin';

const mockSelection = {
  attr: vi.fn().mockReturnThis(),
  call: vi.fn().mockReturnThis(),
  append: vi.fn().mockReturnThis(),
  style: vi.fn().mockReturnThis(),
  text: vi.fn().mockReturnThis(),
  on: vi.fn().mockReturnThis(),
  selectAll: vi.fn(() => mockSelection),
  data: vi.fn(() => mockSelection),
  enter: vi.fn(() => mockSelection),
  remove: vi.fn().mockReturnThis(),
  node: vi.fn(() => document.createElement('svg')),
};

vi.mock('d3', () => ({
  ...vi.importActual('d3'),
  extent: vi.fn(() => [30, 60]),
  pointer: vi.fn(() => [100, 100]),
  select: vi.fn(() => mockSelection),
  scaleLinear: vi.fn(() => ({
    domain: vi.fn().mockReturnThis(),
    range: vi.fn().mockReturnThis(),
    nice: vi.fn().mockReturnThis(),
  })),
  scaleOrdinal: vi.fn(() => ({
    domain: vi.fn().mockReturnThis(),
    range: vi.fn().mockReturnThis(),
    unknown: vi.fn().mockReturnThis(),
  })),
  axisBottom: vi.fn(() => vi.fn()),
  axisLeft: vi.fn(() => vi.fn()),
}));

const mockData: Penguin[] = [
  {
    species: 'Adelie',
    island: 'Biscoe',
    bill_length_mm: 39.1,
    bill_depth_mm: 18.7,
    flipper_length_mm: 181,
    body_mass_g: 3750,
    sex: 'male',
    year: 2007,
  },
  {
    species: 'Chinstrap',
    island: 'Dream',
    bill_length_mm: 46.5,
    bill_depth_mm: 17.9,
    flipper_length_mm: 192,
    body_mass_g: 3500,
    sex: 'female',
    year: 2008,
  },
];

const visibleSpecies = ['Adelie', 'Chinstrap'];

describe('ScatterPlot', () => {
  it('renders SVG for data', () => {
    const { container } = render(
      <ThemeProvider theme={theme}>
        <ScatterPlot
          data={mockData}
          xField="bill_length_mm"
          yField="body_mass_g"
          visibleSpecies={visibleSpecies}
        />
      </ThemeProvider>
    );
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('shows fallback for empty data', () => {
    render(
      <ThemeProvider theme={theme}>
        <ScatterPlot
          data={[]}
          xField="bill_length_mm"
          yField="body_mass_g"
          visibleSpecies={[]}
        />
      </ThemeProvider>
    );
    expect(screen.getByText(/no data points/i)).toBeInTheDocument();
  });

  it('has ARIA labels', () => {
    render(
      <ThemeProvider theme={theme}>
        <ScatterPlot
          data={mockData}
          xField="bill_length_mm"
          yField="body_mass_g"
          visibleSpecies={visibleSpecies}
        />
      </ThemeProvider>
    );
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute(
      'aria-label',
      expect.stringContaining('Scatter plot of Bill Length')
    );
    expect(document.getElementById('scatter-desc')).not.toBeNull();
  });

  it('filters by visible species', () => {
    const allData = [
      ...mockData,
      {
        species: 'Gentoo' as const,
        island: 'Biscoe',
        bill_length_mm: 50,
        bill_depth_mm: 15,
        flipper_length_mm: 220,
        body_mass_g: 5000,
        sex: 'male',
        year: 2009,
      },
    ];
    render(
      <ThemeProvider theme={theme}>
        <ScatterPlot
          data={allData}
          xField="bill_length_mm"
          yField="body_mass_g"
          visibleSpecies={['Adelie']}
        />
      </ThemeProvider>
    );
    expect(screen.getByRole('img')).toBeInTheDocument();
  });
});
