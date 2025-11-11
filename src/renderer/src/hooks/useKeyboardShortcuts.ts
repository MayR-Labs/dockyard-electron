import { useEffect } from 'react';
import { useStore } from '../store/useStore';

export function useKeyboardShortcuts() {
  const { workspaces, currentWorkspace, switchWorkspace } = useStore();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const modKey = isMac ? event.metaKey : event.ctrlKey;

      // Cmd/Ctrl + Tab - Next workspace
      if (modKey && event.key === 'Tab' && !event.shiftKey) {
        event.preventDefault();
        if (workspaces.length > 0 && currentWorkspace) {
          const currentIndex = workspaces.findIndex(
            (w) => w.id === currentWorkspace.id
          );
          const nextIndex = (currentIndex + 1) % workspaces.length;
          switchWorkspace(workspaces[nextIndex].id);
        }
      }

      // Cmd/Ctrl + Shift + Tab - Previous workspace
      if (modKey && event.key === 'Tab' && event.shiftKey) {
        event.preventDefault();
        if (workspaces.length > 0 && currentWorkspace) {
          const currentIndex = workspaces.findIndex(
            (w) => w.id === currentWorkspace.id
          );
          const prevIndex =
            (currentIndex - 1 + workspaces.length) % workspaces.length;
          switchWorkspace(workspaces[prevIndex].id);
        }
      }

      // Cmd/Ctrl + 1-9 - Switch to workspace by number
      if (modKey && event.key >= '1' && event.key <= '9') {
        event.preventDefault();
        const index = parseInt(event.key) - 1;
        if (index < workspaces.length) {
          switchWorkspace(workspaces[index].id);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [workspaces, currentWorkspace, switchWorkspace]);
}
