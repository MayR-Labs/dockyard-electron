# Features for Landing Page

This document contains the features breakdown optimized for the landing page. Features are organized by category with user-friendly descriptions and benefits.

## Feature Categories

### 🎨 Customization & Theming

#### Light, Dark, & System Themes
**What:** Choose from light mode, dark mode, or automatically follow your system's theme preference.
**Why:** Work comfortably at any time of day. Easy on the eyes whether you're in a bright office or coding at midnight.
**Details:** Instant theme switching with smooth transitions. System mode automatically adjusts as your OS theme changes.

#### Custom Accent Colors
**What:** Choose from 10 preset colors or use the color picker to create your perfect accent.
**Why:** Make Dockyard feel like yours. Match your desktop aesthetic or corporate branding.
**Details:** Affects buttons, borders, active states, and highlights throughout the UI.

#### Background Styles
**What:** Solid, glass (translucent blur), or minimal (transparent) backgrounds.
**Why:** Aesthetic flexibility. Glass mode looks stunning, minimal mode maximizes desktop visibility.
**Details:** Glass mode uses backdrop blur for a modern, macOS-like appearance.

#### Per-App Custom CSS
**What:** Inject custom CSS styles into any app to change how it looks.
**Why:** Remove annoying banners, change colors, hide ads, customize layouts.
**Example:** Hide cookie consent banners, apply dark mode to sites that don't have it, or change fonts.

#### Per-App Custom JavaScript
**What:** Run custom JavaScript code in any app for automation or enhancements.
**Why:** Automate repetitive tasks, add functionality, customize behavior.
**Example:** Auto-fill forms, remove elements, add shortcuts, or integrate with other tools.

#### Configurable Dock Position
**What:** Place the app dock on top, bottom, left, or right of the window.
**Why:** Match your workflow preference. Some prefer side docks, others prefer bottom.
**Details:** Persists per workspace. Each workspace can have its own dock position.

---

### 🚀 Productivity & Performance

#### Multiple Profiles
**What:** Create separate profiles like "Work," "Personal," "Freelance," each with independent settings.
**Why:** Keep work and personal completely separate. Run multiple instances simultaneously.
**Details:** Each profile has its own data, apps, and settings. Launch with `--profile=work`.

#### Workspaces for Context Switching
**What:** Group related apps into workspaces like "Design," "Dev," "Marketing."
**Why:** Switch between projects or contexts instantly. Stay focused on one area at a time.
**Details:** Keyboard shortcuts (Cmd/Ctrl + 1-9) for lightning-fast workspace switching.

#### Auto-Hibernation
**What:** Idle apps automatically hibernate after 15 minutes to save memory.
**Why:** Keep your machine fast even with 20+ apps loaded. No manual management needed.
**Details:** Smart resume instantly wakes apps when you switch back. Session state is preserved.

#### Performance Monitoring
**What:** Real-time dashboard showing memory and CPU usage per app.
**Why:** Identify resource hogs. See which apps are using the most resources.
**Details:** Auto-refreshing metrics, sortable list, visual indicators for high usage.

#### Multi-App Split Layouts
**What:** Tile multiple apps side-by-side horizontally, vertically, or in grids.
**Why:** See multiple apps at once. Perfect for dashboards, monitoring, or reference.
**Details:** Resizable splits, save layouts, switch between views.

#### Keyboard Shortcuts
**What:** Every action has a keyboard shortcut. Fully customizable.
**Why:** Mouse-free workflow. Navigate faster once you learn the shortcuts.
**Examples:** 
- Cmd/Ctrl+1-9: Switch workspaces
- Cmd/Ctrl+B: Toggle sidebar
- Cmd/Ctrl+Shift+D: Do Not Disturb

---

### 🔐 Privacy & Security

#### No Telemetry or Tracking
**What:** Zero data collection. No analytics, no crash reports, nothing.
**Why:** Your usage patterns are private. We never know what apps you use or when.
**Details:** Completely offline-capable. No network calls to our servers because we don't have servers.

#### Local-Only Data Storage
**What:** All settings, workspaces, and app data stored on your machine.
**Why:** No cloud dependencies. No accounts required. Your data never leaves your control.
**Details:** Stored in standard OS locations. Easy to back up or migrate.

