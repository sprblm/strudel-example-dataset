import React, { useEffect, useRef } from 'react';

interface FocusTrapProps {
  children: React.ReactNode;
  active?: boolean;
  restoreFocus?: boolean;
}

export const FocusTrap: React.FC<FocusTrapProps> = ({
  children,
  active = true,
  restoreFocus = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const lastActiveElementRef = useRef<Element | null>(null);

  useEffect(() => {
    if (!active) return;

    // Store the currently focused element
    lastActiveElementRef.current = document.activeElement;

    const focusableElementsSelector = [
      'a[href]',
      'button:not([disabled])',
      'textarea:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable]',
    ].join(', ');

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab' || !containerRef.current) return;

      const focusableElements = Array.from(
        containerRef.current.querySelectorAll(focusableElementsSelector)
      ).filter((element) => {
        const el = element as HTMLElement;
        return (
          el.offsetWidth > 0 &&
          el.offsetHeight > 0 &&
          !el.hidden &&
          el.tabIndex >= 0
        );
      }) as HTMLElement[];

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (!firstElement) return;

      if (event.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement?.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement?.focus();
        }
      }
    };

    // Focus the first focusable element when the trap activates
    const focusFirstElement = () => {
      if (!containerRef.current) return;

      const focusableElements = containerRef.current.querySelectorAll(
        focusableElementsSelector
      ) as NodeListOf<HTMLElement>;

      const firstElement = Array.from(focusableElements).find((element) => {
        return (
          element.offsetWidth > 0 &&
          element.offsetHeight > 0 &&
          !element.hidden &&
          element.tabIndex >= 0
        );
      });

      if (firstElement) {
        firstElement.focus();
      }
    };

    // Set up event listener and initial focus
    document.addEventListener('keydown', handleKeyDown);

    // Small delay to ensure modal is rendered
    const timeoutId = setTimeout(focusFirstElement, 100);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      clearTimeout(timeoutId);

      // Restore focus to the previously focused element
      if (restoreFocus && lastActiveElementRef.current) {
        (lastActiveElementRef.current as HTMLElement).focus?.();
      }
    };
  }, [active, restoreFocus]);

  return (
    <div ref={containerRef} style={{ outline: 'none' }}>
      {children}
    </div>
  );
};
