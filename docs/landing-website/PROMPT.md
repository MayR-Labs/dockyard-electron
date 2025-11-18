# AI Prompt for Dockyard Landing Page Development

This document contains a comprehensive prompt for AI assistants (like ChatGPT, Claude, or GitHub Copilot) to help build the Dockyard landing page with Next.js.

---

## Primary Prompt

```
I need help building a landing page for Dockyard, an open-source, privacy-first multi-app workspace desktop application. The landing page should be built with Next.js 14+ (App Router), TypeScript, TailwindCSS, and Framer Motion.

## About Dockyard

Dockyard is an Electron-based desktop application that unifies multiple web apps (Gmail, Slack, Notion, Figma, etc.) into one customizable workspace. It's a privacy-first, open-source alternative to Rambox, Station, and Franz.

### Key Selling Points:
- **Privacy-First**: No telemetry, no tracking, all data stays local
- **Open Source**: MIT licensed, fully auditable code
- **Free Forever**: No subscriptions or feature gating
- **Fully Customizable**: Themes, layouts, custom CSS/JS per app
- **Professional Features**: Session isolation, auto-hibernation, multiple instances
- **Cross-Platform**: Windows, macOS, Linux

### Target Audience:
- Developers and tech professionals
- Privacy-conscious users
- Productivity enthusiasts
- Remote workers managing multiple accounts
- Designers organizing creative tools

## Landing Page Requirements

### Tech Stack:
- Next.js 14+ with App Router
- TypeScript for type safety
- TailwindCSS for styling (match Dockyard's design)
- Framer Motion for smooth animations
- next/image for optimized images
- Deployment: Vercel or Netlify

### Design Principles:
- **Modern & Clean**: Match Dockyard's aesthetic (see color scheme below)
- **Fast & Performant**: Optimize for Core Web Vitals
- **Mobile-First**: Responsive design, works beautifully on all devices
- **SEO-Optimized**: Proper meta tags, semantic HTML, fast load times

### Color Scheme (Match Dockyard):
- Primary/Accent: Indigo #6366f1
- Background Dark: #1a1a1a (for hero/dark sections)
- Background Light: #ffffff
- Text Dark: #0a0a0a
- Text Light: #f5f5f5
- Muted: #6b7280

### Page Sections:

1. **Hero Section**
   - Bold headline: "The Open-Source Workspace for Your Web Apps"
   - Subheadline: Value proposition about privacy and customization
   - Primary CTA: "Download for [Platform]" (auto-detect OS)
   - Secondary CTA: "Star on GitHub"
   - Hero visual: Animated screenshot or 3D mockup

2. **Problem/Solution Section**
   - Highlight issues with existing solutions
   - Show how Dockyard solves them
   - Comparison table: Dockyard vs Rambox vs Station vs Franz

3. **Features Section**
   - Grid or cards showcasing top 6-8 features:
     * Privacy-First (no tracking)
     * Fully Customizable (themes, CSS/JS)
     * Session Isolation
     * Auto-Hibernation
     * Multiple Profiles
     * Cross-Platform
   - Icons for each feature
   - Brief descriptions with benefits

4. **Screenshots/Demo Section**
   - High-quality screenshots showing:
     * Different themes (light/dark)
     * Multiple apps open
     * Customization options
   - Optional: Embedded demo video

5. **Privacy & Open Source Section**
   - Emphasize local-first architecture
   - Link to GitHub repo with live stats (stars, forks)
   - Explain MIT license benefits

6. **Download Section**
   - Platform-specific download buttons (Windows, macOS, Linux)
   - Installation instructions (expandable)
   - System requirements
   - Alternative: "View on GitHub" for source code

7. **Footer**
   - Links to documentation
   - GitHub repo
   - License info
   - Built with ❤️ by MayR Labs

### Key Features to Highlight:
(See FEATURES.md for full details)

**Privacy & Security:**
- Zero telemetry or tracking
- All data stored locally
- Open source and auditable
- Complete session isolation

**Customization:**
- Light/dark/system themes
- Custom accent colors
- Per-app CSS/JS injection
- Configurable dock positions

**Productivity:**
- Multiple profiles & workspaces
- Auto-hibernation
- Performance monitoring
- Keyboard shortcuts

**Advanced:**
- Multiple instances per app
- Native notifications
- Split layouts
- DevTools integration

### Content Tone:
- Clear and direct, no marketing fluff
- Technical but accessible
- Privacy-focused messaging
- Community-oriented

### SEO Requirements:
- Title: "Dockyard - Open Source Multi-App Workspace"
- Meta description: "Privacy-first desktop workspace for all your web apps. Open source alternative to Rambox with session isolation, auto-hibernation, and full customization."
- Open Graph tags for social sharing
- Structured data (JSON-LD) for rich snippets

### Performance Requirements:
- Lighthouse score: 90+ on all metrics
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3.5s
- Optimized images with next/image
- Lazy loading for below-the-fold content

## Deliverables Needed:

1. **Complete Next.js Project Structure**
   ```
   dockyard-landing/
   ├── app/
   │   ├── page.tsx           # Home page
   │   ├── layout.tsx         # Root layout
   │   ├── globals.css        # Global styles
   │   ├── components/
   │   │   ├── Hero.tsx
   │   │   ├── Features.tsx
   │   │   ├── Comparison.tsx
   │   │   ├── Screenshots.tsx
   │   │   ├── Download.tsx
   │   │   └── Footer.tsx
   │   └── metadata.ts        # SEO metadata
   ├── public/
   │   ├── images/
   │   └── icons/
   ├── tailwind.config.ts
   ├── tsconfig.json
   └── package.json
   ```

2. **Component Code** for each section
3. **TailwindCSS Configuration** with Dockyard colors
4. **Framer Motion Animations** for smooth interactions
5. **SEO Metadata** and Open Graph tags
6. **README** with setup instructions

## Specific Implementation Details:

### Hero Component:
- Gradient background (dark to darker)
- Large, bold headline with gradient text effect
- Animated CTA buttons with hover effects
- Auto-detect user's OS for download button text
- GitHub stars badge (fetch from API)

### Features Grid:
- 3-column grid on desktop, 1-column on mobile
- Icon + Title + Description for each feature
- Hover effect: slight scale + glow
- Icons: Use Heroicons or Lucide icons
- Smooth entrance animation with Framer Motion

### Comparison Table:
- Responsive table with sticky header
- Checkmarks (✅) and X marks (❌) for features
- Highlight Dockyard column with subtle background
- Mobile: Convert to cards

### Download Section:
- Auto-detect OS and show primary CTA for user's platform
- Expandable "Other Platforms" accordion
- Installation instructions with code blocks
- Styled download buttons matching Dockyard theme

### Footer:
- Dark background (#1a1a1a)
- Three columns: Product, Developers, Community
- Social links if applicable
- MIT License badge

## Example Code Snippets:

### Hero Button with OS Detection:
```typescript
'use client';

