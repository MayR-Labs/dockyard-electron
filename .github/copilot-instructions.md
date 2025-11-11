# Dockyard AI Coding Instructions

## Project Overview

Dockyard is an open-source, local-first multi-app workspace desktop application built with Electron. It's a privacy-focused alternative to Rambox/Station, allowing users to manage multiple web apps with session isolation, workspaces, and profiles—all without cloud sync or telemetry.

## Architecture & Structure

### Core Components
- **Main Process** (`src/main/`): Electron main process handling window management, IPC, and system integration
- **Renderer Process** (`src/renderer/`): React UI with Vite build system, TailwindCSS styling, and Framer Motion animations
- **Preload Scripts** (`src/preload/`): Secure IPC bridges between main and renderer processes
- **Shared Utilities** (`src/shared/`): TypeScript models, types, and utilities shared across processes

### Key Architectural Patterns
1. **Electron Partitions**: Each app instance runs in an isolated `partition` for session management. Workspaces can optionally share sessions via the same partition.
2. **Local-First Storage**: Use `electron-store` (or `lowdb`) for persisting profiles, workspaces, app configurations, and user preferences—all stored locally in JSON format.
3. **Multi-Instance Support**: Profiles allow running multiple Dockyard instances simultaneously with separate data stores.

## Development Workflow

### Setup & Running
```bash
npm install          # Install dependencies
npm run dev          # Start in development mode
npm run build        # Build production app
npm start            # Run with electron .
```

### Project Status
⚠️ **Early Stage**: Source code structure (`src/`) is not yet implemented. Focus on building the MVP with profiles, workspaces, and custom apps first.

## Core Concepts & Implementation Guidance

### 1. Profiles
- Independent workspace environments, like separate browser instances
- Each profile has its own data store (separate `electron-store` instance)
- Enable launching multiple Dockyard instances with `--profile=<name>` flag
- Store profile metadata in a root config file

### 2. Workspaces
- Groups of related apps (e.g., "Design," "Work," "Research")
- Workspace settings include: layout position, theme overrides, hibernation rules
- Implement quick-switch UI (Cmd/Ctrl+Tab) between workspaces
- Each workspace can have shared or isolated session partitions

### 3. App Management
- Apps are defined by: name, URL, icon (local or fetched favicon), custom CSS/JS injection
- Use Electron `<webview>` or `BrowserView` for embedding web apps
- Implement auto-hibernation via `webview.suspend()` after idle timeout (default 15 min)
- Support multiple instances per app with different partition names

### 4. Session Isolation
- Default: Each app instance gets unique partition: `persist:app-{appId}-{instanceId}`
- Workspace-shared sessions: Use `persist:workspace-{workspaceId}` for all apps in workspace
- Provide UI to clear cache/cookies per app

### 5. Notifications
- Forward webview notifications to native OS using Electron's `Notification` API
- Show badge counts on app icons via IPC from renderer
- Implement global "Do Not Disturb" toggle in settings

## Code Style & Conventions

- **TypeScript**: Use strict mode, define interfaces in `src/shared/types/`
- **EditorConfig**: 2-space indentation, LF line endings, UTF-8 encoding (see `.editorconfig`)
- **Component Structure**: Organize React components by feature (e.g., `renderer/components/AppDock/`, `renderer/components/Workspace/`)
- **IPC Naming**: Use namespaced channels like `profile:create`, `workspace:switch`, `app:hibernate`

## Testing Strategy (Planned)
- Unit tests: Jest for shared utilities and models
- Integration tests: Spectron or Playwright for Electron processes
- Manual testing checklist for hibernation, session isolation, and multi-profile launches

## Privacy & Security Principles
- **No Telemetry**: Never add analytics, crash reporting, or network calls to external services
- **Local-Only**: All data persists locally; avoid any cloud sync features
- **Sandboxing**: Consider enabling Electron's `sandbox: true` for webviews in future iterations

## Performance Considerations
- **Auto-Hibernation**: Implement idle detection using `setInterval` + `webview.isLoading()` checks
- **Lazy Loading**: Only create webviews when workspace/app is activated
- **Memory Limits**: Monitor and display memory usage per app in DevTools panel

## Future Extension Points
- **Plugin API**: Design IPC-based hooks for third-party extensions
- **Custom Themes**: JSON-based theme files with CSS variable overrides
- **App Store**: Local JSON catalog of curated apps, downloadable via GitHub releases

## Common Pitfalls
- **Webview vs. BrowserView**: Prefer `BrowserView` for better performance and modern Electron support
- **IPC Security**: Always validate IPC messages in main process; use `contextBridge` in preload scripts
- **Partition Naming**: Avoid hardcoding partition names—use helper functions that derive from app/workspace IDs

## External Dependencies (Planned)
- `electron-store` or `lowdb`: Local data persistence
- `tailwindcss`: Utility-first CSS framework
- `framer-motion`: Smooth UI animations
- `electron-builder`: Cross-platform packaging

## Useful Commands
```bash
npm run dev                    # Start development server
npm run build                  # Build for production
electron . --profile=work      # Launch with specific profile (when implemented)
```

## Questions for Clarification
- Should we use `BrowserView` or `<webview>` tags for app embedding?
- Preferred state management: React Context, Zustand, or Redux Toolkit?
- Hibernation triggers: Time-based only, or also memory threshold?
- Do workspaces need import/export functionality from day one?

---

**Philosophy**: Build for privacy, flexibility, and hackability. Every feature should enhance user control without sacrificing performance. Keep the codebase modular and well-documented for contributors.
