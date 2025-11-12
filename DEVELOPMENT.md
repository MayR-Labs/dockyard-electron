# Dockyard Development Guide

## 🚀 Phase 1: Core Architecture - Complete!

The foundational architecture has been implemented with TypeScript, React, Vite, and Electron.

## 📋 Prerequisites

- Node.js 18+ and npm
- Git

## 🛠️ Setup

```bash
# Clone the repository
git clone https://github.com/MayR-Labs/dockyard-electron.git
cd dockyard-electron

# Install dependencies
npm install
```

## 🏃 Running the Application

### Development Mode

```bash
# Build and start the application in production mode
npm start

# Run in development mode with hot reload
npm run dev
```

The `dev` command will:

1. Build the main process
2. Start Vite dev server for hot reload
3. Watch for TypeScript changes in main process
4. Launch Electron pointing to the dev server

### Production Build

```bash
# Build for production
npm run build

# Package the application
npm run package

# Create distributable
npm run make
```

## 🗂️ Project Structure

```
dockyard-electron/
├── src/
│   ├── main/                    # Electron main process (TypeScript)
│   │   ├── index.ts             # Entry point with profile support
│   │   ├── window-manager.ts    # Window lifecycle management
│   │   ├── ipc-handlers.ts      # IPC message handlers
│   │   └── store-manager.ts     # electron-store wrapper
│   ├── renderer/                # React UI (Vite + TypeScript)
│   │   ├── src/
│   │   │   ├── main.tsx         # React entry point
│   │   │   ├── App.tsx          # Root component
│   │   │   ├── store/           # Zustand state management
│   │   │   └── styles/          # TailwindCSS styles
│   │   └── index.html           # HTML template
│   ├── preload/                 # Preload scripts
│   │   └── index.ts             # Secure IPC bridge
│   └── shared/                  # Shared code
│       ├── types/               # TypeScript interfaces
│       ├── constants.ts         # App-wide constants
│       └── utils.ts             # Utility functions
├── dist/                        # Build output (gitignored)
│   ├── main/                    # Compiled main process
│   ├── renderer/                # Built renderer assets
│   └── preload/                 # Compiled preload scripts
├── tsconfig.json                # Base TypeScript config
├── tsconfig.main.json           # Main process TS config
├── tsconfig.renderer.json       # Renderer process TS config
├── vite.config.ts               # Vite configuration
├── tailwind.config.js           # TailwindCSS configuration
└── forge.config.js              # Electron Forge config
```

## 🔧 Tech Stack

| Component        | Technology           | Purpose                      |
| ---------------- | -------------------- | ---------------------------- |
| Desktop Shell    | Electron 39+         | Cross-platform desktop app   |
| Main Process     | TypeScript + Node.js | Backend logic and IPC        |
| Renderer         | React 19 + Vite 7    | Fast UI development          |
| State Management | Zustand 5            | Lightweight state management |
| Styling          | TailwindCSS 4        | Utility-first CSS            |
| Data Storage     | electron-store 11    | Local JSON persistence       |
| Build Tool       | Vite 7               | Fast bundling and HMR        |
| Packaging        | Electron Forge 7     | Distribution builds          |

## 📦 Available Scripts

- `npm run build:main` - Compile main process TypeScript
- `npm run build:renderer` - Build renderer with Vite
- `npm run build` - Build both main and renderer
- `npm start` - Build and run the application
- `npm run package` - Package for current platform
- `npm run make` - Create distributable for current platform

## 🧪 Testing

Coming in future phases:

- Unit tests with Jest
- Integration tests with Spectron/Playwright
- E2E tests for complete workflows

## 🔐 Security Features

✅ Context isolation enabled
✅ Node integration disabled in renderer
✅ Sandbox mode enabled
✅ Secure IPC with contextBridge
✅ Input validation in IPC handlers
✅ No remote module usage

## 📚 Key Features Implemented

### ✅ Multi-Profile Support

Launch multiple instances with different profiles:

```bash
npm start -- --profile=work
npm start -- --profile=personal
```

### ✅ Data Persistence

All data stored locally in:

- macOS: `~/Library/Application Support/dockyard-electron/`
- Windows: `%APPDATA%/dockyard-electron/`
- Linux: `~/.config/dockyard-electron/`

### ✅ IPC Communication

Secure message passing between main and renderer:

- Profiles: list, create, delete, switch
- Workspaces: list, create, update, delete, switch
- Apps: list, create, update, delete, hibernate, resume
- Settings: get, update

### ✅ Type Safety

Full TypeScript coverage with strict mode:

- Shared types between main and renderer
- IPC API type definitions
- Compile-time error checking

## 🐛 Debugging

### Main Process

The main process logs to the terminal. Look for errors during startup.

### Renderer Process

In development, DevTools opens automatically. Check the Console tab for errors.

### Data Storage

Inspect stored data at:

```bash
# macOS/Linux
cat ~/Library/Application\ Support/dockyard-electron/profiles.json

# Windows
type %APPDATA%\dockyard-electron\profiles.json
```

## 🚧 Coming Next

Phase 2 features (see ROADMAP.md):

- Workspace switching UI
- App management interface
- BrowserView embedding for web apps
- Session isolation
- Keyboard shortcuts
- Settings panel

## 💡 Tips

1. **Hot Reload**: Use `npm run dev` for faster development (coming soon)
2. **Clean Build**: Delete `dist/` folder if builds behave unexpectedly
3. **Profile Data**: Each profile has its own data directory
4. **TypeScript**: Run `npm run build:main` to check for type errors

## 📖 Documentation

- [PLAN.md](PLAN.md) - Detailed technical implementation plan
- [ROADMAP.md](ROADMAP.md) - Development roadmap and milestones
- [FEATURES.md](FEATURES.md) - Planned features overview
- [README.md](README.md) - Project overview

## 🤝 Contributing

See [ROADMAP.md](ROADMAP.md) for current phase and planned features. Contributions welcome!

---

**Built with ❤️ by MayR Labs**