import { useEffect, useState } from 'react';

export function DownloadButton() {
  const [platform, setPlatform] = useState('');

  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.includes('win')) setPlatform('Windows');
    else if (userAgent.includes('mac')) setPlatform('macOS');
    else if (userAgent.includes('linux')) setPlatform('Linux');
  }, []);

  return (
    <button className="bg-indigo-600 hover:bg-indigo-700 px-8 py-4 rounded-lg font-semibold">
      Download for {platform || 'Your Platform'}
    </button>
  );
}
```

### Feature Card with Animation:
```typescript
'use client';

import { motion } from 'framer-motion';

interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export function FeatureCard({ icon, title, description }: FeatureProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="p-6 bg-gray-900 rounded-xl border border-gray-800 hover:border-indigo-600"
    >
      <div className="text-indigo-500 mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </motion.div>
  );
}
```

## Additional Context:

- Dockyard is currently at v0.6.0 (Beta), Phase 5 complete
- GitHub repo: https://github.com/MayR-Labs/dockyard-electron
- Built with Electron, React, TypeScript, TailwindCSS, Vite
- Target users are tech-savvy, value privacy and open source
- Main competitors: Rambox ($7/mo), Station (freemium), Franz ($5/mo)

## Reference Materials:

- See ABOUT.md for detailed messaging and value propositions
- See FEATURES.md for complete feature list and descriptions
- See README.md for current project overview
- Design inspiration: Linear, Raycast, Arc Browser (modern, clean, fast)

---

Please help me build this landing page step-by-step:
1. Set up the Next.js project with proper configuration
2. Create the layout and global styles
3. Build each section as a separate component
4. Implement smooth animations with Framer Motion
5. Optimize for performance and SEO
6. Ensure mobile responsiveness

Start by setting up the project structure and asking any clarifying questions.
```

