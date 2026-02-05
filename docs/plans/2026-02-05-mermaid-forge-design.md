# Mermaid Forge — Design Document

**Date:** 2026-02-05
**Status:** Approved

## Overview

A Confluence Forge macro app that renders Mermaid diagrams natively. Users insert the macro into a page, write Mermaid syntax (or link an external `.mmd` file), and see it rendered as a visual diagram.

## Key Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Rendering | Client-side (Mermaid.js) | Simple, fast, no server needed |
| UI Framework | Forge Custom UI (React) | Full control over rendering |
| Editor | CodeMirror + split-pane live preview | Lightweight (150KB vs Monaco's 5MB), great UX |
| Source modes | Inline + External URL | Flexibility for different workflows |
| URL refresh | Configurable interval | Living documentation without Git integration complexity |
| Theming | Confluence-adaptive (auto light/dark) | Native feel, zero config |
| Diagram types | All Mermaid-supported types | No extra work to restrict; let the library handle it |

## Architecture

```
┌─────────────────────────────────────┐
│         Confluence Page             │
│  ┌───────────────────────────────┐  │
│  │   Forge Custom UI (iframe)    │  │
│  │  ┌─────────┬───────────────┐  │  │
│  │  │ Code    │  Mermaid.js   │  │  │
│  │  │ Editor  │  Rendered SVG │  │  │
│  │  │(config) │  (view mode)  │  │  │
│  │  └─────────┴───────────────┘  │  │
│  └───────────────────────────────┘  │
│                                     │
│  Forge Resolver (backend)           │
│  └─ fetchExternalUrl()              │
│  └─ Scheduled trigger (refresh)     │
└─────────────────────────────────────┘
```

### Components

- **Custom UI (React)** — Handles rendering, editing, and theming
- **Forge Resolver** — Backend function for fetching external URLs (avoids CORS)
- **Forge Storage API** — Caches fetched external content and stores refresh config
- **Macro Config** — Source mode, Mermaid code, URL, refresh interval

## Data Model

```typescript
{
  sourceMode: 'inline' | 'url',
  mermaidCode: string,
  mermaidCode: string,
  externalUrl: string,
  refreshInterval: 'manual' | '1h' | '6h' | '24h' | '7d',
  lastFetched: number,
  cachedContent: string,
}
```

## User Flows

### Inline Mode
1. Insert macro → config panel opens with split-pane editor
2. Type Mermaid syntax on the left → live preview on the right
3. Save → published page shows rendered diagram (view-only)

### URL Mode
1. Insert macro → toggle to "External URL" tab
2. Paste raw URL, pick refresh interval
3. Save → Forge resolver fetches URL, caches content, renders diagram
4. Subsequent loads serve cache; re-fetches based on interval

### View vs Edit Mode
- **View** (published page) — Rendered SVG only, full-width
- **Edit** (page editor) — Split-pane with code editor + live preview

## Project Structure

```
mermaid-forge/
├── manifest.yml
├── package.json
├── src/
│   └── resolvers/
│       └── index.ts
├── static/
│   ├── package.json
│   ├── src/
│   │   ├── App.tsx
│   │   ├── components/
│   │   │   ├── MermaidRenderer.tsx
│   │   │   ├── CodeEditor.tsx
│   │   │   ├── SplitPaneEditor.tsx
│   │   │   ├── UrlSourceConfig.tsx
│   │   │   └── SourceModeTabs.tsx
│   │   ├── hooks/
│   │   │   ├── useMermaid.ts
│   │   │   └── useThemeDetect.ts
│   │   └── index.tsx
│   └── build/
└── README.md
```

## Dependencies

| Package | Purpose | Size |
|---------|---------|------|
| `mermaid` | Diagram rendering | ~1.5MB |
| `@codemirror/view` + `@codemirror/lang-markdown` | Code editor | ~150KB |
| `@forge/bridge` | Custom UI ↔ Forge backend | Forge built-in |
| `@forge/api` | Backend URL fetching + storage | Forge built-in |
| `@forge/resolver` | Backend function definitions | Forge built-in |

## Error Handling

### Mermaid Syntax Errors
- Show Mermaid parse error inline below preview pane
- Don't block saving — allow work-in-progress diagrams

### External URL Failures
- Network/404 → Show last cached version + warning banner with timestamp
- No cache → Clear error message
- Invalid Mermaid content → Same as syntax error handling

### Large Diagrams
- `maxTextSize` config on Mermaid init (50KB limit)
- Warning if content exceeds limit

### Security
- URL fetch server-side via Forge resolver (no CORS, no credential leakage)
- `securityLevel: 'strict'` on Mermaid.js (no click handlers, no HTML)
- Sanitize fetched external content before rendering

### Empty State
- Placeholder with example Mermaid syntax on first insertion
