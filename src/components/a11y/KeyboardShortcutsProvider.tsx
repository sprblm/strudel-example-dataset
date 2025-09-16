import React from 'react';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useAppState } from '@/context/ContextProvider';
import { openHelpModal, closeAllModals } from '@/context/actions';

export const KeyboardShortcutsProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { dispatch } = useAppState();

  const handleFocusSearch = () => {
    // Try to find and focus the first filter input
    const filterInputs = document.querySelectorAll(
      '#filters input, #filters select'
    );
    const firstInput = filterInputs[0] as HTMLElement;
    if (firstInput) {
      firstInput.focus();
    }
  };

  const handleOpenHelp = () => {
    dispatch(openHelpModal());
  };

  const handleCloseModal = () => {
    dispatch(closeAllModals());
  };

  useKeyboardShortcuts({
    onFocusSearch: handleFocusSearch,
    onOpenHelp: handleOpenHelp,
    onCloseModal: handleCloseModal,
  });

  return <>{children}</>;
};
