# Dockyard Landing Page - Documentation

This directory contains all the documentation needed to build the Dockyard landing page with Next.js.

## Overview

The landing page will serve as the marketing and information hub for Dockyard, showcasing its features, benefits, and encouraging downloads. It should be:

- **Fast** - Optimized for performance and SEO
- **Beautiful** - Modern, clean design that reflects the app's polish
- **Informative** - Clear messaging about what Dockyard is and why it's valuable
- **Conversion-focused** - Drive downloads and GitHub stars

## Documentation Files

- **ABOUT.md** - Content for the "About" section
- **FEATURES.md** - Detailed features breakdown for the landing page
- **PROMPT.md** - AI assistant prompt for Next.js development

## Tech Stack Recommendation

### Recommended: Next.js 14+
- **Framework**: Next.js 14+ with App Router
- **Styling**: TailwindCSS (matches Dockyard app styling)
- **Animation**: Framer Motion (matches Dockyard app)
- **Deployment**: Vercel or Netlify
- **Analytics**: Optional (Plausible for privacy-friendly analytics)

### Alternative: Astro
- Faster static sites, perfect for landing pages
- Component islands for interactive sections
- Good SEO out of the box

## Page Structure

### 1. Hero Section
- Bold headline about what Dockyard is
- Subheadline explaining the value proposition
- Primary CTA: "Download for [Platform]"
- Secondary CTA: "View on GitHub"
- Hero image or animated demo

### 2. Problem/Solution Section
- Highlight the problems with existing solutions (Rambox, Station, etc.)
- Show how Dockyard solves them
- Use comparison table or side-by-side visuals

### 3. Features Section
- Grid or cards showcasing key features
- Icons and brief descriptions
- Link to detailed feature pages or expand inline

### 4. Screenshots/Demo Section
- High-quality screenshots of the app in action
- Interactive demo or video walkthrough
- Show different themes and layouts

### 5. Privacy & Open Source
- Emphasize local-first, no telemetry
- Link to GitHub repository
- Show community stats (stars, contributors, etc.)

### 6. Download Section
- Platform-specific download buttons
- Installation instructions
- System requirements
- Alternative: "Star on GitHub" CTA

### 7. Footer
- Links to documentation
- Social media (if applicable)
- License information
- Contact/support

## Design Principles

### Colors
- Match Dockyard's default theme colors
- Primary: Indigo (#6366f1)
- Dark background for hero: Match app dark theme
- Use gradients sparingly for visual interest

### Typography
- Clear, readable fonts
- Hierarchy: Large headlines, readable body text
- Match Dockyard's font choices if possible

### Components
- Buttons should match Dockyard's button style
- Use glassmorphism effects sparingly (match app aesthetic)
- Smooth animations and transitions (Framer Motion)

### Responsive Design
- Mobile-first approach
- Desktop: Wide hero, multi-column layouts
- Mobile: Stacked sections, hamburger menu

## Content Tone

- **Clear and Direct** - No marketing fluff
- **Technical but Accessible** - Explain features simply
- **Privacy-Focused** - Emphasize local-first, open source
- **Community-Oriented** - Highlight contributions, open development

## SEO Considerations

### Meta Tags
```html
<title>Dockyard - Open Source Multi-App Workspace</title>
<meta name="description" content="Privacy-first desktop workspace for all your web apps. Open source alternative to Rambox with session isolation, auto-hibernation, and full customization." />
```

### Keywords
- Multi-app workspace
- Open source Rambox alternative
- Privacy-first app manager
- Desktop web app organizer
- Session isolation workspace

### Open Graph
- Share-worthy images
- Clear title and description for social media

## Development Guidelines

### File Structure (Next.js)
```
landing/
├── app/
│   ├── page.tsx           # Home page
│   ├── layout.tsx         # Root layout
│   ├── globals.css        # Global styles
│   └── components/
│       ├── Hero.tsx
│       ├── Features.tsx
│       ├── Screenshots.tsx
│       ├── Download.tsx
│       └── Footer.tsx
├── public/
│   ├── images/
│   └── logos/
└── tailwind.config.ts
```

### Component Style
- Use TypeScript for all components
- Functional components with hooks
- Extract reusable components
- Keep components small and focused

### Performance
- Optimize images (next/image)
- Lazy load below-the-fold content
- Minimize JavaScript bundle size
- Use static generation where possible

## Assets Needed

### Images
- Hero image or animation
- App screenshots (different themes, layouts)
- Feature icons
- Logo in various sizes
- Social media share image

### Branding
- Logo (SVG preferred)
- App icon
- Color palette
- Typography guidelines

## Launch Checklist

- [ ] All content written and reviewed
- [ ] Images optimized and uploaded
- [ ] SEO meta tags configured
- [ ] Open Graph tags added
- [ ] Analytics setup (optional)
- [ ] Performance tested (Lighthouse score)
- [ ] Mobile responsiveness verified
- [ ] Cross-browser tested
- [ ] Download links verified
- [ ] GitHub links working
- [ ] Domain configured (if custom domain)
- [ ] SSL certificate active
- [ ] 404 page created
- [ ] Sitemap generated
- [ ] robots.txt configured

## Maintenance

### Regular Updates
- Update screenshots when major features ship
- Update download links with new releases
- Keep GitHub stats fresh (stars, downloads)
- Add new features to feature list
- Update roadmap status

### Monitoring
- Check broken links monthly
- Monitor page load times
- Review analytics (if implemented)
- Monitor GitHub issues for feedback

## Future Enhancements

- Interactive demo in browser
- Video walkthrough
- User testimonials
- Case studies
- Blog/changelog section
- Community showcase (user setups)
- Plugin marketplace (Phase 8)

---

**For Next.js implementation details and AI prompt, see PROMPT.md**
