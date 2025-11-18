# DESIGN.md

This document describes the UI/UX and layout for **Dockyard**. It explains user flows, visual structure, interaction patterns, and UI components so engineers, designers and contributors can implement a consistent, usable product.

---

# Overview

Dockyard organises web apps inside a single desktop shell. The UI is a flexible dock + workspace canvas where users add apps, tile them, and switch contexts using profiles and workspaces.

Goals:

- Fast to navigate (keyboard-focused paths + quick launcher)
- Highly customisable layout (dock position, theme, accent)
- Clear session boundaries and state visibility (hibernation, shared sessions)
- Minimal visual noise; apps are the primary content

---

# Global Layout

Top-level pieces (always present unless hidden by user preference):

- **Window chrome** — native title bar (or frameless with a minimal custom bar on macOS/Windows) with: profile selector, current workspace name, global search/launcher, window controls.
- **Dock** — app icons arranged on one of four edges (top, bottom, left, right). Configurable orientation, size, and density.
- **Workspace Canvas** — main area showing app webviews, tiles and split layouts.
- **Sidebar (optional)** — shows workspace list, workspaces quick-actions, and utilities (backups, imports, settings).
- **Footer / Status Bar** — small strip for app-level notifications, hibernation status, memory usage summary and Do Not Disturb toggle.

Visual hierarchy: workspace canvas > dock icons > sidebar > chrome > footer.

---

# Key Screens & Modes

## 1. Profile Selector (entry)

- Compact dropdown in top-left of chrome.
- Create, clone, rename, delete and open profile in new window.
- Each profile has its own theme, apps and workspaces.

## 2. Workspace View (default)

- Workspace header with name, quick-switch, layout presets and share-session toggle.
- Grid canvas where apps are laid out. Each app occupies a **tile** (resizable).
- Toolbar per tile with: title, instance selector, pin, hibernate, detach, settings, close.
- Dock persists with icons for apps available in the current profile; clicking focuses/open toggles show/hide.

## 3. App Add / Configure Modal

- Search curated apps or enter custom URL.
- Fields: name, url, icon (upload or auto-favicon), partition/session option, initial zoom, custom CSS/JS injection.
- Save adds app to profile; also offers “add to workspace” checkbox.

## 4. Tiling & Split Layout Mode

- Enter "layout edit" mode to drag tile edges and snap to common presets (split vertical/horizontal, 3-up, grid).
- Save layout as named preset for workspace.

## 5. Quick Launcher Overlay

- Global shortcut (Ctrl/Cmd+Space) opens full-screen overlay.
- Type-to-search across apps, workspaces, profiles and recent actions.
- Showing keyboard hints: Enter to open, Shift+Enter to open in new window, numbers to quick-jump pinned favourites.

## 6. Preferences / Settings

- Sections: General, Appearance, Dock, Hibernation & Performance, Notifications, Backups, Dev Mode, Import/Export, About.
- Each section with toggles, sliders and preview area for theme changes.

---

# Components & Patterns

## Dock

- Icon-only by default; hover shows label tooltip.
- Right-click context menu on icon: Open, New instance, Add to workspace, Pin/Unpin, Remove.
- Long-press (or secondary click) shows instance selection if multiple instances exist.

## Tile (App Container)

- Webview fills tile; top of tile has micro-toolbar (auto-hide).
- Micro-toolbar actions (from left): instance indicator, title, badge, controls (hibernate, detach, settings, close).
- Tile states: Active, Background (visible but not focused), Hibernating (frozen snapshot), Disconnected (offline), Crashed.
- Visual cue for hibernation: dimmed overlay with “resume” button.

## Instance Management

- Instance picker displayed as small dropdown in tile toolbar.
- Creating an instance duplicates the app entry with its own partition identifier.
- Instances can be renamed for clarity (e.g., “GitHub — Work”, “GitHub — Personal”).

## Notifications

- Native OS notifications for actionable events (messages, calls).
- Per-app badge numbers on dock icon; optional global unified badge.
- Do Not Disturb at top chrome disables OS toasts and badges.

## Onboarding

- First-run wizard: choose profile name, pick starter workspace templates, import from browser (optional).
- Short tour overlay that highlights dock, workspace switcher, and quick launcher.

