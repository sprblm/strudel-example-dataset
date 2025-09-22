import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material/styles';
import { ChartContainer } from '../ChartContainer';
import { Penguin } from '@/types/penguin';

const theme = createTheme();

const mockPenguins: Penguin[] = [
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
    year: 2007,
  },
];

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ThemeProvider theme={theme}>{children}</ThemeProvider>
);

describe('ChartContainer', () => {
  it('renders with proper ARIA structure', () => {
    render(
      <TestWrapper>
        <ChartContainer
          data={mockPenguins}
          chartType="scatter"
          fields={{ x: 'bill_length_mm', y: 'bill_depth_mm' }}
        >
          <div>Mock Chart</div>
        </ChartContainer>
      </TestWrapper>
    );

    const container = screen.getByRole('img');
    expect(container).toBeInTheDocument();
    expect(container).toHaveAttribute('aria-describedby');
  });

  it('generates dynamic chart descriptions', () => {
    render(
      <TestWrapper>
        <ChartContainer
          data={mockPenguins}
          chartType="scatter"
          fields={{ x: 'bill_length_mm', y: 'bill_depth_mm' }}
        >
          <div>Mock Chart</div>
        </ChartContainer>
      </TestWrapper>
    );

    // Check that description mentions the data count and species
    const description = document.getElementById('chart-desc-scatter');
    expect(description?.textContent).toContain('2 penguins');
    expect(description?.textContent).toContain('Adelie');
    expect(description?.textContent).toContain('Chinstrap');
    expect(description?.textContent).toContain('Bill Length');
    expect(description?.textContent).toContain('Bill Depth');
  });

  it('shows visible summary for all users', () => {
    render(
      <TestWrapper>
        <ChartContainer
          data={mockPenguins}
          chartType="histogram"
          fields={{ field: 'bill_length_mm' }}
        >
          <div>Mock Chart</div>
        </ChartContainer>
      </TestWrapper>
    );

    // Check visible summary (not the screen reader description)
    const visibleSummaries = screen.getAllByText(/Showing 2 penguins/);
    expect(visibleSummaries).toHaveLength(1);

    const speciesInfo = screen.getAllByText(/1 Adelie, 1 Chinstrap/);
    expect(speciesInfo.length).toBeGreaterThan(0);
  });

  it('handles empty data gracefully', () => {
    render(
      <TestWrapper>
        <ChartContainer
          data={[]}
          chartType="box"
          fields={{ field: 'body_mass_g' }}
        >
          <div>Mock Chart</div>
        </ChartContainer>
      </TestWrapper>
    );

    expect(screen.getByText('Showing 0 penguins')).toBeInTheDocument();

    const description = document.getElementById('chart-desc-box');
    expect(description?.textContent).toContain('No data available');
  });

  it('includes statistical summary for appropriate chart types', () => {
    render(
      <TestWrapper>
        <ChartContainer
          data={mockPenguins}
          chartType="histogram"
          fields={{ field: 'bill_length_mm' }}
        >
          <div>Mock Chart</div>
        </ChartContainer>
      </TestWrapper>
    );

    const statsElement = document.getElementById('chart-stats-histogram');
    expect(statsElement?.textContent).toContain('Statistical summary');
    expect(statsElement?.textContent).toContain('minimum');
    expect(statsElement?.textContent).toContain('maximum');
    expect(statsElement?.textContent).toContain('Bill Length');
  });

  it('renders with custom title when provided', () => {
    render(
      <TestWrapper>
        <ChartContainer
          data={mockPenguins}
          chartType="scatter"
          fields={{ x: 'bill_length_mm', y: 'bill_depth_mm' }}
          title="Custom Chart Title"
        >
          <div>Mock Chart</div>
        </ChartContainer>
      </TestWrapper>
    );

    expect(screen.getByText('Custom Chart Title')).toBeInTheDocument();

    const container = screen.getByRole('img');
    expect(container).toHaveAttribute('aria-labelledby', 'chart-title-scatter');
  });

  it('updates descriptions when data changes', () => {
    const { rerender } = render(
      <TestWrapper>
        <ChartContainer
          data={mockPenguins}
          chartType="scatter"
          fields={{ x: 'bill_length_mm', y: 'bill_depth_mm' }}
        >
          <div>Mock Chart</div>
        </ChartContainer>
      </TestWrapper>
    );

    // Initial state
    expect(screen.getByText(/Showing 2 penguins/)).toBeInTheDocument();

    // Update with different data
    const newData = mockPenguins.slice(0, 1); // Only one penguin
    rerender(
      <TestWrapper>
        <ChartContainer
          data={newData}
          chartType="scatter"
          fields={{ x: 'bill_length_mm', y: 'bill_depth_mm' }}
        >
          <div>Mock Chart</div>
        </ChartContainer>
      </TestWrapper>
    );

    expect(screen.getByText(/Showing 1 penguin/)).toBeInTheDocument();
  });
});
