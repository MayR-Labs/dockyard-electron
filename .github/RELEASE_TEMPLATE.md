# Release Notes Template

Copy this template for your GitHub releases:

---

## 🚀 Dockyard v{VERSION}

Open-source, local-first multi-app workspace manager for macOS, Linux, and Windows.

### 📦 Installation

#### macOS (Intel & Apple Silicon)

1. **Download** the `.dmg` file for your architecture below
   - Apple Silicon (M1/M2/M3): `darwin-arm64.dmg`
   - Intel Macs: `darwin-x64.dmg`

2. **Install** by opening the DMG and dragging Dockyard to Applications

3. **Remove quarantine** (required for unsigned apps):
   ```bash
   curl -sSL https://raw.githubusercontent.com/MayR-Labs/dockyard-electron/main/scripts/mac-first-run.sh | bash
   ```
   Or manually:
   ```bash
   xattr -cr /Applications/Dockyard.app
   ```

4. **First launch**: Right-click → Open → Open (bypasses Gatekeeper)

> ⚠️ **Note**: This app is not code-signed. macOS will show a security warning on first launch. This is expected for open-source apps without an Apple Developer account ($99/year). You can review our source code anytime.

#### Linux

**Debian/Ubuntu:**
```bash
sudo dpkg -i dockyard_*_amd64.deb
```

**Fedora/RHEL:**
```bash
sudo rpm -i dockyard-*.rpm
```

#### Windows

1. Download `Dockyard-Setup-{VERSION}.exe`
2. Run the installer
3. Launch from Start Menu or Desktop shortcut

---

### 🆕 What's New in v{VERSION}

- List your changes here
- Feature additions
- Bug fixes
- Performance improvements

### 🔧 What's Changed

See [CHANGELOG.md] for full details.

---

### 📚 Documentation

- [Installation Guide](https://github.com/MayR-Labs/dockyard-electron#quick-install)
- [Distribution Guide (macOS Unsigned Apps)](https://github.com/MayR-Labs/dockyard-electron/blob/main/DISTRIBUTION.md)
- [Development Setup](https://github.com/MayR-Labs/dockyard-electron#getting-started)

---

### 🐛 Known Issues

- **macOS**: Gatekeeper warning on first launch (expected for unsigned apps)
- List other known issues here

---

### 💬 Questions or Issues?

- [Open an issue](https://github.com/MayR-Labs/dockyard-electron/issues)
- [Discussions](https://github.com/MayR-Labs/dockyard-electron/discussions)

---

### 🙏 Support the Project

If you find Dockyard useful:
- ⭐ Star the repository
- 🐛 Report bugs and suggest features
- 🔀 Contribute code improvements
- 📢 Share with others who value privacy

---

**Full Changelog**: https://github.com/MayR-Labs/dockyard-electron/compare/v{PREV_VERSION}...v{VERSION}
