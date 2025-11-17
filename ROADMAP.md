# **Dockyard Development Roadmap**

This roadmap outlines the phased development plan for Dockyard, an open-source, local-first multi-app workspace desktop application.

---

## 🎯 **Vision & Goals**

Build a privacy-focused, flexible desktop workspace that allows users to:

- Manage multiple web apps in one unified environment
- Maintain complete control over their data and workflow
- Customize every aspect of their workspace
- Run completely offline without telemetry or cloud dependencies

---

## 📍 **Current Status**

**Phase**: Beta / Phase 5 Complete
**Version**: 0.6.0 (Phase 5: Theming & Customization - 100% complete)

The application now has:

- ✅ Complete Phase 1: Core Architecture (TypeScript, React, Electron, Zustand)
- ✅ Complete Phase 2: Workspace & App Management (100%)
- 🚧 Phase 3: Session Management & Performance (85%)
- ✅ Complete Phase 4: Notifications & Layout (100%)
- ✅ Complete Phase 5: Theming & Customization (100%)
- ✅ Profile management system with multi-instance support
- ✅ Local data persistence with electron-store
- ✅ Modern UI with proper layout (WindowChrome, Dock, Sidebar, Canvas, StatusBar)
- ✅ Workspace creation and switching with keyboard shortcuts
- ✅ App management UI with context menus and settings
- ✅ Native OS notifications with badge counts
- ✅ Multi-app split layout (horizontal, vertical, grid)
- ✅ Per-app zoom controls
- ✅ BrowserView manager with full lifecycle management
- ✅ Session isolation with per-app partitions
- ✅ Auto-hibernation system (15-min idle timeout)
- ✅ Performance monitoring (memory/CPU tracking)
- ✅ DevTools UI (Performance Dashboard, Session Manager)
- ✅ Comprehensive theming system (light/dark/system modes)
- ✅ Custom accent colors and background styles
- ✅ Per-app CSS/JS injection for customization

---

## 🚀 **Development Phases**

### **Phase 0: Foundation** ✅ _[Complete]_

**Goal**: Establish project structure and tooling

- [x] Repository initialization
- [x] Electron + Electron Forge setup
- [x] Project documentation (README, ABOUT, FEATURES)
- [x] Coding guidelines and instructions
- [x] Coming Soon page
- [x] Complete project structure (`src/main/`, `src/renderer/`, `src/preload/`, `src/shared/`)
- [x] Development tooling (TypeScript config)
- [x] Build and packaging configuration

**Target**: Q4 2024
**Status**: ✅ 100% Complete

---

### **Phase 1: MVP - Core Architecture** ✅ _[Complete]_

**Goal**: Build the foundational architecture for profiles, workspaces, and apps

#### 1.1 Basic Electron Architecture

- [x] Set up TypeScript configuration
- [x] Implement main process structure
- [x] Create preload scripts for IPC security
- [x] Set up React + Vite for renderer process
- [x] Configure TailwindCSS and styling system
- [x] Establish IPC communication patterns

#### 1.2 Data Layer

- [x] Implement `electron-store` for local persistence
- [x] Design data schemas for profiles, workspaces, and apps
- [x] Create data access layer and utilities
- [ ] Implement backup and restore functionality (deferred to Phase 7)

#### 1.3 Profile Management

- [x] Profile creation and deletion
- [x] Profile switching and multi-instance support
- [x] Command-line argument handling (`--profile=<name>`)
- [x] Profile-specific data isolation

#### 1.4 Basic UI Shell

- [x] Main window layout structure
- [x] Top bar with basic navigation
- [x] Settings panel foundation
- [x] Modal system for dialogs

**Target**: Q1 2025
**Status**: ✅ 100% Complete (November 2024)

---

### **Phase 2: Workspace & App Management** ✅ _[Complete - 100%]_

**Goal**: Enable users to create workspaces and add apps

#### 2.1 Workspace System

- [x] Workspace creation, editing, and deletion
- [x] Workspace switching (keyboard shortcuts: Cmd/Ctrl+1-9)
- [x] Workspace-level settings (theme, layout, hibernation)
- [x] Workspace session management (shared vs isolated)
- [x] Sidebar with workspace list and quick navigation
- [x] Welcome screen for first-time users

#### 2.2 App Management

- [x] Add custom apps by URL
- [x] Built-in app catalog/templates (popular apps quick-add)
- [x] Favicon fetching and custom icon upload
- [x] App instance creation (multiple instances per app)
- [x] App editing and deletion

