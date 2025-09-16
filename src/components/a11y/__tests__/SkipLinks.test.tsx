import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { SkipLinks } from '../SkipLinks';

describe('SkipLinks', () => {
  it('renders skip links with correct hrefs', () => {
    render(<SkipLinks />);

    expect(
      screen.getByRole('link', { name: 'Skip to main content' })
    ).toHaveAttribute('href', '#main-content');
    expect(
      screen.getByRole('link', { name: 'Skip to filters' })
    ).toHaveAttribute('href', '#filters');
    expect(screen.getByRole('link', { name: 'Skip to data' })).toHaveAttribute(
      'href',
      '#data'
    );
  });

  it('has proper navigation landmark', () => {
    render(<SkipLinks />);

    const nav = screen.getByRole('navigation', { name: 'Skip links' });
    expect(nav).toBeInTheDocument();
  });

  it('skip links are positioned off-screen by default', () => {
    render(<SkipLinks />);

    const skipLink = screen.getByRole('link', { name: 'Skip to main content' });

    // Note: jsdom doesn't compute actual styles, but we can check the sx prop is applied
    expect(skipLink).toHaveStyle('position: absolute');
  });

  it('handles focus events', async () => {
    const user = userEvent.setup();

    // Mock scrollIntoView
    const scrollIntoViewMock = vi.fn();
    Element.prototype.scrollIntoView = scrollIntoViewMock;

    render(<SkipLinks />);

    await user.tab(); // Focus the skip link

    expect(scrollIntoViewMock).toHaveBeenCalledWith({
      behavior: 'smooth',
      block: 'center',
    });
  });
});
