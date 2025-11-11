# **Dockyard Development Guide**

This guide provides detailed instructions for developers working on Dockyard.

---

## **Prerequisites**

- **Node.js** v20+ (LTS recommended)
- **npm** v10+ (comes with Node.js)
- **Git**

---

## **Getting Started**

### 1. Clone the Repository

```bash
git clone https://github.com/MayR-Labs/dockyard-electron.git
cd dockyard-electron
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required dependencies including:
- Electron
- React & React DOM
- TypeScript
- Vite (build tool)
- TailwindCSS (styling)
- Framer Motion (animations)
- electron-store (data persistence)
- Zustand (state management)
- And more...

---

## **Development Commands**

### Start Development Server

```bash
npm run dev:electron
```

This command:
1. Starts Vite dev server on `http://localhost:5173`
2. Waits for the server to be ready
3. Launches Electron in development mode with hot reload

### Build for Production

```bash
npm run build
```

This builds:
- Renderer process (React UI) → `out/renderer/`
- Main process (Electron) → `out/main/`
- Preload script → `out/preload/`

### Run Production Build

```bash
npm start
```

Builds and runs the production version of the app.

### Build Distributables

To create platform-specific installers and packages:

```bash
# Package the app (creates distributable but not installer)
npm run package

# Create platform-specific installers (DMG for macOS, EXE for Windows, DEB/RPM for Linux)
npm run make

# Publish to GitHub Releases (requires GitHub token)
npm run publish
```

The `make` command creates installers in the `out/make/` directory:
- **macOS**: `.zip` and potentially `.dmg` files
- **Windows**: `.exe` (Squirrel) installer
- **Linux**: `.deb` (Debian/Ubuntu) and `.rpm` (Red Hat/Fedora) packages

Configuration for these builds is in `forge.config.js`.

### Code Quality

```bash
# Run ESLint
npm run lint

# Format code with Prettier
npm run format
```

---

## **Project Structure**

```
dockyard-electron/
├── src/
│   ├── main/                      # Electron main process
│   │   ├── index.ts               # Main entry point
│   │   ├── window-manager.ts      # Window creation & management
│   │   ├── app-manager.ts         # BrowserView lifecycle
│   │   ├── profile-manager.ts     # Profile & data management
│   │   └── ipc-handlers.ts        # IPC communication handlers
│   │
│   ├── renderer/                  # React UI (renderer process)
│   │   ├── index.html             # HTML entry point
│   │   └── src/
│   │       ├── main.tsx           # React entry point
│   │       ├── App.tsx            # Root component
│   │       ├── components/        # React components
│   │       │   ├── AppDock/       # App dock UI
│   │       │   ├── Workspace/     # Workspace management
│   │       │   └── Common/        # Shared components
│   │       ├── hooks/             # Custom React hooks
│   │       ├── store/             # Zustand state management
│   │       ├── styles/            # Global styles
│   │       └── types/             # TypeScript type definitions
│   │
│   ├── preload/                   # Preload scripts (IPC bridge)
│   │   └── index.ts               # Main preload script
│   │
│   └── shared/                    # Shared code
│       ├── types/                 # TypeScript interfaces
│       │   ├── profile.ts         # Profile types
│       │   ├── workspace.ts       # Workspace types
│       │   ├── app.ts             # App types
│       │   └── ipc.ts             # IPC message types
│       └── constants.ts           # Application constants
│
├── out/                           # Build output (gitignored)
├── tsconfig.json                  # TypeScript config (renderer)
├── tsconfig.main.json             # TypeScript config (main)
├── tsconfig.preload.json          # TypeScript config (preload)
├── vite.config.ts                 # Vite configuration
├── tailwind.config.js             # TailwindCSS configuration
├── postcss.config.js              # PostCSS configuration
├── .eslintrc.cjs                  # ESLint configuration
└── .prettierrc                    # Prettier configuration
```

---

## **Architecture Overview**

### **Main Process** (`src/main/`)

The Electron main process handles:
- Window creation and management
- BrowserView lifecycle for embedded apps
- Profile and workspace management
- Data persistence with electron-store
- IPC communication with renderer

Key classes:
- `WindowManager` - Creates and manages the main application window
- `AppManager` - Manages BrowserView instances for each app
- `ProfileManager` - Handles profiles, workspaces, and apps data

### **Renderer Process** (`src/renderer/`)

The React-based UI:
- Built with React 19 + TypeScript
- Styled with TailwindCSS
- Animated with Framer Motion
- State managed with Zustand

