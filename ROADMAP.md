# **Dockyard Development Roadmap**

This roadmap outlines the development phases for Dockyard, a flexible, open-source multi-app workspace built for power users. The project will be built incrementally with TypeScript, Electron, React, and modern web technologies.

---

## **Phase 1: Foundation & MVP** 🚧

**Goal:** Establish core architecture and deliver minimum viable product with essential features.

### Milestone 1.1: Project Setup & Architecture ✅
- [x] Initialize Electron + TypeScript project structure
- [x] Set up Vite + React for renderer process
- [x] Configure TypeScript strict mode and tsconfig
- [x] Implement modular folder structure (`main/`, `renderer/`, `preload/`, `shared/`)
- [x] Set up TailwindCSS for styling
- [x] Configure Framer Motion for animations
- [x] Set up electron-store for local persistence
- [x] Create build and dev scripts
- [x] Set up linting (ESLint) and formatting (Prettier)

**Deliverables:** ✅
- ✅ Working dev environment with hot reload
- ✅ Basic window management
- ✅ TypeScript compilation pipeline

### Milestone 1.2: Profile System 🚧
- [x] Design Profile data model and storage schema
- [x] Implement profile creation, deletion, and switching
- [ ] Create profile selector UI
- [x] Enable multi-instance launches with `--profile=<name>` flag (backend support)
- [x] Implement profile-specific data stores
- [ ] Build profile settings panel

**Deliverables:**
- ✅ Functional profile management (backend)
- 🚧 Ability to run multiple Dockyard instances simultaneously

### Milestone 1.3: Workspace Management ✅
- [x] Design Workspace data model
- [x] Implement workspace CRUD operations
- [x] Create workspace switcher UI (sidebar/tabs)
- [ ] Implement quick-switch shortcut (Cmd/Ctrl+Tab)
- [x] Build workspace settings (name, icon, theme)
- [ ] Add workspace import/export functionality

**Deliverables:**
- ✅ Working workspace organization system
- 🚧 Quick workspace navigation (UI complete, shortcuts pending)

### Milestone 1.4: App Integration ✅
- [x] Design App data model (name, URL, icon, settings)
- [x] Implement BrowserView integration
- [x] Create app addition UI (custom URL + curated apps)
- [ ] Implement favicon fetching for custom apps
- [x] Build app list management (add, edit, remove)
- [x] Create app dock UI with icon display
- [x] Implement app switching and loading states

**Deliverables:**
- ✅ Functional app embedding and navigation
- ✅ Custom app addition capability

### Milestone 1.5: Session Isolation ✅
- [x] Implement partition-based session isolation
- [x] Create unique partitions per app instance
- [x] Add workspace-shared session option
- [ ] Build session management UI (clear cache/cookies)
- [x] Implement multiple app instances with separate sessions

**Deliverables:**
- ✅ Isolated sessions for privacy and multi-account support
- 🚧 Session management controls (backend ready, UI pending)

---

## **Phase 2: Performance & Notifications** ✅

**Goal:** Add performance optimizations and notification handling.

### Milestone 2.1: Auto-Hibernation ✅
- [x] Implement idle detection system
- [x] Build auto-suspend logic for inactive apps (default 15 min)
- [x] Create smart resume on app switch
- [x] Add per-app hibernation settings
- [x] Implement memory usage monitoring
- [x] Build performance dashboard

**Deliverables:** ✅
- Automatic resource management via HibernationManager
- Configurable hibernation rules with timeout and exclusions
- Tracks app activity and hibernates inactive apps
- IPC handlers for configuration and monitoring

### Milestone 2.2: Notifications ✅
- [x] Forward webview notifications to native OS
- [x] Implement per-app badge counts
- [x] Create notification settings panel (backend ready)
- [x] Add global "Do Not Disturb" mode
- [x] Build notification history/log

**Deliverables:** ✅
- Native notification integration via NotificationManager
- Per-app badge tracking and clearing
- Notification history (last 50 notifications)
- Do Not Disturb mode configuration
- IPC handlers for all notification features

---

## **Phase 3: Customization & Theming** 🗓️

**Goal:** Deliver comprehensive customization options and visual polish.

### Milestone 3.1: Layout Customization
- [ ] Implement dock positioning (top, bottom, left, right)
- [ ] Add drag-and-drop app reordering
- [ ] Create split-screen/tiling layouts
- [ ] Build layout presets and templates
- [ ] Add resizable panels

**Deliverables:**
- Flexible layout system
- User-defined workspace arrangements

### Milestone 3.2: Theming Engine
- [ ] Implement light/dark/system theme switching
- [ ] Create color picker for accent colors
- [ ] Build CSS variable-based theming system
- [ ] Design and implement theme presets
- [ ] Add custom theme import/export
- [ ] Create theme gallery/marketplace structure

**Deliverables:**
- Complete theming system
- Shareable theme files

### Milestone 3.3: Per-App Customization
- [ ] Implement per-app zoom controls
- [ ] Add custom CSS injection
- [ ] Build custom JS injection (with safety warnings)
- [ ] Create app-specific settings panel
- [ ] Add custom icon upload

**Deliverables:**
- Fine-grained app customization
- Advanced user controls

---

## **Phase 4: Advanced Features** 🗓️

