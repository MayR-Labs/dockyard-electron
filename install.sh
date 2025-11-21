#!/bin/bash

# Dockyard Installation Script
# Automatically detects platform, builds, and installs the application

set -e  # Exit on error

# Check if running in non-interactive mode (piped from curl/wget)
if [ -t 0 ]; then
    INTERACTIVE=true
else
    INTERACTIVE=false
fi

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Print functions
print_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_header() {
    echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}  $1${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"
}

# Detect platform
detect_platform() {
    print_header "Detecting Platform"

    OS="$(uname -s)"
    ARCH="$(uname -m)"

    case "$OS" in
        Darwin*)
            PLATFORM="darwin"
            PLATFORM_NAME="macOS"
            if [ "$ARCH" = "arm64" ]; then
                BUILD_TARGET="darwin-arm64"
                BUILD_ARCH="arm64"
                PACKAGE_NAME="Dockyard-darwin-arm64"
            else
                BUILD_TARGET="darwin-x64"
                BUILD_ARCH="x64"
                PACKAGE_NAME="Dockyard-darwin-x64"
            fi
            APP_PATH="out/Dockyard-darwin-${ARCH}/Dockyard.app"
            INSTALL_PATH="/Applications/Dockyard.app"
            ;;
        Linux*)
            PLATFORM="linux"
            PLATFORM_NAME="Linux"
            if [ "$ARCH" = "x86_64" ]; then
                BUILD_TARGET="linux-x64"
                BUILD_ARCH="x64"
                PACKAGE_NAME="Dockyard-linux-x64"
            elif [ "$ARCH" = "aarch64" ] || [ "$ARCH" = "arm64" ]; then
                BUILD_TARGET="linux-arm64"
                BUILD_ARCH="arm64"
                PACKAGE_NAME="Dockyard-linux-arm64"
            else
                print_error "Unsupported Linux architecture: $ARCH"
                exit 1
            fi
            APP_PATH="out/${PACKAGE_NAME}"
            INSTALL_PATH="/opt/dockyard"
            ;;
        MINGW*|MSYS*|CYGWIN*)
            PLATFORM="windows"
            PLATFORM_NAME="Windows"
            print_error "Windows installation via shell script is not recommended."
            print_info "Please run: npm install && npm run make"
            print_info "Then install the generated .exe from the out/make directory"
            exit 1
            ;;
        *)
            print_error "Unsupported operating system: $OS"
            exit 1
            ;;
    esac

    print_success "Detected: $PLATFORM_NAME ($ARCH)"
}

