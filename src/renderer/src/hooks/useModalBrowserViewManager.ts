import { useEffect, useRef } from 'react';

/**
 * Custom hook to manage BrowserView visibility when modals are open
 * Automatically hides all BrowserViews when any modal is open
 * and restores them when all modals are closed
 */
export function useModalBrowserViewManager(isAnyModalOpen: boolean) {
  const previousStateRef = useRef<boolean>(false);

  useEffect(() => {
    const handleModalStateChange = async () => {
      // Only act when the modal state actually changes
      if (previousStateRef.current === isAnyModalOpen) {
        return;
      }

      if (isAnyModalOpen) {
        // Hide browserview when modal opens
        try {
          await window.dockyard.browserView.hide();
        } catch (error) {
          console.error('Failed to hide BrowserView:', error);
        }
      }
      // Note: We don't automatically show the browserview when modals close
      // because the app needs to decide which view to show based on activeAppId

      previousStateRef.current = isAnyModalOpen;
    };

    handleModalStateChange();
  }, [isAnyModalOpen]);
}
