# **Dockyard**

*A flexible, open-source multi-app workspace built for power users.*

Dockyard lets you bring all your favourite web apps into one elegant desktop hub. Switch, tile, and manage them like browser tabs on steroids — all while keeping sessions isolated, notifications flowing, and your workspace tidy.

---

## 🚀 **Features at a Glance**

* Multiple profiles (run separate instances of the app)
* Workspaces for grouping related apps
* Add unlimited built-in or custom apps
* Multiple instances per app (e.g., two GitHub accounts)
* Session isolation and shared session options
* Auto-hibernation and performance controls
* Notifications and per-app badges
* Customisable layout (icons on top, left, right, or bottom)
* Full theme control with light/dark and accent colours
* Offline-first local persistence
* Cross-platform (Windows, macOS, Linux)

---

## 🧠 **Why Dockyard Exists**

Most “all-in-one” messaging and productivity containers are either bloated, proprietary, or subscription-locked. Dockyard flips that model: it’s **open, hackable, and locally managed.**
No logins, no cloud sync — just your setup, your data, your workflow.

---

## 🧩 **Tech Stack**

* **Electron** — desktop shell
* **Vite + React** — frontend UI
* **TypeScript** — strong typing for maintainability
* **electron-store / lowdb** — local persistence
* **TailwindCSS** — styling system
* **Framer Motion** — smooth transitions and animations

---

## 🛠️ **Project Structure**

```
dockyard/
 ├─ src/
 │   ├─ main/        # Electron main process
 │   ├─ renderer/    # React UI
 │   ├─ preload/     # Secure IPC bridges
 │   └─ shared/      # Models & utilities
 ├─ assets/
 ├─ package.json
 ├─ vite.config.js
 └─ electron-builder.yml
```

---

## 🧩 **Quick Start**

```bash
# Clone the repository
git clone https://github.com/MayR-Labs/dockyard-electron.git
cd dockyard-electron

# Install dependencies
npm install

# Start in development mode
npm run dev:electron

# Build for production
npm run build

# Run production build
npm start
```

For detailed development instructions, see [DEVELOPMENT.md](./DEVELOPMENT.md).

---

## 💡 **Planned Milestones**

* [ ] MVP – Profiles, Workspaces, Custom Apps
* [ ] Notifications & Hibernation
* [ ] Full theming engine
* [ ] App store & custom script injection
* [ ] Focus Mode & Automation Rules

---

## 💬 **Community**

Dockyard is open for contributions, discussions, and suggestions.
Report bugs, request features, or share your workspace ideas via [GitHub Issues](https://github.com/mayrlabs/dockyard/issues).

---

## ⚖️ **Licence**

MIT Licence — free to use, modify, and distribute.****
