# Developer Guide: Browser Development Mode

## Overview

Dockyard now supports development in a regular browser (without Electron), making it easier to iterate on UI changes quickly.

## Why Browser Dev Mode?

- **Faster Iteration**: No need to restart Electron for UI changes
- **Better DevTools**: Use familiar browser DevTools
- **HMR (Hot Module Replacement)**: Instant updates on save
- **Easier Debugging**: Standard browser debugging experience

## Running in Browser Dev Mode

### Option 1: Browser Only (Recommended for UI work)
```bash
npm run dev:renderer
```

Then open `http://localhost:5173` in your browser.

**What you'll see**:
- Full UI renders correctly
- BrowserView components show an informative placeholder
- All other components work normally
- State management works as expected

**Best for**:
- UI/UX development
- Component styling
- Layout adjustments
- State management testing

### Option 2: Full Electron Mode (For BrowserView testing)
```bash
npm run dev
```

This starts both the Vite dev server AND Electron app.

**What you'll see**:
- Full Electron app with native BrowserView support
- All features work including embedded web apps
- Slightly slower iteration due to Electron restart

**Best for**:
- Testing BrowserView functionality
- Testing Electron-specific features
- Final integration testing
- Production-like environment

## Understanding the Placeholder

When running in browser mode, instead of seeing blank screens for apps, you'll see:

```
┌─────────────────────────────────────┐
│  🌐 [App Icon]                      │
│     App Name                        │
│     https://app-url.com             │
│                                     │
│  ⚠️  Browser Development Mode       │
│                                     │
│  You're running Dockyard in a      │
│  regular browser. BrowserView      │
│  components require Electron.      │
│                                     │
│  To see the full app:              │
│  1. Stop the dev server (Ctrl+C)   │
│  2. Run: npm run dev                │
│  3. The Electron app will launch   │
│                                     │
│  [Open in New Tab]  [Reload App]   │
└─────────────────────────────────────┘
```

This placeholder:
- Shows you're in browser mode (not an error!)
- Displays the app name and URL
- Provides clear instructions to run in Electron
- Offers quick actions (open URL, reload)

## How It Works

The codebase automatically detects the environment:

```typescript
// src/renderer/src/utils/environment.ts
export const isElectron = (): boolean => {
  return typeof window !== 'undefined' && window.dockyard !== undefined;
};
```

Components conditionally render based on environment:

```typescript
// In BrowserViewContainer.tsx
if (!isElectron()) {
  return <BrowserDevPlaceholder appName={app.name} appUrl={app.url} />;
}

// Render actual BrowserView container
return <div ref={containerRef}>...</div>;
```

## Development Workflow

### For UI Development (Recommended)
1. Start browser dev mode: `npm run dev:renderer`
2. Open `http://localhost:5173`
3. Make changes to components
4. See instant updates (HMR)
5. Use browser DevTools for debugging

### For Feature Development
1. Start full dev mode: `npm run dev`
2. Electron app launches automatically
3. Make changes to code
4. App reloads automatically (main process requires manual restart)
5. Test full functionality

### Best Practices

**Use Browser Mode When**:
- Designing layouts
- Styling components
- Testing React state
- Debugging UI logic
- Working on modals/overlays

**Use Electron Mode When**:
- Testing BrowserView functionality
- Testing IPC communication
- Testing native features
- Final QA before commit

## Troubleshooting

### "window.dockyard is undefined"
This is expected in browser mode! The placeholder handles this gracefully.

### Seeing blank screens instead of placeholder
Check that you've imported the environment utilities:
```typescript
import { isElectron } from '../utils/environment';
```

### HMR not working
Restart the dev server:
```bash
# Stop current server (Ctrl+C)
npm run dev:renderer
```

### Changes not reflecting in Electron
Main process changes require manual restart:
```bash
# Stop current process (Ctrl+C)
npm run dev
```

## TypeScript Support

The `window.dockyard` object is properly typed via `global.d.ts`:

```typescript
declare global {
  interface Window {
    dockyard?: DockyardAPI;
  }
}
```

TypeScript will:
- Autocomplete all API methods
- Show type errors if misused
- Provide inline documentation

## Contributing

When adding new Electron-specific features:

1. Check environment first:
```typescript
if (!isElectron()) {
  // Provide fallback or placeholder
  return <DevModePlaceholder />;
}

// Electron-specific code
window.dockyard.someAPI();
```

2. Always provide browser mode fallback
3. Document behavior in both modes
4. Test in both environments

## Examples

### Conditional Feature Rendering
```typescript
function MyComponent() {
  if (!isElectron()) {
    return (
      <div className="dev-notice">
        This feature requires Electron
      </div>
    );
  }

  return <ActualFeature />;
}
```

### Graceful Degradation
```typescript
function AppControls() {
  const handleAction = async () => {
    if (isElectron()) {
      await window.dockyard.apps.create(data);
    } else {
      console.log('[Dev Mode] Would create app:', data);
      // Update local state for UI testing
    }
  };

  return <button onClick={handleAction}>Create App</button>;
}
```

## Summary

Browser dev mode significantly improves development experience by allowing fast UI iteration while maintaining full functionality in Electron when needed. The automatic detection and graceful fallbacks ensure a smooth experience in both environments.
