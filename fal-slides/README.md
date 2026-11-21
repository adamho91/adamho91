# fal Slides

Brand-locked 16:9 presentation editor for fal sales & marketing.

## Features

- **Focal-only type**: Focal Upright (display), Focal Text (body), HAL Timezone Mono (data/UI)
- **Sales / Marketing modes** (Figma Slides–style dual surface)
- **Chart inserts** with fal-themed series colors
- **Glitch Dust** slide objects powered by `@fal-slides/dust-engine` (presets from glitch dust maker)
- **Cloud save**: localStorage by default; optional Supabase sync + Google SSO
- **Present mode** + shareable `/p/:shareId` links
- **PNG export** per slide

## Develop

```bash
cd fal-slides
npm install
npm run dev
```

Open http://localhost:5173

## Supabase (optional)

1. Create a project and run [`supabase/schema.sql`](supabase/schema.sql)
2. Copy `.env.example` → `apps/web/.env.local` and fill:

```
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

3. Enable Google auth provider in Supabase

Without env vars, the app uses local email session + localStorage decks.

## Packages

- `packages/brand` — fonts, tokens, logos
- `packages/dust-engine` — headless Glitch Dust renderer + preset library
- `apps/web` — React editor
