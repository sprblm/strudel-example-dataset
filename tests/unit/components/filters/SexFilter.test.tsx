import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SexFilter } from '@/components/filters/SexFilter';
import { AppProvider, useAppState } from '@/context/ContextProvider';

// Mock the useAppState hook for testing
const mockDispatch = vi.fn();


// Mock the useAppState to return our controlled state
vi.mock('@/context/ContextProvider', async () => {
  const actual = await vi.importActual('@/context/ContextProvider');
  return {
    ...actual,
    useAppState: vi.fn(() => ({
      state: {
        appTitle: '',
        apiModalOpen: false,
        selectedSpecies: ['Adelie', 'Chinstrap', 'Gentoo'],
        selectedIsland: 'all',
        selectedSex: 'all',
      },
      dispatch: mockDispatch,
    )),
  };
});

describe('SexFilter Component', () => {
  beforeEach(() => {
    mockDispatch.mockClear();
    vi.mocked(useAppState).mockReturnValue({
      state: {
        appTitle: '',
        apiModalOpen: false,
        selectedSpecies: ['Adelie', 'Chinstrap', 'Gentoo'],
        selectedIsland: 'all',
        selectedSex: 'all',
      },
      dispatch: mockDispatch,
    });
  });

  it('renders radio group with three options', () => {
    render(<SexFilter />);
    
    expect(screen.getByTestId('sex-filter')).toBeInTheDocument();
    expect(screen.getByText('Sex Filter')).toBeInTheDocument();
    expect(screen.getByTestId('sex-radio-group')).toBeInTheDocument();
    
    // Check for all three radio options
    expect(screen.getByTestId('sex-radio-all')).toBeInTheDocument();
    expect(screen.getByTestId('sex-radio-male')).toBeInTheDocument();
    expect(screen.getByTestId('sex-radio-female')).toBeInTheDocument();
    
    // Check labels
    expect(screen.getByText('All')).toBeInTheDocument();
    expect(screen.getByText('Male')).toBeInTheDocument();
    expect(screen.getByText('Female')).toBeInTheDocument();
  });

  it('defaults to "All" selection', () => {
    render(<SexFilter />);
    
    const allRadio = screen.getByRole('radio', { name: 'All' });
    expect(allRadio).toHaveAttribute('aria-checked', 'true');
    
    const maleRadio = screen.getByRole('radio', { name: 'Male' });
    expect(maleRadio).toHaveAttribute('aria-checked', 'false');
    
    const femaleRadio = screen.getByRole('radio', { name: 'Female' });
    expect(femaleRadio).toHaveAttribute('aria-checked', 'false');
  });

  it('displays correct option labels', () => {
    render(<SexFilter />);
    
    // Check that all required labels are present and correctly positioned
    const allOption = screen.getByTestId('sex-option-all');
    const maleOption = screen.getByTestId('sex-option-male');
    const femaleOption = screen.getByTestId('sex-option-female');
    
    expect(allOption).toContainElement(screen.getByText('All'));
    expect(maleOption).toContainElement(screen.getByText('Male'));
    expect(femaleOption).toContainElement(screen.getByText('Female'));
  });

  it('allows only one option selected at a time', () => {
    render(<SexFilter />);
    
    const allRadio = screen.getByRole('radio', { name: 'All' });
    const maleRadio = screen.getByRole('radio', { name: 'Male' });
    
    // Initially "All" should be selected
    expect(allRadio).toHaveAttribute('aria-checked', 'true');
    expect(maleRadio).toHaveAttribute('aria-checked', 'false');
    
    // Select male
    fireEvent.click(maleRadio);
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'UPDATE_SEX_FILTER',
      payload: 'male'
    });
  });

  it('deselects previous option when new one selected', () => {
    render(<SexFilter />);
    
    const maleRadio = screen.getByTestId('sex-radio-male');
    const femaleRadio = screen.getByTestId('sex-radio-female');
    
    // Select male first
    fireEvent.click(maleRadio);
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'UPDATE_SEX_FILTER',
      payload: 'male'
    });
    
    // Then select female - should trigger another dispatch
    fireEvent.click(femaleRadio);
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'UPDATE_SEX_FILTER',
      payload: 'female'
    });
    
    expect(mockDispatch).toHaveBeenCalledTimes(2);
  });

  it('shows visual feedback when a specific sex is selected', () => {
    // Update mock to select male
    useAppState.mockReturnValue({
      state: {
        appTitle: '',
        apiModalOpen: false,
        selectedSpecies: ['Adelie', 'Chinstrap', 'Gentoo'],
        selectedIsland: 'all',
        selectedSex: 'male',
      },
      dispatch: mockDispatch,
    });
    
    render(<SexFilter />);
    
    const feedback = screen.getByTestId('sex-filter-feedback');
    expect(feedback).toBeInTheDocument();
    expect(feedback).toHaveTextContent('Filtering by: male');
  });

  it('does not show visual feedback when "All" is selected', () => {
    render(<SexFilter />);
    
    const feedback = screen.queryByTestId('sex-filter-feedback');
    expect(feedback).not.toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(<SexFilter />);
    
    // Check for proper ARIA labeling
    const radioGroup = screen.getByTestId('sex-radio-group');
    expect(radioGroup).toHaveAttribute('aria-labelledby', 'sex-radio-group-label');
    
    const legend = screen.getByText('Select Sex');
    expect(legend).toHaveAttribute('id', 'sex-radio-group-label');
    
    // Check radio buttons have proper roles
    const allRadio = screen.getByTestId('sex-radio-all');
    const maleRadio = screen.getByTestId('sex-radio-male');
    const femaleRadio = screen.getByTestId('sex-radio-female');
    
    expect(allRadio).toHaveAttribute('role', 'radio');
    expect(maleRadio).toHaveAttribute('type', 'radio');
    expect(femaleRadio).toHaveAttribute('type', 'radio');
    
    // All radios should be in the same group
    expect(allRadio).toHaveAttribute('name', 'sex-filter-radio-group');
    expect(maleRadio).toHaveAttribute('name', 'sex-filter-radio-group');
    expect(femaleRadio).toHaveAttribute('name', 'sex-filter-radio-group');
  });

  it('supports keyboard navigation', () => {
    render(<SexFilter />);
    
    // Start with All selected and focused
    const allRadio = screen.getByRole('radio', { name: /All/i });
    fireEvent.keyDown(allRadio, { key: ' ' }); // Space to select
    expect(allRadio).toHaveAttribute('aria-checked', 'true');
    
    // Navigate to Male and select
    fireEvent.keyDown(allRadio, { key: 'ArrowDown' });
    const maleRadio = screen.getByRole('radio', { name: /Male/i });
    expect(document.activeElement).toBe(maleRadio);
    fireEvent.keyDown(maleRadio, { key: ' ' });
    expect(maleRadio).toHaveAttribute('aria-checked', 'true');
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'UPDATE_SEX_FILTER',
      payload: 'male'
    });
  });
});