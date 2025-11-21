#!/bin/bash

# Dockyard First-Run Helper for macOS
# Use this script if you downloaded Dockyard.app and it's being blocked by Gatekeeper

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  Dockyard First-Run Helper (macOS)    ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}\n"

# Check if running on macOS
if [[ "$(uname -s)" != "Darwin" ]]; then
    echo -e "${RED}✗${NC} This script is for macOS only"
    exit 1
fi

# Find Dockyard.app
APP_PATH=""

# Check common locations
if [ -d "/Applications/Dockyard.app" ]; then
    APP_PATH="/Applications/Dockyard.app"
elif [ -d "$(pwd)/Dockyard.app" ]; then
    APP_PATH="$(pwd)/Dockyard.app"
elif [ -d "$HOME/Downloads/Dockyard.app" ]; then
    APP_PATH="$HOME/Downloads/Dockyard.app"
fi

if [ -z "$APP_PATH" ]; then
    echo -e "${YELLOW}⚠${NC} Dockyard.app not found in common locations"
    echo ""
    read -p "Enter the path to Dockyard.app: " APP_PATH

    if [ ! -d "$APP_PATH" ]; then
        echo -e "${RED}✗${NC} App not found at: $APP_PATH"
        exit 1
    fi
fi

echo -e "${GREEN}✓${NC} Found Dockyard.app at: ${BLUE}$APP_PATH${NC}\n"

# Remove quarantine
echo -e "${BLUE}ℹ${NC} Removing quarantine flags..."

xattr -cr "$APP_PATH" 2>/dev/null || true
find "$APP_PATH" -type f -exec xattr -d com.apple.quarantine {} \; 2>/dev/null || true

echo -e "${GREEN}✓${NC} Quarantine flags removed\n"

# Move to Applications if not already there
if [[ "$APP_PATH" != "/Applications/Dockyard.app" ]]; then
    echo -e "${BLUE}ℹ${NC} Moving to /Applications..."

    if [ -d "/Applications/Dockyard.app" ]; then
        echo -e "${YELLOW}⚠${NC} Existing installation found"
        read -p "Replace it? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            rm -rf "/Applications/Dockyard.app"
        else
            echo -e "${YELLOW}⚠${NC} Keeping existing installation"
            APP_PATH="/Applications/Dockyard.app"
        fi
    fi

    if [[ "$APP_PATH" != "/Applications/Dockyard.app" ]]; then
        cp -R "$APP_PATH" /Applications/
        APP_PATH="/Applications/Dockyard.app"
        echo -e "${GREEN}✓${NC} Moved to Applications\n"
    fi
fi

# Launch
echo -e "${BLUE}ℹ${NC} Launching Dockyard...\n"
open "$APP_PATH"

echo -e "${GREEN}╔════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║         Dockyard is now running!       ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════╝${NC}\n"

echo -e "${BLUE}First Launch Tips:${NC}"
echo -e "  • If you see a security warning, click ${GREEN}'Open'${NC}"
echo -e "  • You can also go to ${BLUE}System Settings → Privacy & Security${NC}"
echo -e "  • Subsequent launches work normally from Applications\n"

echo -e "${YELLOW}Note:${NC} Dockyard is open-source and built without code signing"
echo -e "      because we don't have an Apple Developer account."
echo -e "      You can always review the source code at:"
echo -e "      ${BLUE}https://github.com/MayR-Labs/dockyard-electron${NC}\n"
