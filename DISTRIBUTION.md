# Dockyard Distribution Guide

## Mac Distribution (Unsigned App)

Since Dockyard is not code-signed (requires paid Apple Developer account), Mac users need to bypass Gatekeeper. Here are the recommended distribution methods:

### Method 1: Installation Script (Recommended)

Users can install via the automated script which handles quarantine removal:

```bash
curl -sSL https://raw.githubusercontent.com/MayR-Labs/dockyard-electron/main/install.sh | bash
```

### Method 2: Direct Download + Manual Installation

1. **Download the latest release** from GitHub Releases
2. **Extract the ZIP** file
3. **Remove quarantine attributes**:
   ```bash
   xattr -cr "/path/to/Dockyard.app"
   ```
4. **Move to Applications**:
   ```bash
   mv Dockyard.app /Applications/
   ```
5. **First Launch**: Right-click → Open (bypasses Gatekeeper)

### Method 3: Terminal Launch Helper

For downloaded builds, users can run:

```bash
# Navigate to where Dockyard.app is located
xattr -cr Dockyard.app
open Dockyard.app
```

### Method 4: System Settings Override

If the app is blocked:

1. Try to open the app normally (it will be blocked)
2. Go to **System Settings** → **Privacy & Security**
3. Scroll down to see "Dockyard was blocked"
4. Click **Open Anyway**

---

## Building from Source (Most Secure)

Users can build locally to avoid all quarantine issues:

```bash
git clone https://github.com/MayR-Labs/dockyard-electron.git
cd dockyard-electron
npm install
npm run make

# The built app will be in: out/Dockyard-darwin-{arch}/Dockyard.app
# Move it to Applications:
cp -R "out/Dockyard-darwin-$(uname -m)/Dockyard.app" /Applications/
```

---

## Why These Steps Are Necessary

- **No Code Signing**: Apple requires apps to be signed with a Developer ID ($99/year)
- **Gatekeeper**: macOS blocks unsigned apps by default to protect users
- **Quarantine**: Downloaded files get a quarantine flag that triggers Gatekeeper

---

## For Advanced Users

### Disable Gatekeeper Globally (Not Recommended)

```bash
# Disable (requires admin password)
sudo spctl --master-disable

# Re-enable after installing Dockyard
sudo spctl --master-enable
```

⚠️ **Warning**: This reduces system security. Only do this temporarily.

### Allow Specific App

```bash
# Tell Gatekeeper to trust Dockyard specifically
sudo spctl --add /Applications/Dockyard.app
```

---

## Homebrew Cask (Future Option)

Once the app is stable, we can distribute via Homebrew:

```bash
# Users would install with:
brew install --cask dockyard
```

Homebrew handles unsigned apps gracefully and is trusted by the developer community.

---

## CI/CD Release Process

The GitHub Actions workflow automatically builds unsigned packages for:
- **macOS** (Intel + Apple Silicon)
- **Linux** (.deb + .rpm)
- **Windows** (.exe)

All releases are published as GitHub Release assets that users can download directly.

---

## Notarization (Future Goal)

When resources permit, we can add Apple notarization:

1. Get Apple Developer account ($99/year)
2. Generate signing certificate
3. Add notarization to build process
4. Users can install without any warnings

Until then, the methods above work reliably for open-source distribution.