#### Complete Session Isolation
**What:** Each app instance runs in its own isolated session by default.
**Why:** Prevent tracking across apps. Run multiple accounts of the same service without conflicts.
**Details:** Cookies, local storage, and cache are isolated per instance.

#### Optional Shared Sessions
**What:** Choose to share sessions within a workspace for connected workflows.
**Why:** Some apps work better when they can share login state (e.g., Google Workspace).
**Details:** Opt-in per workspace. Clearly labeled in the UI.

#### Open Source & Auditable
**What:** All code is publicly available on GitHub. MIT licensed.
**Why:** No hidden backdoors. Security researchers can audit the code. Full transparency.
**Details:** Regular security reviews. Community contributions welcome.

---

### 🎛️ Advanced Features

#### Multiple Instances Per App
**What:** Create multiple instances of the same app with separate sessions.
**Why:** Perfect for multiple accounts. Gmail personal + work, GitHub accounts, etc.
**Details:** Each instance has its own icon badge, partition, and state.

#### Native OS Notifications
**What:** Get native notifications from your apps just like desktop apps.
**Why:** Never miss important messages. Notifications work even when the app is hibernated.
**Details:** Per-app notification preferences. Global Do Not Disturb toggle.

#### Per-App Zoom Controls
**What:** Set custom zoom levels for each app independently.
**Why:** Make text bigger on some apps, fit more on screen for others.
**Details:** Persists per app. Useful for high-DPI displays or accessibility.

#### Built-In App Templates
**What:** Pre-configured templates for popular services (Gmail, Slack, Notion, etc.).
**Why:** One-click setup for common apps. No need to remember URLs.
**Details:** Includes correct URL, icon, and recommended settings.

#### Favicon Auto-Fetching
**What:** Automatically fetch app icons from websites.
**Why:** No manual icon hunting. Apps look professional immediately.
**Details:** Falls back to generated avatars if favicon isn't available. Upload custom icons anytime.

#### DevTools Integration
**What:** Open Chrome DevTools for any app to inspect, debug, or customize.
**Why:** Advanced users can troubleshoot issues or develop custom scripts.
**Details:** Per-app toggle. Useful for testing custom CSS/JS.

#### Session Manager
**What:** UI to view and clear cache, cookies, and storage per app.
**Why:** Troubleshoot login issues. Clear data without reinstalling.
**Details:** Shows session type (isolated vs shared). Warns before clearing.

---

### 🌐 Cross-Platform

#### Windows Support
**What:** Native Windows builds for Windows 10 and 11.
**Why:** First-class experience on the world's most popular desktop OS.
**Details:** Auto-updates, taskbar integration, Windows notifications.

#### macOS Support
**What:** Native macOS builds for macOS 10.13+.
**Why:** Feels like a native Mac app. Follows macOS design conventions.
**Details:** Dock integration, Touch Bar support, system notifications.

#### Linux Support
**What:** Builds for Ubuntu, Fedora, Arch, and other distros (.deb, .rpm, .AppImage).
**Why:** Freedom-loving OS deserves freedom-loving software.
**Details:** Respects Linux desktop environments. Works with GNOME, KDE, etc.

---

### 🛠️ Developer-Friendly

#### Browser Dev Mode
**What:** Develop the UI in a regular browser with fast hot reload.
**Why:** Faster iteration when working on UI components.
**Details:** Automatic environment detection. Shows placeholders for Electron features.

#### TypeScript Throughout
**What:** Full TypeScript coverage for type safety.
**Why:** Fewer bugs, better autocomplete, easier refactoring.
**Details:** Strict mode enabled. Comprehensive type definitions.

#### Modular Architecture
**What:** Clean separation of concerns (main, renderer, preload, shared).
**Why:** Easy to understand, modify, and extend.
**Details:** SOLID principles applied. Each module has a single responsibility.

#### IPC Communication
**What:** Secure, type-safe communication between processes.
**Why:** Renderer can't directly access Node.js for security. Preload bridges safely.
**Details:** Context isolation, sandboxing, input validation.

---

## Feature Comparison Table

Use this table to compare Dockyard with competitors on the landing page.