#### 2.3 App Embedding

- [x] Implement BrowserView for app embedding
- [x] Session partition management
- [x] Navigation controls (back, forward, reload)
- [x] URL bar and security indicators
- [x] Complete integration with WorkspaceCanvas

#### 2.4 App UI Components

- [x] App dock/sidebar with icons
- [x] Dock positioning (top, bottom, left, right)
- [x] Dock icon badges for multiple instances
- [x] App tile with micro-toolbar
- [x] Empty states and placeholders
- [x] Drag-and-drop app reordering
- [x] App context menu (settings, close, etc.)

**Target**: Q1 2025
**Status**: ✅ 100% Complete (November 2024)

---

### **Phase 3: Session Management & Performance** 🚧 _[In Progress - 85% Complete]_

**Goal**: Implement session isolation, auto-hibernation, and performance optimization

#### 3.1 Session Isolation

- [x] Per-app partition implementation (`persist:app-{appId}-{instanceId}`)
- [ ] Workspace-shared sessions (`persist:workspace-{workspaceId}`)
- [x] Session management UI
- [x] Clear cache/cookies per app

#### 3.2 Auto-Hibernation

- [x] Idle detection system
- [x] Auto-suspend inactive apps (default 15 min)
- [x] Smart resume on app activation
- [ ] Hibernation settings per app/workspace (UI pending)

#### 3.3 Performance Monitoring

- [x] Memory usage tracking per app
- [x] CPU usage monitoring
- [x] Performance dashboard in DevTools
- [x] Real-time metrics with auto-refresh
- [ ] Resource usage warnings (thresholds)

#### 3.4 Developer Tools

- [x] Per-app DevTools toggle
- [x] Performance monitoring dashboard
- [x] Session manager UI
- [ ] IPC event debugger (planned)
- [ ] Advanced webview state inspector (planned)

**Target**: Q2-Q3 2025 (ahead of schedule)
**Status**: 🚧 85% Complete (November 2024)

---

### **Phase 4: Notifications & Layout** ✅ _[Complete]_

**Goal**: Implement native notifications and advanced layout features

#### 4.1 Notifications

- [x] Native OS notifications via Electron API
- [x] Per-app notification badges
- [x] Global "Do Not Disturb" toggle
- [x] Notification preferences per app

#### 4.2 Advanced Layout

- [x] Multi-app tiling (side-by-side views)
- [x] Split layout save and restore
- [ ] Detachable windows (deferred to Phase 6)
- [x] Resizable panels

#### 4.3 Zoom & Display

- [x] Per-app zoom level controls
- [ ] Multi-display support (deferred to Phase 6)
- [ ] Full-screen mode per app (deferred to Phase 6)

**Target**: Q3 2025
**Status**: ✅ 100% Complete (November 2024)

---

### **Phase 5: Theming & Customization** ✅ _[Complete - 100%]_

**Goal**: Provide comprehensive theming and customization options

#### 5.1 Theme System

- [x] Light, dark, and system theme modes
- [x] Custom accent colors
- [x] Background styles (glass, solid, minimal)
- [x] Theme presets
- [x] Runtime theme overrides ensure mode, color, and background changes immediately restyle the UI (Nov 2025 bugfix)

#### 5.2 Custom Styling

- [x] Per-app custom CSS injection
- [x] Custom JavaScript injection for apps
- [ ] Theme import/export (deferred to Phase 8)

#### 5.3 UI Customization

- [x] Customizable keyboard shortcuts (infrastructure in place)
- [ ] Layout templates (deferred to Phase 6)
- [ ] Icon customization (deferred to Phase 6)

**Target**: Q4 2025 (completed ahead of schedule)
**Status**: ✅ 100% Complete (November 2024)

---

### **Phase 6: Productivity Features** 🗓️ _[Planned]_

**Goal**: Add productivity enhancements and power-user features

#### 6.1 Focus Mode

- [ ] Temporarily hide/mute distracting apps
- [ ] Focus timer integration
- [ ] Focus mode profiles

#### 6.2 Quick Launcher

- [ ] Global quick launcher (Ctrl/Cmd + Space)
- [ ] Fuzzy search for apps and workspaces
- [ ] Recent apps and quick actions

#### 6.3 Automation

- [ ] Simple automation rules (e.g., auto-mute music)
- [ ] Scheduled actions
- [ ] Event-based triggers

#### 6.4 Workspace Templates