**Goal:** Add power-user features and productivity enhancements.

### Milestone 4.1: Focus Mode & Productivity
- [ ] Build Focus Mode (hide/mute distracting apps)
- [ ] Create Quick Launcher (Cmd/Ctrl+Space)
- [ ] Implement keyboard shortcuts system
- [ ] Add automation rules engine
- [ ] Build time tracking per app/workspace
- [ ] Create productivity reports

**Deliverables:**
- Focus Mode tools
- Productivity enhancements

### Milestone 4.2: Developer Tools
- [ ] Add DevTools toggle per app
- [ ] Build IPC event monitor
- [ ] Create debug console
- [ ] Implement webview state inspector
- [ ] Add performance profiling tools

**Deliverables:**
- Developer-friendly debugging tools

### Milestone 4.3: Backup & Sync
- [ ] Implement local backup/restore to JSON/ZIP
- [ ] Create export/import for profiles and workspaces
- [ ] Add folder-based sync support (Dropbox, Drive)
- [ ] Build backup scheduler
- [ ] Create restore wizard

**Deliverables:**
- Data portability
- Backup system

---

## **Phase 5: Ecosystem & Extensions** 🧪

**Goal:** Build community features and extensibility.

### Milestone 5.1: App Store
- [ ] Design app catalog schema
- [ ] Build app discovery UI
- [ ] Create curated app collection
- [ ] Implement one-click app installation
- [ ] Add community app submissions
- [ ] Build app rating/review system

**Deliverables:**
- App marketplace
- Community contributions

### Milestone 5.2: Plugin System
- [ ] Design plugin API architecture
- [ ] Implement IPC-based plugin hooks
- [ ] Create plugin loader system
- [ ] Build plugin marketplace
- [ ] Add plugin settings UI
- [ ] Create plugin development documentation

**Deliverables:**
- Extensible plugin ecosystem
- Third-party integration support

### Milestone 5.3: Advanced Collaboration (Experimental)
- [ ] Design LAN-based workspace sharing
- [ ] Implement cross-instance state sync
- [ ] Build collaborative workspace features
- [ ] Add shared clipboard functionality

**Deliverables:**
- Multi-instance collaboration tools

---

## **Phase 6: Polish & Distribution** 🗓️

**Goal:** Prepare for production release and distribution.

### Milestone 6.1: Testing & QA
- [ ] Set up unit testing (Jest)
- [ ] Create integration tests (Spectron/Playwright)
- [ ] Build automated E2E test suite
- [ ] Perform cross-platform testing (Win, Mac, Linux)
- [ ] Conduct performance benchmarking
- [ ] Security audit and hardening

**Deliverables:**
- Comprehensive test coverage
- Production-ready stability

### Milestone 6.2: Documentation
- [ ] Write user documentation
- [ ] Create developer contribution guide
- [ ] Build API reference
- [ ] Create video tutorials
- [ ] Design onboarding flow
- [ ] Write troubleshooting guide

**Deliverables:**
- Complete documentation suite

### Milestone 6.3: Release & Distribution
- [ ] Configure electron-builder for all platforms
- [ ] Set up auto-update system
- [ ] Create installer packages (DMG, EXE, AppImage)
- [ ] Publish to GitHub Releases
- [ ] Submit to package managers (Homebrew, Chocolatey, Snap)
- [ ] Launch marketing website

**Deliverables:**
- Multi-platform distribution
- Auto-update capability

---

## **Future Considerations** 💭

### Potential Features (Post-Launch)
- Mobile companion app (view-only)
- Web clipper browser extension
- Command palette for power users
- Global search across all apps
- AI-powered workspace suggestions
- Voice commands integration
- Screen recording/sharing tools
- Calendar integration
- Cross-device sync (optional, self-hosted)

---

## **Timeline Estimate**

| Phase | Duration | Target |
|-------|----------|--------|
| Phase 1: Foundation & MVP | 3-4 months | Q1 2025 |
| Phase 2: Performance & Notifications | 1-2 months | Q2 2025 |
| Phase 3: Customization & Theming | 2-3 months | Q2-Q3 2025 |
| Phase 4: Advanced Features | 2-3 months | Q3-Q4 2025 |
| Phase 5: Ecosystem & Extensions | 3-4 months | Q4 2025 - Q1 2026 |
| Phase 6: Polish & Distribution | 1-2 months | Q1 2026 |

**Note:** Timeline is approximate and subject to change based on community contributions and feedback.

---

## **Success Metrics**

- **Phase 1 Success:** MVP can run 3+ apps across 2+ workspaces
- **Phase 2 Success:** Memory usage < 500MB with 10 apps, <5s wake from hibernation
- **Phase 3 Success:** 10+ themes available, full layout customization working
- **Phase 4 Success:** Focus Mode reduces distractions by 50%, backup/restore working
- **Phase 5 Success:** 20+ community-contributed apps, 5+ plugins available
- **Phase 6 Success:** 10,000+ downloads across all platforms, <10 critical bugs

---

## **Contributing**

This roadmap is a living document. Community feedback, feature requests, and contributions are welcomed via [GitHub Issues](https://github.com/MayR-Labs/dockyard-electron/issues) and [Pull Requests](https://github.com/MayR-Labs/dockyard-electron/pulls).

---

*Last Updated: November 2024*