| Feature | Dockyard | Rambox | Station | Franz |
|---------|----------|--------|---------|-------|
| Open Source | ✅ MIT License | ❌ Proprietary | ❌ Proprietary | ✅ Apache 2.0 |
| Price | Free Forever | $7/mo | Free (limited) | $5/mo |
| Privacy (No Tracking) | ✅ Zero Telemetry | ❌ Analytics | ❌ Analytics | ❌ Analytics |
| Local-First Data | ✅ All Local | ❌ Cloud Sync | ❌ Cloud Required | ❌ Cloud Sync |
| Custom CSS/JS | ✅ Per-App | ✅ Global | ❌ No | ❌ No |
| Session Isolation | ✅ Per-Instance | ✅ Yes | Limited | ✅ Yes |
| Auto-Hibernation | ✅ Smart | ✅ Basic | ❌ No | ✅ Basic |
| Multiple Profiles | ✅ Unlimited | ⚠️ Limited | ❌ No | ❌ No |
| Theming | ✅ Full Custom | ⚠️ Basic | ⚠️ Basic | ⚠️ Basic |
| Keyboard Shortcuts | ✅ Customizable | ✅ Yes | ✅ Yes | ✅ Yes |
| Split Layouts | ✅ Yes | ❌ No | ❌ No | ❌ No |
| Performance Monitor | ✅ Built-in | ❌ No | ❌ No | ❌ No |

---

## Feature Highlight Suggestions

### Hero Section (Top 3)
1. **Privacy-First** - No tracking, all local
2. **Fully Customizable** - Themes, layouts, CSS/JS
3. **Free & Open Source** - MIT license, no subscriptions

### Features Grid (Top 6)
1. **Multiple Profiles & Workspaces**
2. **Session Isolation**
3. **Auto-Hibernation**
4. **Custom Themes & Colors**
5. **Native Notifications**
6. **Cross-Platform**

### Advanced Features Section
- Per-App CSS/JS Injection
- Performance Monitoring
- Multi-App Split Layouts
- DevTools Integration
- Session Manager

---

## Feature Benefits (Marketing Copy)

### For Privacy-Conscious Users
> "Your data stays yours. Dockyard never phones home, never collects usage stats, and never syncs to the cloud. It's local-first by design, not as an afterthought."

### For Power Users
> "Keyboard shortcuts for everything. Custom CSS/JS injection. Performance monitoring. Multiple instances. Split layouts. Dockyard is built for people who demand more from their tools."

### For Budget-Conscious Users
> "Why pay $7/month for basic features? Dockyard is free forever with no feature gating. Open source means no subscription traps or pricing surprises."

### For Developers
> "TypeScript throughout. Clean architecture. IPC security. Browser dev mode. Dockyard is built by developers who actually care about code quality."

### For Multi-Taskers
> "Run multiple Gmail accounts, multiple Slack workspaces, and multiple GitHub profiles — all side-by-side with complete session isolation."

---

## Features Coming Soon (Optional Section)

From the roadmap, highlight exciting future features:

- **Focus Mode** - Temporarily hide distracting apps
- **Quick Launcher** - Fuzzy search for apps and actions (Cmd+Space)
- **Automation Rules** - Simple automation (e.g., auto-mute music during meetings)
- **Workspace Templates** - Pre-configured workspace setups
- **Plugin API** - Extend Dockyard with custom plugins
- **Theme Marketplace** - Share and download community themes

---

## Feature Descriptions for Icons/Cards

Use these short descriptions for feature cards:

**Privacy-First**
No tracking, no telemetry, no cloud dependencies.

**Fully Customizable**
Themes, colors, layouts, CSS, JS—make it yours.

**Session Isolation**
Each app instance in its own sandbox.

**Auto-Hibernation**
Saves memory automatically. Your machine stays fast.

**Multiple Profiles**
Separate work, personal, freelance—run simultaneously.

**Keyboard First**
Every action has a shortcut. Navigate like a pro.

**Open Source**
MIT licensed. Audit the code. Contribute changes.

**Cross-Platform**
Native builds for Windows, macOS, and Linux.

---

**Use these feature descriptions to populate the landing page. Prioritize based on target audience.**
