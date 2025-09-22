import {
  formatFieldName,
  generateChartDataSummary,
  generateStatisticalSummary,
  generatePointAriaLabel,
  generateChartUpdateAnnouncement,
} from '../a11yHelpers';
import { Penguin } from '@/types/penguin';

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
  {
    species: 'Adelie',
    island: 'Torgersen',
    bill_length_mm: 40.3,
    bill_depth_mm: 18.0,
    flipper_length_mm: 195,
    body_mass_g: 3250,
    sex: null,
    year: 2007,
  },
];

describe('a11yHelpers', () => {
  describe('formatFieldName', () => {
    it('formats field names correctly', () => {
      expect(formatFieldName('bill_length_mm')).toBe('Bill Length Mm');
      expect(formatFieldName('body_mass_g')).toBe('Body Mass G');
      expect(formatFieldName('simple')).toBe('Simple');
    });
  });

  describe('generateChartDataSummary', () => {
    it('generates scatter plot summary', () => {
      const summary = generateChartDataSummary(mockPenguins, 'scatter', {
        x: 'bill_length_mm',
        y: 'bill_depth_mm',
      });

      expect(summary).toContain('Scatter plot showing 3 penguins');
      expect(summary).toContain('2 Adelie, 1 Chinstrap');
      expect(summary).toContain('Bill Length Mm on X-axis');
      expect(summary).toContain('Bill Depth Mm on Y-axis');
    });

    it('generates histogram summary', () => {
      const summary = generateChartDataSummary(mockPenguins, 'histogram', {
        field: 'body_mass_g',
      });

      expect(summary).toContain('Histogram showing distribution');
      expect(summary).toContain('Body Mass G');
      expect(summary).toContain('3 penguins');
    });

    it('generates box plot summary', () => {
      const summary = generateChartDataSummary(mockPenguins, 'box', {
        field: 'flipper_length_mm',
      });

      expect(summary).toContain('Box plot showing');
      expect(summary).toContain('Flipper Length Mm distribution');
      expect(summary).toContain('quartiles, median, and outliers');
    });

    it('handles empty data', () => {
      const summary = generateChartDataSummary([], 'scatter', {
        x: 'bill_length_mm',
        y: 'bill_depth_mm',
      });
      expect(summary).toContain('No data available');
      expect(summary).toContain('Adjust filters');
    });
  });

  describe('generateStatisticalSummary', () => {
    it('calculates statistics correctly', () => {
      const summary = generateStatisticalSummary(
        mockPenguins,
        'bill_length_mm'
      );

      expect(summary).toContain('Statistical summary for Bill Length Mm');
      expect(summary).toContain('minimum 39.1');
      expect(summary).toContain('maximum 46.5');
      expect(summary).toContain('median');
      expect(summary).toContain('mean');
    });

    it('handles empty data', () => {
      const summary = generateStatisticalSummary([], 'bill_length_mm');
      expect(summary).toBe('');
    });

    it('handles null values', () => {
      const dataWithNulls = [
        { ...mockPenguins[0], bill_length_mm: null },
        mockPenguins[1],
      ];
      const summary = generateStatisticalSummary(
        dataWithNulls as Penguin[],
        'bill_length_mm'
      );
      expect(summary).toContain('minimum 46.5');
      expect(summary).toContain('maximum 46.5');
    });
  });

  describe('generatePointAriaLabel', () => {
    it('generates comprehensive aria label', () => {
      const label = generatePointAriaLabel(mockPenguins[0], {
        x: 'bill_length_mm',
        y: 'bill_depth_mm',
      });

      expect(label).toContain('Adelie penguin');
      expect(label).toContain('island: Biscoe');
      expect(label).toContain('sex: male');
      expect(label).toContain('Bill Length Mm: 39.1');
      expect(label).toContain('Bill Depth Mm: 18.7');
    });

    it('handles null sex values', () => {
      const label = generatePointAriaLabel(mockPenguins[2], {
        field: 'body_mass_g',
      });

      expect(label).toContain('sex: unknown');
      expect(label).toContain('Body Mass G: 3250');
    });
  });

  describe('generateChartUpdateAnnouncement', () => {
    it('generates basic announcement', () => {
      const announcement = generateChartUpdateAnnouncement('scatter', 5);
      expect(announcement).toBe('scatter plot updated: showing 5 penguins');
    });

    it('includes filter information when provided', () => {
      const announcement = generateChartUpdateAnnouncement(
        'histogram',
        3,
        'Adelie species only'
      );
      expect(announcement).toBe(
        'histogram updated: showing 3 penguins, Adelie species only'
      );
    });

    it('handles box plot type', () => {
      const announcement = generateChartUpdateAnnouncement('box', 10);
      expect(announcement).toBe('box plot updated: showing 10 penguins');
    });
  });
});
