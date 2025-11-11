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

**Phase**: Pre-Alpha / Planning
**Version**: 0.1.0 (Coming Soon page implemented)

The repository structure is established with:
- Basic Electron setup with Electron Forge
- Coming Soon landing page
- Project documentation (README, ABOUT, FEATURES)
- Development guidelines and coding instructions

---

## 🚀 **Development Phases**

### **Phase 0: Foundation** ✅ *[Current Phase]*

**Goal**: Establish project structure and tooling

- [x] Repository initialization
- [x] Electron + Electron Forge setup
- [x] Project documentation (README, ABOUT, FEATURES)
- [x] Coding guidelines and instructions
- [x] Coming Soon page
- [ ] Complete project structure (`src/main/`, `src/renderer/`, `src/preload/`, `src/shared/`)
- [ ] Development tooling (ESLint, Prettier, TypeScript config)
- [ ] Build and packaging configuration

**Target**: Q4 2024
**Status**: 70% Complete

---

### **Phase 1: MVP - Core Architecture** 🚧 *[Next Phase]*

**Goal**: Build the foundational architecture for profiles, workspaces, and apps

#### 1.1 Basic Electron Architecture
- [ ] Set up TypeScript configuration
- [ ] Implement main process structure
- [ ] Create preload scripts for IPC security
- [ ] Set up React + Vite for renderer process
- [ ] Configure TailwindCSS and styling system
- [ ] Establish IPC communication patterns

#### 1.2 Data Layer
- [ ] Implement `electron-store` for local persistence
- [ ] Design data schemas for profiles, workspaces, and apps
- [ ] Create data access layer and utilities
- [ ] Implement backup and restore functionality

#### 1.3 Profile Management
- [ ] Profile creation and deletion
- [ ] Profile switching and multi-instance support
- [ ] Command-line argument handling (`--profile=<name>`)
- [ ] Profile-specific data isolation

#### 1.4 Basic UI Shell
- [ ] Main window layout structure
- [ ] Top bar with basic navigation
- [ ] Settings panel foundation
- [ ] Modal system for dialogs

**Target**: Q1 2025
**Status**: Not Started

---

### **Phase 2: Workspace & App Management** 🗓️ *[Planned]*

**Goal**: Enable users to create workspaces and add apps

#### 2.1 Workspace System
- [ ] Workspace creation, editing, and deletion
- [ ] Workspace switching (keyboard shortcuts)
- [ ] Workspace-level settings (theme, layout, hibernation)
- [ ] Workspace session management (shared vs isolated)

#### 2.2 App Management
- [ ] Add custom apps by URL
- [ ] Built-in app catalog/templates
- [ ] Favicon fetching and custom icon upload
- [ ] App instance creation (multiple instances per app)
- [ ] App editing and deletion

#### 2.3 App Embedding
- [ ] Implement BrowserView for app embedding
- [ ] Session partition management
- [ ] Navigation controls (back, forward, reload)
- [ ] URL bar and security indicators

#### 2.4 App UI Components
- [ ] App dock/sidebar with icons
- [ ] Dock positioning (top, bottom, left, right)
- [ ] Drag-and-drop app reordering
- [ ] App context menu (settings, close, etc.)

**Target**: Q2 2025
**Status**: Not Started

---

### **Phase 3: Session Management & Performance** 🗓️ *[Planned]*

**Goal**: Implement session isolation, auto-hibernation, and performance optimization

#### 3.1 Session Isolation
- [ ] Per-app partition implementation (`persist:app-{appId}-{instanceId}`)
- [ ] Workspace-shared sessions (`persist:workspace-{workspaceId}`)
- [ ] Session management UI
- [ ] Clear cache/cookies per app

#### 3.2 Auto-Hibernation
- [ ] Idle detection system
- [ ] Auto-suspend inactive apps (default 15 min)
- [ ] Smart resume on app activation
- [ ] Hibernation settings per app/workspace

#### 3.3 Performance Monitoring
- [ ] Memory usage tracking per app
- [ ] CPU usage monitoring
- [ ] Performance dashboard in DevTools
- [ ] Resource usage warnings

#### 3.4 Developer Tools
- [ ] Per-app DevTools toggle
- [ ] IPC event debugger
- [ ] Webview state inspector

**Target**: Q2-Q3 2025
**Status**: Not Started

---

### **Phase 4: Notifications & Layout** 🗓️ *[Planned]*

**Goal**: Implement native notifications and advanced layout features

#### 4.1 Notifications
- [ ] Native OS notifications via Electron API
- [ ] Per-app notification badges
- [ ] Global "Do Not Disturb" toggle
- [ ] Notification preferences per app

#### 4.2 Advanced Layout
- [ ] Multi-app tiling (side-by-side views)
- [ ] Split layout save and restore
- [ ] Detachable windows
- [ ] Resizable panels and floating windows

#### 4.3 Zoom & Display
- [ ] Per-app zoom level controls
- [ ] Multi-display support
- [ ] Full-screen mode per app

**Target**: Q3 2025
**Status**: Not Started

---

### **Phase 5: Theming & Customization** 🗓️ *[Planned]*

**Goal**: Provide comprehensive theming and customization options

#### 5.1 Theme System
- [ ] Light, dark, and system theme modes
- [ ] Custom accent colors
- [ ] Background styles (glass, solid, minimal)
- [ ] Theme presets

#### 5.2 Custom Styling
- [ ] Per-app custom CSS injection
- [ ] Custom JavaScript injection for apps
- [ ] Theme import/export

#### 5.3 UI Customization
- [ ] Customizable keyboard shortcuts
- [ ] Layout templates
- [ ] Icon customization

**Target**: Q4 2025
**Status**: Not Started

---

### **Phase 6: Productivity Features** 🗓️ *[Planned]*

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

### **Phase 7: Backup, Sync & Export** 🗓️ *[Planned]*

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

### **Phase 8: Community & Extensibility** 🧪 *[Experimental]*

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

| Release | Target Date | Key Features |
|---------|-------------|--------------|
| v0.1.0 (Alpha) | Q1 2025 | Profiles, Basic Workspaces, App Management |
| v0.2.0 (Alpha) | Q2 2025 | Session Isolation, Auto-Hibernation |
| v0.5.0 (Beta) | Q3 2025 | Notifications, Layout, Theming |
| v0.8.0 (Beta) | Q4 2025 | Productivity Features, Polish |
| v1.0.0 (Stable) | Q1 2026 | Backup/Export, Production Ready |
| v2.0.0 (Mature) | Q3 2026+ | Plugins, App Store, Ecosystem |

*Note: Dates are aspirational and subject to change based on community feedback and development progress.*

---

## 💬 **Feedback & Discussion**

Have ideas or suggestions for the roadmap? We'd love to hear from you!

- **GitHub Issues**: [Feature Requests](https://github.com/MayR-Labs/dockyard-electron/issues)
- **Discussions**: [GitHub Discussions](https://github.com/MayR-Labs/dockyard-electron/discussions)

---

**Last Updated**: November 2024
**Next Review**: January 2025
