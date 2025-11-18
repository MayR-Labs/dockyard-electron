# **Dockyard**

_The open-source, privacy-first multi-app workspace for power users._

Dockyard is a desktop application that unifies all your favorite web apps into one elegant, customizable workspace. Think of it as your personal command center where Gmail, Slack, Notion, Figma, and any other web tool coexist seamlessly — all while keeping your data local and your sessions isolated.

---

## 🎯 **What is Dockyard?**

Dockyard transforms how you interact with web applications on your desktop. Instead of juggling dozens of browser tabs or using bloated proprietary tools, Dockyard gives you:

- **One unified workspace** for all your web apps
- **Complete privacy** — no telemetry, no cloud sync, all data stays local
- **Total customization** — themes, layouts, keyboard shortcuts, even custom CSS/JS per app
- **Professional features** — multiple instances per app, session isolation, auto-hibernation
- **Cross-platform support** — works on Windows, macOS, and Linux

Perfect for developers, designers, productivity enthusiasts, and anyone who wants to take back control of their digital workspace.

---

## ✨ **Key Features**

### **🎨 Customization & Theming**
- Light, dark, and system themes with custom accent colors
- Glass, solid, or minimal background styles
- Per-app custom CSS and JavaScript injection
- Configurable dock positions (top, bottom, left, right)
- Keyboard shortcuts for everything

### **🚀 Productivity & Performance**
- Multiple profiles (work, personal, etc.) running simultaneously
- Workspaces to organize apps by project or context
- Auto-hibernation to save memory on idle apps
- Performance monitoring dashboard
- Multi-app split layouts (tile apps side-by-side)

### **🔐 Privacy & Security**
- Complete session isolation between apps
- No telemetry or tracking whatsoever
- All data stored locally on your machine
- Open source and auditable
- Optional shared sessions within workspaces

### **🎛️ Advanced Features**
- Multiple instances per app (perfect for multiple accounts)
- Native OS notifications with Do Not Disturb mode
- Favicon auto-fetching or custom icon upload
- Per-app zoom controls
- Built-in app templates for popular services

---

## 🧠 **Why Choose Dockyard?**

Most "all-in-one" workspace apps like Rambox, Station, or Franz are:
- **Proprietary** — closed source with unknown data practices
- **Subscription-based** — pay monthly for basic features
- **Cloud-dependent** — require accounts and sync your data
- **Bloated** — packed with features you don't need

**Dockyard is different:**
- ✅ Completely open source (MIT license)
- ✅ Free forever, no subscriptions or paywalls
- ✅ Privacy-first, local-only data storage
- ✅ Lightweight and fast
- ✅ Built by developers, for people who value control

---

## 🧩 **Tech Stack**

- **Electron** — desktop shell
- **Vite + React** — frontend UI
- **TypeScript** — strong typing for maintainability
- **electron-store** — local persistence
- **TailwindCSS** — styling system
- **Framer Motion** — smooth transitions and animations

---

## 🛠️ **Project Structure**

```
dockyard/
 ├─ src/
 │   ├─ main/        # Electron main process
 │   ├─ renderer/    # React UI
 │   ├─ preload/     # Secure IPC bridges
 │   └─ shared/      # Models & utilities
 ├─ docs/            # Documentation
 ├─ assets/
 ├─ package.json
 └─ vite.config.ts
```

---

## 🧩 **Build & Run**

```bash
# Clone repo
git clone https://github.com/MayR-Labs/dockyard-electron.git
cd dockyard-electron

# Install dependencies
npm install

# Start in dev mode
npm run dev

# Build app
npm run build

# Create distributable
npm run make
```

---

## 💡 **Project Status & Planning**

Dockyard is actively being developed with a phased approach. For detailed development plans and current progress:

- **[ROADMAP.md](ROADMAP.md)** - Phased development timeline and milestones (Phase 5 Complete - 100%)
- **[docs/PLAN.md](docs/PLAN.md)** - Technical implementation details and architecture
- **[docs/FEATURES.md](docs/FEATURES.md)** - Comprehensive feature list
- **[docs/DEVELOPMENT.md](docs/DEVELOPMENT.md)** - Developer guide and setup instructions

**Current Version**: v0.6.0 (Beta)

**Recent Milestones:**
- ✅ Phase 1: Core Architecture - Complete
- ✅ Phase 2: Workspace & App Management - Complete
- 🚧 Phase 3: Session Management & Performance - 85% Complete
- ✅ Phase 4: Notifications & Layout - Complete
- ✅ Phase 5: Theming & Customization - Complete

**Quick Feature Status:**
- ✅ Multi-profile support with independent instances
- ✅ Workspace creation and management
- ✅ Custom app management with URL input
- ✅ Session isolation and shared session modes
- ✅ Auto-hibernation and performance monitoring
- ✅ Native OS notifications with DND mode
- ✅ Comprehensive theming (light/dark/system with custom colors)
- ✅ Per-app CSS/JS injection
- ✅ Multi-app split layouts and tiling
- ✅ Keyboard shortcuts throughout

---

## 📚 **Documentation**

### For Users:
- **[docs/ABOUT.md](docs/ABOUT.md)** - Philosophy and core concepts
- **[docs/THEMING.md](docs/THEMING.md)** - Theming and customization guide
- **[docs/FEATURES.md](docs/FEATURES.md)** - Complete feature list

### For Developers:
- **[docs/DEVELOPMENT.md](docs/DEVELOPMENT.md)** - Setup and development workflow
- **[docs/PLAN.md](docs/PLAN.md)** - Technical implementation plan
- **[docs/DESIGN.md](docs/DESIGN.md)** - UI/UX design specifications
- **[docs/BROWSERVIEW_ARCHITECTURE.md](docs/BROWSERVIEW_ARCHITECTURE.md)** - BrowserView architecture
- **[docs/BROWSER_DEV_MODE.md](docs/BROWSER_DEV_MODE.md)** - Browser development mode guide

---

## 💬 **Community & Support**

Dockyard is open for contributions, discussions, and suggestions:

- **Issues**: [Report bugs or request features](https://github.com/MayR-Labs/dockyard-electron/issues)
- **Discussions**: [Share ideas and get help](https://github.com/MayR-Labs/dockyard-electron/discussions)
- **Contributing**: See ROADMAP.md for current priorities and how to contribute

---

## ⚖️ **License**

MIT License - free to use, modify, and distribute.

---

## 🙏 **Acknowledgments**

Dockyard is built with amazing open-source technologies:
- [Electron](https://www.electronjs.org/) for the desktop framework
- [React](https://react.dev/) for the UI
- [Vite](https://vitejs.dev/) for lightning-fast development
- [TailwindCSS](https://tailwindcss.com/) for styling
- [Zustand](https://github.com/pmndrs/zustand) for state management

Special thanks to the open-source community and all contributors who help make Dockyard better.

---

**Built with ❤️ by MayR Labs**
