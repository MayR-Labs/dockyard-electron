# Proposed Feature Ideas for Dockyard

Based on the current `ROADMAP.md` and codebase structure, here are additional feature ideas to further differentiate Dockyard.

## 1. 🚀 Productivity & Workflow (Immediate Wins)

*   **Command Palette / Quick Launcher (⌘K)**
    *   *Why*: Power users love this. Instead of clicking, let them hit `Cmd+K` to switch workspaces, jump to a specific app, toggle DND, or reload a page.
    *   *Status*: Planned in Phase 6, but this is a high-impact feature that could be prioritized.

*   **"Mini Mode" / Picture-in-Picture**
    *   *Why*: Sometimes users just want to keep an eye on a specific app (like a chat or music player) without the full window. A toggle to detach an app into a small, always-on-top floating window.

*   **Global Hotkeys**
    *   *Why*: Allow users to bring Dockyard to the foreground or toggle a specific app (e.g., "Toggle Slack") from *anywhere* in the OS, even when Dockyard is minimized.

## 2. 🔌 Integrations & "Smart" Features

*   **Status Syncing**
    *   *Why*: Automatically update the user's Slack/Discord status based on their active Workspace (e.g., "Deep Work" workspace → sets Slack to "Do Not Disturb").

*   **Universal Media Controls**
    *   *Why*: If a user has Spotify, YouTube, and Apple Music open in different tabs, give them a unified "Now Playing" widget in the status bar to pause/skip without hunting for the tab.

## 3. 📊 Analytics & Insights (Unique Value)

*   **"Digital Wellbeing" Dashboard**
    *   *Why*: Visualize usage data (already tracked for performance) for the user. Show them: "You spent 4 hours in the 'Work' workspace and 2 hours in 'Social' today."

*   **App Health Monitor**
    *   *Why*: Alert users if a specific app is consuming abnormal memory/CPU (user-facing notification).

## 4. 🛠️ Distribution & Onboarding

*   **Homebrew Cask Support**
    *   *Why*: Making it installable via `brew install --cask dockyard` would significantly lower the barrier to entry for developers.

*   **Interactive Onboarding Tour**
    *   *Why*: A quick, guided tour (using a library like `driver.js`) highlighting key features (workspaces, app adding, shortcuts) for new users.

## 5. 🎨 Visual Polish

*   **Adaptive Icons**
    *   *Why*: Automatically fetch high-res icons or allow users to tint icons to match their theme (monochrome mode) for a cleaner look.
