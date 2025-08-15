# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is **Gyoza**, a static blog template built with Astro and React. It's a modern, fast blog with features like dark mode, search, comments, and SEO optimization.

## Development Commands

### Essential Commands

- `pnpm dev` - Start development server at `localhost:4321`
- `pnpm build` - Build production site (includes type checking and Pagefind search indexing)
- `pnpm preview` - Preview build locally
- `pnpm lint` - Format code using Prettier

### Content Management Scripts

- `pnpm new-post` - Create new blog post interactively
- `pnpm new-project` - Add new project to portfolio
- `pnpm new-friend` - Add new friend link

## Project Architecture

### Core Framework Stack

- **Astro** - Main framework with React integration
- **React** - Interactive components using `@astrojs/react`
- **Tailwind CSS** - Styling with custom dark mode support
- **TypeScript** - Type safety with strict mode enabled
- **Framer Motion** - Animations and transitions
- **Jotai** - State management for theme, modal stack, and scroll info

### Key Directories and Files

#### Configuration

- `src/config.json` - Main site configuration (colors, menus, metadata, analytics)
- `astro.config.js` - Astro configuration with custom remark/rehype plugins
- `tailwind.config.ts` - Tailwind configuration with custom color system
- `src/content/config.ts` - Content collection schemas using Zod

#### Content Structure

- `src/content/posts/` - Blog posts (Markdown with frontmatter)
- `src/content/projects/` - Project portfolio data (YAML)
- `src/content/friends/` - Friend links data (YAML)
- `src/content/spec/` - Special pages (Markdown)

#### Component Architecture

- `src/components/` - Organized by feature:
  - `head/` - SEO, analytics, theme management
  - `header/` - Navigation, search, mobile drawer
  - `post/` - Post-specific components (TOC, navigation, meta)
  - `footer/` - Footer with theme switch and running days
  - `provider/` - React context providers for state management
  - `ui/modal/` - Modal system with stack management
  - `comment/` - Waline comment system integration
  - `hero/` - Homepage hero section with 3D interactive model system

#### Hero 3D Interactive Model System

- **Hero.astro** - Main hero section container that integrates all hero components
- **InteractiveProject.tsx** - Main 3D project viewer component with project switching functionality
- **ProjectViewer.tsx** - Three.js-based 3D model viewer with mouse/touch interaction support
- **ProjectSwitcher.tsx** - Project navigation controls with previous/next buttons and project list
- **ProjectLibrary.ts** - Project management system with YAML configuration support
- **useProjectViewer.ts** - Custom hook for Three.js scene management and model loading
- **SocialList.tsx** - Social media links with animated hover effects

**Key Features:**

- **3D Model Loading**: Supports both built-in geometric shapes (sphere, cube, torus, pyramid) and external 3D models (.glb, .gltf, .obj)
- **Interactive Controls**: Mouse drag and touch support for model rotation with elastic return animation
- **Project Management**: Dynamic project loading from YAML configuration with display control
- **Responsive Design**: Adaptive sizing for mobile (200px) and desktop (300px) displays
- **Error Handling**: Graceful fallback to avatar image on 3D loading errors
- **Animation**: Smooth transitions using Framer Motion for project switching and UI elements

#### Plugin System

- `src/plugins/` - Custom remark and rehype plugins for Markdown processing:
  - `remarkReadingTime` - Calculate reading time
  - `rehypeCodeBlock` - Code block styling
  - `rehypeCodeHighlight` - Syntax highlighting with Shiki
  - `remarkEmbed` - Content embedding functionality
  - `remarkSpoiler` - Spoiler text support

### State Management

Uses Jotai atoms for global state:

- `src/store/theme.ts` - Theme (light/dark) management
- `src/store/modalStack.ts` - Modal stack system
- `src/store/scrollInfo.ts` - Scroll position tracking
- `src/store/viewport.ts` - Viewport dimensions

### Content Collections

Uses Astro Content Collections with Zod schemas:

- Posts: title, date, tags, category, comments, draft, sticky
- Projects: title, description, image, link
- Friends: title, description, avatar, link
- Spec: Special pages with title, description

### Page Transitions

Uses `@swup/astro` for smooth page transitions with:

- Theme persistence during transitions
- Morphing for provider components
- Disabled for RSS and sitemap links

### Search Integration

- Uses **Pagefind** for static site search
- Search index built during `pnpm build` process
- Search UI in header with mobile support

### Styling System

- CSS variables for theming (`--color-accent`, `--color-text-primary`, etc.)
- Custom Tailwind utilities for theme colors
- Font stack with Chinese font support (Noto Sans SC, Source Han Sans)
- Responsive design with mobile-first approach

### Build Process

- Type checking with `@astrojs/check`
- Pagefind search index generation
- SWUP transition optimization
- External handling for Pagefind assets

### Development Workflow

- Uses `pnpm` as package manager
- Pre-commit hooks with lint-staged and Prettier
- Commit linting with conventional commits
- Chinese language support throughout the interface

## Important Notes

- All interactive components use React with `client:only="react"` directive
- Theme switching uses data attributes and CSS variables
- Modal system supports nested modals with proper stacking
- Search functionality requires build process to update index
- Content follows strict schema validation with Zod
- Project uses path aliases (`@/*` maps to `src/*`)
