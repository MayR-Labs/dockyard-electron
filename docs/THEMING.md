# Dockyard Theming & Customization Guide

This guide explains how to use the theming and customization features in Dockyard.

## Overview

Dockyard provides comprehensive theming and customization options to personalize your workspace:

- **Theme Modes**: Light, Dark, and System (follows OS preference)
- **Accent Colors**: Choose from presets or use any custom color
- **Background Styles**: Solid, Glass (translucent), or Minimal (transparent)
- **Theme Presets**: Quick-apply predefined theme configurations
- **Per-App Styling**: Inject custom CSS and JavaScript into individual apps

## Accessing Theme Settings

1. Click the **Theme** icon (paint palette) in the top-right corner of the window chrome
2. The Theme Settings modal will open

## Theme System

### Theme Modes

- **Dark Mode**: Default dark theme optimized for low-light environments
- **Light Mode**: Clean light theme for well-lit spaces
- **System Mode**: Automatically follows your operating system's theme preference

### Accent Colors

Choose from 10 preset colors or use a custom color picker:

- Indigo (default)
- Blue
- Purple
- Pink
- Red
- Orange
- Yellow
- Green
- Teal
- Cyan

The accent color affects:
- Primary buttons and interactive elements
- Selected states
- Focus rings
- Sidebar highlights

### Background Styles

#### Solid (Default)
Standard opaque background with full color depth.

#### Glass
Translucent background with blur effect, showing desktop behind the window.
- Best for aesthetic appeal
- May impact performance on older hardware

#### Minimal
Transparent background for maximum desktop visibility.
- Experimental feature
- Works best with dark wallpapers

### Theme Presets

Quick-apply combinations:

- **Default Dark**: Indigo accent, solid background, dark mode
- **Default Light**: Indigo accent, solid background, light mode
- **Glass Dark**: Purple accent, glass background, dark mode
- **Minimal Dark**: Green accent, minimal background, dark mode

## Per-App Customization

### Custom CSS Injection

Inject custom CSS to modify the appearance of specific apps.

**Example: Hide annoying banners**
```css
.cookie-banner {
  display: none !important;
}
```

**Example: Custom color scheme**
```css
body {
  background-color: #1a1a1a;
  color: #e0e0e0;
}

a {
  color: #6366f1;
}
```

### Custom JavaScript Injection

⚠️ **Security Warning**: Only inject JavaScript from trusted sources. Malicious code can compromise your data and privacy.

**Example: Remove element**
```javascript
document.querySelector('.annoying-banner')?.remove();
```

**Example: Auto-fill form**
```javascript
setTimeout(() => {
  document.querySelector('#username').value = 'myusername';
}, 1000);
```

### Accessing App Customization

1. Right-click on an app in the dock
2. Select "Customize" from the context menu
3. Edit CSS or JavaScript in the modal
4. Click "Test CSS" or "Test JavaScript" to preview changes
5. Click "Save Changes" to persist

## CSS Variables

Dockyard uses CSS variables for theming. Advanced users can reference these in custom CSS:

### Color Variables

```css
--background
--foreground
--primary
--primary-foreground
--accent
--accent-foreground
--border
--muted
--muted-foreground
--sidebar-background
--sidebar-primary
```

### Usage Example

```css
.custom-element {
  background-color: hsl(var(--primary));
  color: hsl(var(--primary-foreground));
  border: 1px solid hsl(var(--border));
}
```

## Tips & Best Practices

### Performance

- **Glass backgrounds** may reduce performance on older hardware
- **Custom JavaScript** runs on every page load - keep it lightweight
- Use CSS instead of JavaScript when possible

### Compatibility

- CSS injection works on all web apps
- JavaScript injection may fail on apps with strict Content Security Policies (CSP)
- Some apps may override custom styles with `!important`

### Debugging

- Use the **Test** buttons in the customization modal to preview changes
- Open app DevTools (Right-click → "Toggle DevTools") to debug custom scripts
- Check the console for JavaScript errors

## Keyboard Shortcuts

- **Ctrl/Cmd+Shift+T**: Quick theme toggle (planned)
- **Ctrl/Cmd+,**: Open settings (includes theme)

## Persistence

All theme settings and custom CSS/JS are:
- Saved locally in your profile
- Persistent across app restarts
- Not synced to the cloud (privacy-first)

## Troubleshooting

### Theme not applying
- Refresh the app by pressing Ctrl/Cmd+R
- Check that settings are saved (green checkmark)
- Restart Dockyard if issues persist

### Custom CSS not working
- Verify CSS syntax is correct
- Check if the app overrides styles with `!important`
- Use browser DevTools to inspect elements

### Custom JavaScript errors
- Check console for error messages
- Ensure the target elements exist when script runs
- Try wrapping code in `setTimeout()` to wait for page load

### Glass background not showing
- Ensure your OS supports transparency
- Check if compositor is enabled (Linux)
- Try switching to Solid background

## Future Features

Planned enhancements (Phase 6+):

- Theme import/export
- Community theme marketplace
- Custom icon themes
- Advanced layout templates
- Keyboard shortcut customization UI

## Support

For issues or feature requests:
- GitHub Issues: https://github.com/MayR-Labs/dockyard-electron/issues
- Documentation: See ROADMAP.md for development progress

---

**Last Updated**: November 2024
