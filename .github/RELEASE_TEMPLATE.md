# Release Notes Template

Copy this template for your GitHub releases:

---

## 🚀 Dockyard v{VERSION}

Open-source, local-first multi-app workspace manager for macOS, Linux, and Windows.

### 📦 Installation

#### macOS (Intel & Apple Silicon)

**Quick Install:**
```bash
curl -sSL https://raw.githubusercontent.com/MayR-Labs/dockyard-electron/main/install.sh | bash
```

**Manual Install:**
1. Download `Dockyard-darwin-{arch}.zip` below
2. Extract the archive
3. Run the first-launch helper:
   ```bash
   curl -sSL https://raw.githubusercontent.com/MayR-Labs/dockyard-electron/main/scripts/mac-first-run.sh | bash
   ```
4. Or manually:
   ```bash
   xattr -cr Dockyard.app
   mv Dockyard.app /Applications/
   ```
5. **First launch**: Right-click → Open → Open (bypasses Gatekeeper)

> ⚠️ **Note**: This app is not code-signed. macOS will show a security warning on first launch. This is expected for open-source apps without an Apple Developer account ($99/year). You can review our source code anytime.

#### Linux

**Debian/Ubuntu (.deb):**
```bash
sudo dpkg -i dockyard_*_amd64.deb
# Or install via your package manager
```

**Fedora/RHEL (.rpm):**
```bash
sudo rpm -i dockyard-*.rpm
# Or install via your package manager
```

**Quick Install Script:**
```bash
curl -sSL https://raw.githubusercontent.com/MayR-Labs/dockyard-electron/main/install.sh | bash
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
