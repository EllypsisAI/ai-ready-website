# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AI Ready Website is a Next.js web application that analyzes websites for AI readiness and optimization. It uses Firecrawl to scrape website content and provides real-time scoring, recommendations, SEO checks, and accessibility analysis.

**Key Technologies:**
- Next.js 14.2 (App Router)
- React 18.2
- TypeScript
- Tailwind CSS with custom design system
- Firecrawl for web scraping
- OpenAI API for AI analysis
- Jotai for state management
- Framer Motion for animations

## Development Commands

```bash
# Install dependencies
npm install

# Development server (runs on http://localhost:3000)
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## Environment Setup

Create a `.env.local` file with:
```bash
OPENAI_API_KEY=your_openai_api_key
FIRECRAWL_API_KEY=your_firecrawl_api_key
```

Both API keys are required for full functionality:
- **OPENAI_API_KEY**: Used for AI-powered content analysis
- **FIRECRAWL_API_KEY**: Used for web scraping and content extraction

## Architecture

### Directory Structure

```
app/
  ├── api/                    # Next.js API routes
  │   ├── ai-readiness/      # Main AI readiness analysis endpoint
  │   ├── ai-analysis/       # AI-powered content analysis
  │   ├── check-config/      # API key validation
  │   └── check-llms/        # LLM availability check
  ├── layout.tsx             # Root layout
  └── page.tsx               # Homepage

components/
  ├── ui/                    # Raw, unstyled base components
  │   ├── shadcn/           # ShadCN UI primitives
  │   └── motion/           # Framer Motion primitives
  ├── shared/               # Reusable components (used in 2+ places)
  │   ├── buttons/
  │   ├── effects/          # Visual effects (flame animations, etc.)
  │   ├── header/
  │   └── layout/
  └── app/                  # Page-specific components
      └── (home)/           # Homepage components
          └── sections/     # Hero, analysis sections, etc.

atoms/                      # Jotai atoms for state management
hooks/                      # Custom React hooks
utils/                      # Utility functions
styles/                     # CSS files and design system
```

### Component Organization Rules

**Three-tier component architecture:**

1. **UI Primitives (`/components/ui`)**: Raw, minimally styled base components with no app-specific logic
2. **Shared Components (`/components/shared`)**: Composed, reusable components used in 2+ places
3. **App Components (`/components/app`)**: Page-specific components used in a single route

**Import Pattern:**
```tsx
// UI Primitives
import { Button } from '@/components/ui/shadcn/button';
import { FadeIn } from '@/components/ui/motion/fade-in';

// Shared components
import Button from '@/components/shared/button/Button';
import HeroFlame from '@/components/shared/effects/flame/hero-flame';

// Page-specific
import ControlPanel from '@/components/app/(home)/sections/ai-readiness/ControlPanel';
```

### Fire Design System

This project uses a custom "fire" theme with specific design patterns:

**Color System:**
- Heat scale colors: `--heat-4` through `--heat-200` (fire orange shades)
- P3 color space for richer colors with sRGB fallbacks
- Defined in `colors.json` and accessed via CSS variables

**Typography:**
- Display font: SuisseIntl (weights: 400, 450, 500, 600, 700)
- Monospace: System monospace stack
- Type scale classes: `.title-h1` through `.title-h5`, `.body-*`, `.label-*`, `.mono-*`

**Common Patterns:**
- Border radius: `rounded-12`
- Active state: `active:scale-[0.98]`
- Orange glow effects on interactive elements
- Gradient utilities: `.gradient-fire`, `.gradient-heat`, `.gradient-sunset`

**Styling Files:**
- Component-specific styles: `styles/components/`
- Design system utilities: `styles/design-system/`
- Main CSS: `styles/main.css`

### API Routes

**POST /api/ai-readiness**
- Main analysis endpoint
- Input: `{ url: string }`
- Returns: Overall score, checks array, HTML content, metadata
- Analyzes: Heading structure, readability, meta tags, semantic HTML, accessibility, robots.txt, sitemap.xml, llms.txt

**POST /api/ai-analysis**
- AI-powered content analysis using OpenAI
- Requires OPENAI_API_KEY
- Returns detailed AI-generated recommendations

**GET /api/check-config**
- Validates presence of required API keys
- Returns: `{ hasOpenAIKey: boolean, hasFirecrawlKey: boolean }`

**GET /api/check-llms**
- Checks LLM API availability

### Path Aliases

TypeScript path alias `@/*` maps to the root directory:
```typescript
import Component from '@/components/shared/Component';
import { util } from '@/utils/util';
import { atom } from '@/atoms/atom';
```

### State Management

- Uses Jotai for global state
- Atoms defined in `atoms/` directory
- Example: `atoms/sheets.ts` for sheet/modal state

### Styling Approach

1. **Tailwind CSS** for utility-first styling with extensive customization
2. **CSS Custom Properties** for the fire design system colors
3. **Component CSS** for component-specific styles in `styles/components/`
4. **PostCSS** for optimization and nesting support

Custom Tailwind configuration includes:
- Size utilities (0-999px + fractional percentages)
- Opacity utilities (0-99)
- Transition duration utilities (0-2950ms in 50ms increments)
- Fire-themed color palette from `colors.json`

### Key Features

1. **AI Readiness Analysis**: Comprehensive website analysis using Firecrawl
   - HTML structure analysis
   - Readability scoring (Flesch-Kincaid)
   - Heading hierarchy validation
   - Meta tag quality checks
   - Semantic HTML evaluation
   - Accessibility scoring
   - robots.txt, sitemap.xml, and llms.txt detection

2. **Visual Effects**: Custom flame animations and ASCII art backgrounds using PixiJS

3. **Real-time Analysis**: Progressive loading states with step-by-step feedback

## Planning & Documentation

This project uses a structured planning system in the `plans/` directory:

- **`plans/README.md`**: Overview of the planning system
- **`plans/active/`**: Current features being implemented
- **`plans/completed/`**: Completed features with implementation details
- **`plans/future/`**: Ideas and planned enhancements

**When working on new features:**
1. Check `plans/active/` for ongoing work to avoid conflicts
2. Review `plans/completed/` for context on existing features
3. Refer to specific plan files only when needed (they are NOT loaded into context by default)

**Key completed features:**
- `plans/completed/paid-reports.md` - Premium report generation system (Stripe, OpenAI, Vercel KV, Resend)

## Important Conventions

- All component files use PascalCase for directories and files
- TypeScript strict mode enabled (except `noImplicitAny: false`)
- Use fire design system colors and patterns consistently
- Follow the three-tier component architecture strictly
- Always prefer editing existing components over creating new ones