---

## Follow-Up Prompts

### If the AI needs more details:

**About Design:**
> "For the design, aim for a modern, minimalist aesthetic similar to Linear or Raycast. Use dark mode by default for the hero section (black to dark gray gradient), then transition to light backgrounds for feature sections. Add subtle glow effects on hover for interactive elements."

**About Content:**
> "For content, emphasize three core values: Privacy (no tracking), Freedom (open source), and Control (customization). The tone should be direct and honest, not typical marketing speak. Technical users should feel respected, not talked down to."

**About Animations:**
> "Keep animations subtle and purposeful. Entrance animations should be quick (<300ms). Hover effects can scale elements by 1.05x with a smooth transition. Use Framer Motion's viewport animations to fade in sections as users scroll."

**About Mobile:**
> "Mobile-first is critical. The hero should still feel impactful on small screens. Convert the features grid to a vertical stack. The comparison table should become expandable cards. Download buttons should be full-width on mobile."

### If the AI asks about specific features:

**Feature Priority:**
> "For the features section, prioritize in this order:
> 1. Privacy-First (most important to our audience)
> 2. Open Source (builds trust)
> 3. Customization (differentiator from competitors)
> 4. Session Isolation (key technical feature)
> 5. Free Forever (budget-conscious users)
> 6. Cross-Platform (wide reach)"

### If the AI asks about screenshots:

**Screenshots Needed:**
> "We need screenshots showing:
> 1. Main workspace with multiple apps open (Gmail, Slack, Notion)
> 2. Dark theme with purple accent color (hero/demo)
> 3. Light theme for feature section
> 4. Settings panel showing customization options
> 5. Performance monitoring dashboard
> 6. Theme customization modal
> 
> For now, use placeholder images or mock descriptions. We'll add real screenshots later."

---

## Alternative Prompt (Shorter Version)

```
Build a Next.js 14 landing page for Dockyard, an open-source Electron app (like Rambox) that organizes web apps in one workspace. Use TypeScript, TailwindCSS, and Framer Motion.

Key points:
- Privacy-first (no tracking, local-only data)
- Open source (MIT license)
- Free forever
- Customizable themes and layouts
- Session isolation, auto-hibernation
- Cross-platform (Windows/macOS/Linux)

Page sections: Hero with CTA, Features grid, Comparison table, Screenshots, Download section, Footer.

Use indigo (#6366f1) as primary color. Dark hero section, clean modern design. Mobile-first responsive. Auto-detect OS for download button.

Reference: See FEATURES.md and ABOUT.md for full content.
```

---

## Tips for Working with AI on This Project

1. **Be Specific**: Provide exact color codes, spacing, and component requirements
2. **Iterate**: Start with structure, then refine styling and animations
3. **Ask for Explanations**: Understand the code so you can maintain it
4. **Request Alternatives**: If something doesn't work, ask for different approaches
5. **Test Incrementally**: Build and test each section before moving on

---

**This prompt is designed to give any AI assistant enough context to build a high-quality landing page for Dockyard. Adjust based on which AI you're using and what specific help you need.**
