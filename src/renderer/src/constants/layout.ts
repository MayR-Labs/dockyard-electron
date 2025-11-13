/**
 * Layout Constants
 * Defines fixed dimensions for UI chrome elements to ensure proper z-layer separation
 * between React UI and Electron BrowserView
 */

export const LAYOUT_CONSTANTS = {
  /**
   * Window chrome height at the top of the window
   * Used for profile selector and workspace name display
   */
  WINDOW_CHROME_HEIGHT: 48, // h-12 in Tailwind (3rem = 48px)

  /**
   * Status bar height at the bottom of the window
   * Used for memory usage, DND toggle, and other status info
   */
  STATUS_BAR_HEIGHT: 32, // h-8 in Tailwind (2rem = 32px)

  /**
   * App tile toolbar height
   * Used for navigation controls and URL bar within each app view
   */
  APP_TOOLBAR_HEIGHT: 40, // h-10 in Tailwind (2.5rem = 40px)

  /**
   * Layout controls height (when multiple apps are shown)
   * Used for split layout mode controls
   */
  LAYOUT_CONTROLS_HEIGHT: 40, // h-10 in Tailwind

  /**
   * Sidebar width when open
   */
  SIDEBAR_WIDTH: 240, // Approximate width from CSS

  /**
   * Sidebar collapsed width
   */
  SIDEBAR_COLLAPSED_WIDTH: 0,

  /**
   * Default dock size (can be overridden per workspace)
   */
  DEFAULT_DOCK_SIZE: 64,

  /**
   * Z-index layers for proper stacking
   * BrowserView is rendered by Electron above everything, so we manage
   * its visibility rather than z-index
   */
  Z_INDEX: {
    BASE: 0, // Base content layer
    SIDEBAR: 10, // Sidebar
    DOCK: 10, // Dock
    MODAL_BACKDROP: 40, // Modal backdrop
    MODAL: 50, // Modal content
    CONTEXT_MENU: 60, // Context menus
    TOOLTIP: 70, // Tooltips
  },
} as const;

/**
 * Calculate the total vertical offset for BrowserView positioning
 * This accounts for window chrome and app toolbar
 */
export function getBrowserViewVerticalOffset(): number {
  return LAYOUT_CONSTANTS.WINDOW_CHROME_HEIGHT + LAYOUT_CONSTANTS.APP_TOOLBAR_HEIGHT;
}

/**
 * Calculate the total vertical space reserved by UI chrome
 * This includes window chrome, app toolbar, and status bar
 */
export function getTotalVerticalChromeHeight(): number {
  return (
    LAYOUT_CONSTANTS.WINDOW_CHROME_HEIGHT +
    LAYOUT_CONSTANTS.APP_TOOLBAR_HEIGHT +
    LAYOUT_CONSTANTS.STATUS_BAR_HEIGHT
  );
}

/**
 * Calculate horizontal offset based on dock position
 */
export function getDockOffset(
  dockPosition: 'top' | 'bottom' | 'left' | 'right',
  dockSize: number
): { left: number; right: number; top: number; bottom: number } {
  const offset = { left: 0, right: 0, top: 0, bottom: 0 };

  switch (dockPosition) {
    case 'left':
      offset.left = dockSize;
      break;
    case 'right':
      offset.right = dockSize;
      break;
    case 'top':
      offset.top = dockSize;
      break;
    case 'bottom':
      offset.bottom = dockSize;
      break;
  }

  return offset;
}