- [ ] Predefined workspace configurations
- [ ] Community-shared templates
- [ ] Template import/export

**Target**: Q1 2026
**Status**: Not Started

---

### **Phase 7: Backup, Sync & Export** 🗓️ _[Planned]_

**Goal**: Enable data portability and backup solutions

#### 7.1 Backup System

- [ ] Local backup to JSON/ZIP
- [ ] Automatic backup scheduling
- [ ] Backup restoration UI

#### 7.2 Folder-Based Sync

- [ ] Export profiles and workspaces to folder
- [ ] Sync via Dropbox, Google Drive, etc.
- [ ] Import from synced folder

#### 7.3 Data Portability

- [ ] Profile export/import
- [ ] Workspace export/import
- [ ] Settings migration tools

**Target**: Q2 2026
**Status**: Not Started

---

### **Phase 8: Community & Extensibility** 🧪 _[Experimental]_

**Goal**: Build an ecosystem around Dockyard

#### 8.1 App Store

- [ ] Local JSON catalog of curated apps
- [ ] Community-contributed apps
- [ ] App discovery and installation

#### 8.2 Plugin API

- [ ] IPC-based plugin hooks
- [ ] Plugin development documentation
- [ ] Example plugins

#### 8.3 Theme Marketplace

- [ ] Community theme sharing
- [ ] Theme installation from URL
- [ ] Theme rating and discovery

#### 8.4 Documentation & Tutorials

- [ ] User guide
- [ ] Developer documentation
- [ ] Video tutorials
- [ ] Community forum/Discord

**Target**: Q3-Q4 2026
**Status**: Not Started

---

## 🧪 **Experimental Features** (Future Exploration)

These features are under consideration but not yet scheduled:

- **Cross-Instance Collaboration**: Share workspace state over LAN
- **Mobile Companion App**: Remote control and notifications
- **Cloud Sync Option**: Optional encrypted cloud backup
- **AI Assistant Integration**: Workspace optimization suggestions
- **Advanced Security**: Hardware key support, encrypted sessions
- **Custom Protocols**: Handle custom URL schemes

---

## 📊 **Success Metrics**

### Alpha Release (Phase 1-2 Complete)

- Basic app management works reliably
- At least 10 beta testers actively using it
- Core features are stable

### Beta Release (Phase 3-5 Complete)

- 100+ active users
- Performance meets targets (smooth with 10+ apps)
- No critical bugs in core functionality

### v1.0 Release (Phase 6-7 Complete)

- 1,000+ active users
- Community contributions (issues, PRs, themes)
- Cross-platform builds for Windows, macOS, Linux
- Positive feedback on privacy and performance

### v2.0 Release (Phase 8+ Complete)

- Active plugin/theme ecosystem
- 10,000+ downloads
- Self-sustaining community

---

## 🤝 **How to Contribute**

We welcome contributions at every phase:

1. **Phase 0-1**: Help with architecture decisions and code reviews
2. **Phase 2-3**: Contribute features and bug fixes
3. **Phase 4+**: Build plugins, themes, and app templates
4. **All Phases**: Documentation, testing, and feedback

See [CONTRIBUTING.md](CONTRIBUTING.md) (coming soon) for detailed guidelines.

---

## 📅 **Release Schedule**

| Release         | Target Date | Key Features                               |
| --------------- | ----------- | ------------------------------------------ |
| v0.1.0 (Alpha)  | Q1 2025     | Profiles, Basic Workspaces, App Management |
| v0.2.0 (Alpha)  | Q2 2025     | Session Isolation, Auto-Hibernation        |
| v0.5.0 (Beta)   | Q3 2025     | Notifications, Layout, Theming             |
| v0.8.0 (Beta)   | Q4 2025     | Productivity Features, Polish              |
| v1.0.0 (Stable) | Q1 2026     | Backup/Export, Production Ready            |
| v2.0.0 (Mature) | Q3 2026+    | Plugins, App Store, Ecosystem              |

_Note: Dates are aspirational and subject to change based on community feedback and development progress._

---

## 💬 **Feedback & Discussion**

Have ideas or suggestions for the roadmap? We'd love to hear from you!

- **GitHub Issues**: [Feature Requests](https://github.com/MayR-Labs/dockyard-electron/issues)
- **Discussions**: [GitHub Discussions](https://github.com/MayR-Labs/dockyard-electron/discussions)

---

**Last Updated**: November 2024
**Next Review**: January 2025
