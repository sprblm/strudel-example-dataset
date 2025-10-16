import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest';
import { ShareButton, TESTING_EXPORTS } from '../ShareButton';

const removeClipboard = () => {
  Reflect.deleteProperty(
    navigator as unknown as Record<string, unknown>,
    'clipboard'
  );
};

const defineClipboard = (value: unknown) => {
  Object.defineProperty(navigator, 'clipboard', {
    configurable: true,
    enumerable: true,
    writable: true,
    value,
  });
};

const setupClipboard = (writeText?: () => Promise<void>) => {
  removeClipboard();
  if (writeText) {
    defineClipboard({ writeText });
  }
};

describe('ShareButton', () => {
  beforeEach(() => {
    setupClipboard(undefined);
  });

  describe('share helpers', () => {
    afterEach(() => {
      Reflect.deleteProperty(
        document as unknown as Record<string, unknown>,
        'execCommand'
      );
      Reflect.deleteProperty(
        navigator as unknown as Record<string, unknown>,
        'clipboard'
      );
    });

    it('fallbackCopy returns true when execCommand succeeds', () => {
      const execCommand = vi.fn().mockReturnValue(true);
      (document as unknown as Record<string, unknown>).execCommand =
        execCommand;

      const result = TESTING_EXPORTS.fallbackCopy('example');

      expect(execCommand).toHaveBeenCalledWith('copy');
      expect(result).toBe(true);
    });

    it('fallbackCopy returns false when execCommand fails', () => {
      const execCommand = vi.fn().mockReturnValue(false);
      (document as unknown as Record<string, unknown>).execCommand =
        execCommand;

      const result = TESTING_EXPORTS.fallbackCopy('example');

      expect(execCommand).toHaveBeenCalledWith('copy');
      expect(result).toBe(false);
    });

    it('copyToClipboard uses navigator clipboard when available', async () => {
      const writeText = vi.fn().mockResolvedValue(undefined);
      Object.defineProperty(navigator, 'clipboard', {
        configurable: true,
        value: { writeText },
      });

      const result = await TESTING_EXPORTS.copyToClipboard('example');

      expect(writeText).toHaveBeenCalledWith('example');
      expect(result).toBe(true);
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    setupClipboard(undefined);
  });

  it('shows success when clipboard API copies link', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    setupClipboard(writeText);
    const getShareUrl = vi.fn().mockReturnValue('https://example.com/share');

    render(<ShareButton getShareUrl={getShareUrl} />);

    const user = userEvent.setup();
    await user.click(
      screen.getByRole('button', { name: /copy shareable visualization link/i })
    );

    expect(getShareUrl).toHaveBeenCalledTimes(1);
    await screen.findByText(/Link Copied!/i);
  });
});