---

# Interaction & Accessibility

## Keyboard-first Principles

- Global shortcuts (customisable):
  - Open quick launcher: Ctrl/Cmd + Space
  - Switch workspace: Ctrl/Cmd + 1..9
  - Focus dock: Ctrl/Cmd + L
  - Toggle sidebar: Ctrl/Cmd + B
  - New instance: Ctrl/Cmd + Shift + N
  - Toggle DND: Ctrl/Cmd + Shift + D

- Focus ring visible for keyboard navigation.
- All actions accessible via keyboard; avoid modal traps.

## Mouse & Touch

- Drag-and-drop apps into workspace.
- Touch gestures supported on touch-enabled devices for drag and resize.
- Right-click menus for contextual actions.

## Accessibility

- Semantic HTML for renderer UI (where possible).
- ARIA labels for all interactive elements.
- High contrast theme option.
- Screen reader support for main UI controls (profile, workspace, add app, tile controls).
- Respect system font-size and provide zoom scaling.

---

# Visual Style & Theming

- **Minimal, flat aesthetic** with subtle elevation for tiles. Visual focus stays on site content (webviews).
- **Theme system**:
  - Light / Dark / System
  - Accent colour (user selectable)
  - Optional glass/blur background

- **Iconography**: simple, consistent glyph set for controls. Use site favicons for apps.
- **Motion**: conservative, purposeful animations (Framer Motion). Keep animations short (<= 200ms).
- **Spacing**: roomy by default but compact density option available.

---

# Behavioural Rules & Edge Cases

- **Session isolation**: each instance runs in its own Electron partition by default.
- **Shared session option**: workspace-level toggle to share partition among apps (explicit confirmation).
- **Auto-hibernation**:
  - Default: 15 minutes idle.
  - Pause countdown if app is playing audio or user is interacting.
  - Resume instantly on focus or via keyboard shortcut.

- **Crash handling**:
  - If webview crashes show in-tile error with reload and open-devtools actions.

- **Network loss**:
  - Show offline indicator on the tile; allow reconnect attempt.

- **Storage limits**:
  - Warn if profile storage exceeds a threshold; offer cleanup options (clear cache for selected apps).

---

# Data Model (brief)

Represent for UI implementation reference:

- Profile
  - id, name, theme, createdAt, settings

- Workspace
  - id, profileId, name, layoutPreset, shareSession, settings

- AppEntry
  - id, profileId, name, baseUrl, iconPath, customCss, customJs, defaultZoom

- Instance
  - id, appEntryId, partitionId, name, lastActiveAt, hibernationSetting

- Layout
  - workspaceId, tilePositions, savedPresetName

---

# Developer / Debugging UX

- **Dev Mode** toggle in Preferences enabling:
  - Webview DevTools per tile
  - IPC inspector panel in sidebar
  - Verbose logging controls

- **Import/Export**: JSON export of profile and workspace for reproducible setups; import validates schema.

---

# Recommended UX Flows

1. **Add App to Workspace**
   - User clicks + on dock or workspace header → modal opens → search or paste URL → confirm → app icon appears on dock and tile added to workspace.

2. **Create New Instance**
   - Right-click dock icon → New Instance → choose partition/session options → instance opens as an extra tile.

3. **Save Layout**
   - Arrange tiles → click layout save in workspace header → name preset → available in layout dropdown.

4. **Resume Hibernated App**
   - Click the dimmed tile → quick resume animation → app restores to active state; background tasks reinitialise.

---

# Small UX Decisions (opinionated)

- Use **auto-favicon** as default icon but always allow explicit upload — favicons can be poor quality.
- Hibernation should not drop cookies/storage — only unload webview to reclaim resources.
- Keep the dock visible by default; hide-on-inactive is an advanced preference.
- Avoid heavy global overlays; use a single full-screen quick launcher only.

---

# Final Notes

Design for clarity and speed. The webview content is the hero — Dockyard should feel like a lightweight, obedient shell around beloved apps. Keep defaults sensible, make advanced options discoverable but not intrusive, and favour local-first privacy.

Implementation-ready assets and small interactive prototypes (Figma frames, SVG icon set, theme tokens) should follow from this document when you start building UI components.
