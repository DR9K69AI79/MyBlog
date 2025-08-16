# GitHub Copilot Instructions

This is **DWHITE's Blog**, a bilingual (Chinese/English) Astro-based blog with interactive 3D hero components and advanced content management.

## Architecture Overview

### Core Stack & Deployment

- **Astro 4.6** with React integration for interactive components
- **GitHub Pages** deployment with base path `/MyBlog` (production only)
- **Path handling**: Use `withBase()` from `src/utils/path.ts` for all static assets
- **Build process**: `pnpm build` = type check + build + Pagefind search indexing

### Critical Path Patterns

```typescript
// ALWAYS use withBase() for static assets in production
import { withBase } from '@/utils/path'
const modelPath = withBase('/models/file.glb') // ✅ Correct
const modelPath = '/public/models/file.glb' // ❌ Wrong - 404 in production
```

### Component Architecture

- **`.astro` files**: Server-side components, use for layouts and static content
- **`.tsx` files**: Client-side React components, require `client:only="react"` directive
- **Hero 3D System**: `src/components/hero/` - Complex Three.js integration with YAML-driven project configs

## Development Workflows

### Content Management

```bash
pnpm new-post      # Interactive post creation with frontmatter
pnpm new-project   # Add 3D project with YAML config
pnpm new-friend    # Add friend link
pnpm dev           # Dev server with HMR
pnpm build         # Full production build with search index
```

### Adding 3D Projects

1. Add `.glb/.gltf` models to `public/models/`
2. Create YAML in `src/content/projects/` with schema:

```yaml
id: project-name
displayName: 'Display Name'
modelType: custom
modelPath: '/models/file.glb' # NO 'public/' prefix!
modelParams:
  scale: 2
  rotation: { x: 0, y: 0, z: 0 }
```

## Project-Specific Conventions

### State Management (Jotai)

- **Theme**: `src/store/theme.ts` - Persistent dark/light mode
- **Modals**: `src/store/modalStack.ts` - Stack-based modal system
- **Viewport**: `src/store/viewport.ts` - Responsive breakpoint detection

### Content Collections (Zod Schemas)

- **Posts**: `src/content/posts/*.md` - Blog articles with frontmatter
- **Projects**: `src/content/projects/*.yaml` - 3D project configurations
- **Friends**: `src/content/friends/*.yaml` - Friend links
- **Spec**: `src/content/spec/*.md` - Special pages (about, etc.)

### Plugin System

Custom remark/rehype plugins in `src/plugins/`:

- `remarkReadingTime` - Auto-calculate reading time
- `rehypeCodeHighlight` - Shiki syntax highlighting
- `remarkEmbed` - Content embedding
- `remarkSpoiler` - Spoiler text support

### CSS & Theming

- **CSS Variables**: `--color-accent`, `--color-text-primary`, etc.
- **Theme switching**: Data attributes + CSS variables (not Tailwind classes)
- **Responsive**: Mobile-first with custom breakpoints in `src/store/viewport.ts`

## Critical Integration Points

### Three.js 3D System

- **Entry**: `src/components/hero/InteractiveProject.tsx`
- **Core Logic**: `src/components/hero/useProjectViewer.ts`
- **Model Loading**: External models (.glb/.gltf) + built-in geometries (sphere, cube, torus, pyramid)
- **Error Handling**: Graceful fallback to avatar image on 3D failures

### Search Integration

- **Pagefind**: Static search index built during `pnpm build`
- **Search UI**: `src/components/header/Search.tsx`
- **Index Location**: `dist/pagefind/` (auto-generated)

### Comment System

- **Waline**: Configured in `src/components/comment/`
- **Integration**: Post-level enable/disable via frontmatter `comments: true/false`

## Common Pitfalls & Solutions

### Deployment Issues

- **Asset 404s**: Always use `withBase()` for static assets
- **Client-side routing**: Use `client:only="react"` for interactive components
- **Build failures**: Check TypeScript errors with `astro check`

### 3D Model Loading

- **File placement**: Models go in `public/models/`, reference as `/models/filename`
- **YAML config**: Use `modelPath: '/models/file.glb'` NOT `'public/models/file.glb'`
- **Error handling**: Models auto-fallback to default geometry on load failure

### Content Creation

- **Frontmatter validation**: Strict Zod schemas in `src/content/config.ts`
- **Date format**: Use ISO strings (`new Date().toISOString()`)
- **Tags**: Array format `tags: ['tag1', 'tag2']`

## File Organization Examples

```
src/content/posts/my-post.md           # Blog post
src/content/projects/my-project.yaml   # 3D project config
public/models/my-model.glb             # 3D model asset
src/components/ui/MyComponent.tsx      # Reusable UI component
src/pages/my-page.astro                # Static page
```
