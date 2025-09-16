import { useEffect, useCallback } from 'react';

interface KeyboardShortcutHandlers {
  onFocusSearch?: () => void;
  onOpenHelp?: () => void;
  onCloseModal?: () => void;
}

export const useKeyboardShortcuts = (handlers: KeyboardShortcutHandlers) => {
  const { onFocusSearch, onOpenHelp, onCloseModal } = handlers;

  const handleKeydown = useCallback(
    (event: KeyboardEvent) => {
      // Ignore shortcuts when user is typing in form inputs
      const target = event.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        // Only allow Escape key in inputs
        if (event.key === 'Escape' && onCloseModal) {
          event.preventDefault();
          event.stopPropagation();
          onCloseModal();
        }
        return;
      }

      switch (event.key) {
        case '/':
          // Focus search/filter input
          if (onFocusSearch) {
            event.preventDefault();
            event.stopPropagation();
            onFocusSearch();
          }
          break;

        case '?':
          // Open help modal (Shift + / combination)
          if (event.shiftKey && onOpenHelp) {
            event.preventDefault();
            event.stopPropagation();
            onOpenHelp();
          }
          break;

        case 'Escape':
          // Close modals and dropdowns
          if (onCloseModal) {
            event.preventDefault();
            event.stopPropagation();
            onCloseModal();
          }
          break;

        default:
          break;
      }
    },
    [onFocusSearch, onOpenHelp, onCloseModal]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeydown);

    return () => {
      document.removeEventListener('keydown', handleKeydown);
    };
  }, [handleKeydown]);

  // Return helper functions for manual keyboard shortcut documentation
  return {
    shortcuts: [
      { key: '/', description: 'Focus search/filter input' },
      { key: '?', description: 'Open help modal' },
      { key: 'Esc', description: 'Close modals and dropdowns' },
    ],
  };
};
