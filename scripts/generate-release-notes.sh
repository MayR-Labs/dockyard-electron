#!/bin/bash

# Script to generate release notes with installation instructions
# Use this in your release workflow or manually

VERSION=$1

if [ -z "$VERSION" ]; then
    echo "Usage: ./generate-release-notes.sh v1.0.0"
    exit 1
fi

cat << EOF
## 🚀 Dockyard $VERSION

Open-source, local-first multi-app workspace manager.

### 📦 Quick Installation

#### macOS
\`\`\`bash
curl -sSL https://raw.githubusercontent.com/MayR-Labs/dockyard-electron/main/install.sh | bash
\`\`\`

Or download the .zip below and run:
\`\`\`bash
xattr -cr Dockyard.app && mv Dockyard.app /Applications/
\`\`\`

**First launch**: Right-click → Open (bypasses Gatekeeper for unsigned app)

#### Linux
\`\`\`bash
# Debian/Ubuntu
sudo dpkg -i dockyard_*_amd64.deb

# Fedora/RHEL
sudo rpm -i dockyard-*.rpm
\`\`\`

#### Windows
Run the \`.exe\` installer from the assets below.

---

> ⚠️ **macOS Security Note**: This app is not code-signed (requires \$99/year Apple Developer account). macOS will warn you on first launch. This is normal for open-source apps. [Learn more](https://github.com/MayR-Labs/dockyard-electron/blob/main/DISTRIBUTION.md)

---

### 🆕 Changes

$(git log --oneline $(git describe --tags --abbrev=0 HEAD^)..HEAD 2>/dev/null || echo "- See commits for changes")

---

📚 [Documentation](https://github.com/MayR-Labs/dockyard-electron#readme) • 🐛 [Report Issue](https://github.com/MayR-Labs/dockyard-electron/issues) • 💬 [Discussions](https://github.com/MayR-Labs/dockyard-electron/discussions)
EOF