Key components:
- `AppDock` - Left sidebar with app icons
- `WorkspaceSwitcher` - Top bar with workspace tabs
- `AddAppModal` - Dialog for adding new apps
- `AddWorkspaceModal` - Dialog for creating workspaces

### **Preload Script** (`src/preload/`)

Secure bridge between main and renderer:
- Exposes safe IPC APIs to renderer
- Uses `contextBridge` for security
- No direct Node.js access in renderer

---

## **Key Features Implemented**

### ✅ Profile Management
- Create, update, delete profiles
- Profile-specific data stores
- Command-line profile selection: `--profile=<name>`

### ✅ Workspace Management
- Create, update, delete workspaces
- Visual workspace switcher UI
- Keyboard shortcuts (Cmd/Ctrl+Tab)
- Workspace icons and customization

### ✅ App Management
- Add custom web apps by URL
- BrowserView integration for app isolation
- App dock with icons
- App switching and navigation
- Context menus (right-click on app icons)

### ✅ Session Isolation
- Unique partitions per app instance
- Workspace-shared session option
- Clear cache/cookies per app

---

## **Development Workflow**

### Adding a New Feature

1. **Plan**: Update ROADMAP.md if it's a new milestone
2. **Types**: Define TypeScript interfaces in `src/shared/types/`
3. **Backend**: Implement logic in `src/main/`
4. **IPC**: Add handlers in `src/main/ipc-handlers.ts`
5. **API**: Expose in `src/preload/index.ts`
6. **Frontend**: Create components in `src/renderer/src/components/`
7. **State**: Update Zustand store in `src/renderer/src/store/`
8. **Test**: Build and run the app to verify

### Making Changes to UI

1. Edit components in `src/renderer/src/components/`
2. Styles use TailwindCSS utility classes
3. Animations use Framer Motion
4. Hot reload is enabled in development mode

### Modifying Main Process Logic

1. Edit files in `src/main/`
2. Rebuild with `npm run build:main`
3. Restart Electron to see changes

---

## **Keyboard Shortcuts**

- `Cmd/Ctrl + Tab` - Next workspace
- `Cmd/Ctrl + Shift + Tab` - Previous workspace
- `Cmd/Ctrl + 1-9` - Switch to workspace by number

---

## **Data Storage**

Data is stored locally using electron-store:
- Location: `~/.config/dockyard-electron/` (Linux/macOS) or `%APPDATA%\dockyard-electron\` (Windows)
- Format: JSON files
- Files: `default.json` (or `<profile-name>.json`)

### Data Structure

```json
{
  "profiles": {
    "default": {
      "id": "uuid",
      "name": "default",
      "workspaces": ["workspace-id-1", "workspace-id-2"],
      "settings": {...}
    }
  },
  "workspaces": {
    "workspace-id-1": {
      "id": "workspace-id-1",
      "name": "Work",
      "icon": "💼",
      "apps": ["app-id-1", "app-id-2"],
      "settings": {...}
    }
  },
  "apps": {
    "app-id-1": {
      "id": "app-id-1",
      "name": "Gmail",
      "url": "https://mail.google.com",
      "partition": "app-app-id-1",
      "settings": {...}
    }
  }
}
```

---

## **Troubleshooting**

### Build Errors

```bash
# Clean and reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Clean build output
rm -rf out
npm run build
```

### TypeScript Errors

```bash
# Check for type errors
npx tsc --noEmit
```

### Electron Won't Start

1. Check that port 5173 is not in use
2. Verify build completed successfully
3. Check console for errors
4. Try: `npm run build && npm start`

---

## **Contributing**

1. Create a feature branch: `git checkout -b feature/my-feature`
2. Make your changes
3. Test thoroughly
4. Commit with clear messages
5. Push and create a Pull Request

---

## **Next Steps**

See [ROADMAP.md](./ROADMAP.md) for planned features and milestones.

Key areas for contribution:
- [ ] Profile selector UI
- [ ] Settings panel
- [ ] Favicon fetching
- [ ] Auto-hibernation system
- [ ] Native notifications
- [ ] Theme customization
- [ ] Import/export functionality

---

## **Resources**

- [Electron Documentation](https://www.electronjs.org/docs/latest/)
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [Framer Motion Documentation](https://www.framer.com/motion/)
- [Zustand Documentation](https://docs.pmnd.rs/zustand/getting-started/introduction)

---

**Happy Coding! 🚀**