# Check prerequisites
check_prerequisites() {
    print_header "Checking Prerequisites"

    # Check Node.js
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed"
        print_info "Please install Node.js from https://nodejs.org/ (v18+ required)"
        exit 1
    fi

    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        print_error "Node.js version 18 or higher is required (found: $(node -v))"
        exit 1
    fi
    print_success "Node.js $(node -v)"

    # Check npm
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed"
        exit 1
    fi
    print_success "npm $(npm -v)"

    # Platform-specific checks
    if [ "$PLATFORM" = "darwin" ]; then
        if ! command -v xcode-select &> /dev/null; then
            print_warning "Xcode Command Line Tools not found"
            print_info "Installing Xcode Command Line Tools..."
            xcode-select --install
        fi
    fi

    if [ "$PLATFORM" = "linux" ]; then
        # Check for common Linux build dependencies
        MISSING_DEPS=()

        for cmd in make g++ pkg-config; do
            if ! command -v $cmd &> /dev/null; then
                MISSING_DEPS+=($cmd)
            fi
        done

        if [ ${#MISSING_DEPS[@]} -ne 0 ]; then
            print_warning "Missing build dependencies: ${MISSING_DEPS[*]}"
            print_info "Install with: sudo apt-get install build-essential pkg-config"
        fi
    fi
}

# Install dependencies
install_dependencies() {
    print_header "Installing Dependencies"

    if [ -d "node_modules" ]; then
        print_info "node_modules exists, checking for updates..."
        npm install
    else
        print_info "Installing npm packages..."
        npm install
    fi

    print_success "Dependencies installed"
}

# Build the application
build_app() {
    print_header "Building Dockyard"

    print_info "Building for $BUILD_TARGET..."
    print_info "This may take a few minutes..."

    npm run make -- --platform=$PLATFORM --arch=$BUILD_ARCH

    print_success "Build completed"
}

# Install the application
install_app() {
    print_header "Installing Dockyard"

    if [ "$PLATFORM" = "darwin" ]; then
        if [ -d "$INSTALL_PATH" ]; then
            print_warning "Existing installation found at $INSTALL_PATH"
            if [ "$INTERACTIVE" = true ]; then
                read -p "Remove existing installation? (y/N): " -n 1 -r
                echo
                if [[ $REPLY =~ ^[Yy]$ ]]; then
                    rm -rf "$INSTALL_PATH"
                    print_success "Removed existing installation"
                else
                    print_error "Installation cancelled"
                    exit 1
                fi
            else
                print_info "Removing existing installation automatically..."
                rm -rf "$INSTALL_PATH"
                print_success "Removed existing installation"
            fi
        fi

        if [ ! -d "$APP_PATH" ]; then
            print_error "Build artifact not found at: $APP_PATH"
            exit 1
        fi

        print_info "Copying application to $INSTALL_PATH..."
        cp -R "$APP_PATH" "$INSTALL_PATH"

        # Fix permissions
        chmod -R 755 "$INSTALL_PATH"

        # Remove quarantine attribute (critical for unsigned apps)
        print_info "Removing quarantine flags..."
        xattr -cr "$INSTALL_PATH" 2>/dev/null || true

        # Additional quarantine removal for nested contents
        find "$INSTALL_PATH" -type f -exec xattr -d com.apple.quarantine {} \; 2>/dev/null || true

        print_success "Dockyard installed to $INSTALL_PATH"
        print_info "You can launch it from Applications or Spotlight"

        # Provide guidance for first launch
        echo ""
        print_warning "First Launch Instructions:"
        echo -e "  ${YELLOW}1.${NC} Right-click Dockyard.app in Applications"
        echo -e "  ${YELLOW}2.${NC} Select 'Open' from the menu"
        echo -e "  ${YELLOW}3.${NC} Click 'Open' in the security dialog"
        echo -e "  ${YELLOW}Or:${NC} Run: ${BLUE}open /Applications/Dockyard.app${NC}"

    elif [ "$PLATFORM" = "linux" ]; then
        if [ ! -d "$APP_PATH" ]; then
            print_error "Build artifact not found at: $APP_PATH"
            exit 1
        fi

        # Install to /opt (requires sudo)
        if [ -d "$INSTALL_PATH" ]; then
            print_warning "Existing installation found at $INSTALL_PATH"
            sudo rm -rf "$INSTALL_PATH"
        fi

        print_info "Installing to $INSTALL_PATH (requires sudo)..."
        sudo mkdir -p "$INSTALL_PATH"
        sudo cp -R "$APP_PATH"/* "$INSTALL_PATH/"
        sudo chmod -R 755 "$INSTALL_PATH"

        # Create desktop entry
        DESKTOP_FILE="/usr/share/applications/dockyard.desktop"
        print_info "Creating desktop entry..."

        sudo tee "$DESKTOP_FILE" > /dev/null <<EOF
[Desktop Entry]
Name=Dockyard
Comment=Local-first multi-app workspace manager
Exec=$INSTALL_PATH/dockyard %U
Icon=$INSTALL_PATH/resources/app/assets/icons/icon.png
Terminal=false
Type=Application
Categories=Utility;Network;
StartupWMClass=Dockyard
EOF

        sudo chmod 644 "$DESKTOP_FILE"

        # Create symlink in /usr/local/bin
        print_info "Creating symlink in /usr/local/bin..."
        sudo ln -sf "$INSTALL_PATH/dockyard" /usr/local/bin/dockyard

        print_success "Dockyard installed to $INSTALL_PATH"
        print_info "You can launch it with: dockyard"
    fi
}

# Cleanup
cleanup() {
    print_header "Cleanup"

    if [ "$INTERACTIVE" = true ]; then
        read -p "Remove build artifacts to save space? (Y/n): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Nn]$ ]]; then
            print_info "Removing build artifacts..."
            rm -rf out/
            print_success "Build artifacts removed"
        fi
    else
        print_info "Removing build artifacts to save space..."
        rm -rf out/
        print_success "Build artifacts removed"
    fi
}

# Main installation flow
main() {
    clear
    echo -e "${BLUE}"
    cat << "EOF"
╔══════════════════════════════════════════════╗
║                                              ║
║     ██████╗  ██████╗  ██████╗██╗  ██╗        ║
║     ██╔══██╗██╔═══██╗██╔════╝██║ ██╔╝        ║
║     ██║  ██║██║   ██║██║     █████╔╝         ║
║     ██║  ██║██║   ██║██║     ██╔═██╗         ║
║     ██████╔╝╚██████╔╝╚██████╗██║  ██╗        ║
║     ╚═════╝  ╚═════╝  ╚═════╝╚═╝  ╚═╝        ║
║                                              ║
║    ██╗   ██╗ █████╗ ██████╗ ██████╗          ║
║    ╚██╗ ██╔╝██╔══██╗██╔══██╗██╔══██╗         ║
║     ╚████╔╝ ███████║██████╔╝██║  ██║         ║
║      ╚██╔╝  ██╔══██║██╔══██╗██║  ██║         ║
║       ██║   ██║  ██║██║  ██║██████╔╝         ║
║       ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝╚═════╝          ║
║                                              ║
║        Installation Script v1.0              ║
║                                              ║
╚══════════════════════════════════════════════╝
EOF
    echo -e "${NC}\n"

    print_info "This script will build and install Dockyard on your system"
    print_warning "The process may take several minutes\n"

    if [ "$INTERACTIVE" = true ]; then
        read -p "Continue with installation? (Y/n): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Nn]$ ]]; then
            print_info "Installation cancelled"
            exit 0
        fi
    else
        print_info "Running in non-interactive mode, proceeding with installation..."
        sleep 2
    fi

    detect_platform
    check_prerequisites
    install_dependencies
    build_app
    install_app
    cleanup

    print_header "Installation Complete!"
    print_success "Dockyard has been successfully installed"

    if [ "$PLATFORM" = "darwin" ]; then
        echo -e "\n${GREEN}Launch Dockyard from:${NC}"
        echo -e "  • Applications folder"
        echo -e "  • Spotlight (Cmd+Space, type 'Dockyard')"
        echo -e "  • Terminal: open -a Dockyard"
    elif [ "$PLATFORM" = "linux" ]; then
        echo -e "\n${GREEN}Launch Dockyard with:${NC}"
        echo -e "  • Application menu"
        echo -e "  • Terminal: dockyard"
    fi

    echo -e "\n${BLUE}Enjoy your privacy-focused workspace manager!${NC}\n"
}

# Run main function
main
