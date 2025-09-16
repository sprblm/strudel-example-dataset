import { renderHook } from '@testing-library/react';
import { fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { useKeyboardShortcuts } from '../useKeyboardShortcuts';

describe('useKeyboardShortcuts', () => {
  beforeEach(() => {
    // Clear any existing event listeners
    document.removeEventListener('keydown', vi.fn());
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('calls onFocusSearch when / key is pressed', () => {
    const onFocusSearch = vi.fn();
    const onOpenHelp = vi.fn();
    const onCloseModal = vi.fn();

    renderHook(() =>
      useKeyboardShortcuts({
        onFocusSearch,
        onOpenHelp,
        onCloseModal,
      })
    );

    fireEvent.keyDown(document, { key: '/' });

    expect(onFocusSearch).toHaveBeenCalledTimes(1);
    expect(onOpenHelp).not.toHaveBeenCalled();
    expect(onCloseModal).not.toHaveBeenCalled();
  });

  it('calls onOpenHelp when Shift+? is pressed', () => {
    const onFocusSearch = vi.fn();
    const onOpenHelp = vi.fn();
    const onCloseModal = vi.fn();

    renderHook(() =>
      useKeyboardShortcuts({
        onFocusSearch,
        onOpenHelp,
        onCloseModal,
      })
    );

    fireEvent.keyDown(document, { key: '?', shiftKey: true });

    expect(onOpenHelp).toHaveBeenCalledTimes(1);
    expect(onFocusSearch).not.toHaveBeenCalled();
    expect(onCloseModal).not.toHaveBeenCalled();
  });

  it('calls onCloseModal when Escape key is pressed', () => {
    const onFocusSearch = vi.fn();
    const onOpenHelp = vi.fn();
    const onCloseModal = vi.fn();

    renderHook(() =>
      useKeyboardShortcuts({
        onFocusSearch,
        onOpenHelp,
        onCloseModal,
      })
    );

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(onCloseModal).toHaveBeenCalledTimes(1);
    expect(onFocusSearch).not.toHaveBeenCalled();
    expect(onOpenHelp).not.toHaveBeenCalled();
  });

  it('ignores shortcuts when typing in input fields except Escape', () => {
    const onFocusSearch = vi.fn();
    const onOpenHelp = vi.fn();
    const onCloseModal = vi.fn();

    // Create a mock input element
    const input = document.createElement('input');
    document.body.appendChild(input);

    renderHook(() =>
      useKeyboardShortcuts({
        onFocusSearch,
        onOpenHelp,
        onCloseModal,
      })
    );

    // Simulate keydown on input
    fireEvent.keyDown(input, { key: '/' });
    fireEvent.keyDown(input, { key: '?', shiftKey: true });

    expect(onFocusSearch).not.toHaveBeenCalled();
    expect(onOpenHelp).not.toHaveBeenCalled();

    // But Escape should still work
    fireEvent.keyDown(input, { key: 'Escape' });
    expect(onCloseModal).toHaveBeenCalledTimes(1);

    document.body.removeChild(input);
  });

  it('returns keyboard shortcuts documentation', () => {
    const { result } = renderHook(() =>
      useKeyboardShortcuts({
        onFocusSearch: vi.fn(),
        onOpenHelp: vi.fn(),
        onCloseModal: vi.fn(),
      })
    );

    expect(result.current.shortcuts).toEqual([
      { key: '/', description: 'Focus search/filter input' },
      { key: '?', description: 'Open help modal' },
      { key: 'Esc', description: 'Close modals and dropdowns' },
    ]);
  });

  it('removes event listener on unmount', () => {
    const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');

    const { unmount } = renderHook(() =>
      useKeyboardShortcuts({
        onFocusSearch: vi.fn(),
        onOpenHelp: vi.fn(),
        onCloseModal: vi.fn(),
      })
    );

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'keydown',
      expect.any(Function)
    );
  });
});
