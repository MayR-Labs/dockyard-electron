# CI/CD Setup for Dockyard

This document describes the GitHub Actions workflows configured for this project.

## Workflows

### CI Workflow (`.github/workflows/ci.yml`)

**Triggers:**
- Push to `main` or `develop` branches
- Pull requests to `main` or `develop` branches

**What it does:**
1. Runs on Ubuntu, Windows, and macOS
2. Installs dependencies
3. Runs linter (`npm run lint`)
4. Runs tests (`npm test`)
5. Builds the application (`npm run build`)
6. Verifies build output structure
7. Uploads build artifacts (Ubuntu only)

**Requirements:**
- Node.js 20.x
- All tests must pass
- Linter must pass with no errors
- Build must complete successfully

### Release Workflow (`.github/workflows/release.yml`)

**Triggers:**
- Pushing a tag starting with `v` (e.g., `v1.0.0`)

**What it does:**
1. Runs on Ubuntu, Windows, and macOS
2. Installs dependencies and builds the application
3. Packages the application for each platform:
   - Linux: `.tar.gz` archive
   - Windows: `.zip` archive
   - macOS: `.zip` archive
4. Creates a GitHub release with the packaged applications

**Creating a Release:**
```bash
# Tag the commit
git tag v1.0.0

# Push the tag
git push origin v1.0.0
```

## Local Testing

### Running CI checks locally:
```bash
# Install dependencies
npm ci

# Run linter
npm run lint

# Run tests
npm test

# Build application
npm run build

# Verify build output
ls -la out/main/main/index.js
ls -la out/preload/preload/index.js
ls -la out/renderer/index.html
```

### Testing packaging locally:
```bash
# Build the application
npm run build

# Package for your platform
npx electron-packager . dockyard --out=dist --overwrite
```

## Troubleshooting

### Build failures
- Ensure all source files are valid JavaScript (no TypeScript syntax)
- Check that all dependencies are installed
- Verify Node.js version is 20.x

### Packaging failures
- Ensure the build completed successfully before packaging
- Check that `out/main/main/index.js` exists
- Verify .electronignore is properly configured

### Release workflow not triggering
- Ensure the tag starts with `v`
- Check that the tag was pushed to GitHub
- Verify GitHub Actions is enabled for the repository

## Files to Update

When adding new features or making changes, you may need to update:
- `package.json`: Update scripts or dependencies
- `.electronignore`: Control what gets packaged
- `.github/workflows/ci.yml`: Modify CI checks
- `.github/workflows/release.yml`: Change release process
