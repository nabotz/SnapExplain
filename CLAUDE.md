# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Quick Commands

**Development & Build:**
- `npm run dev` — Start Next.js dev server (http://localhost:3000)
- `npm run build` — Production build
- `npm start` — Run production server
- `npm run lint` — Run ESLint (eslint-config-next with TypeScript)

**Setup:**
- `npm install` — Install dependencies
- Copy `.env.local.example` to `.env.local` and add `MIMO_API_KEY=<your_key>`

**Note:** No tests or unit test runners are currently configured. This is a client-focused single-page app.

## Architecture Overview

SnapExplain is a **Next.js 16+ app** that streams AI image analysis from the Xiaomi MiMo API.

### Data Flow

1. **Client (page.tsx)** — Main orchestrator
   - Manages image upload, mode selection, conversation history (max 5 turns)
   - Converts images to base64 for API transmission
   - Handles AbortController for canceling in-flight requests

2. **API Route (api/analyze/route.ts)** — SSE streaming proxy
   - Receives base64 image + prompt + conversation history
   - Validates request (10MB base64 limit → ~7.5MB raw)
   - Calls MiMo API via `analyzeMiMo()` and streams response back as server-sent events (SSE)
   - Runtime: Node.js, Max duration: 60s

3. **MiMo Client (lib/mimo.ts)** — API integration
   - Constructs multimodal messages for MiMo V2.5
   - First turn: `image_url` + `text` prompt
   - Follow-ups: Text-only (image attached once, kept in context)
   - Streams response as ReadableStream (passed through to client)

### Conversation Flow

- **Initial analysis:** Image + user prompt → API returns streaming response
- **Follow-up questions:** History rebuilt with original image + all prior turns + new question → streaming response
- **History capping:** Max 5 turn pairs (10 entries); keeps first user turn always

### Component Architecture

**Stateful (page.tsx):**
- `image`, `mode`, `customPrompt`, `response`, `isStreaming`, `isError`, `history`, `showFollowUp`

**Presentational components** (all in components/):
- `ImageDropZone` — Drag/drop, file picker, clipboard paste
- `ImagePreview` — Shows uploaded image with dimensions/size
- `ModeSelector` — 7 predefined modes (explain, read-text, analyze-chart, translate, code-review, roast, custom)
- `ResponseArea` — Markdown + syntax-highlighted code, status indicator, copy/follow-up buttons
- `FollowUpInput` — Text input for conversation continuation
- `ConversationHistory` — Displays prior user/assistant turns
- `CopyButton` — Reusable clipboard utility

### Styling

- **Tailwind CSS v4** with PostCSS
- **Custom design tokens** (colors, fonts, shadows) in `app/globals.css`
- **Dark mode polaroid aesthetic** — warm browns/ambers (#1a1614 bg, #f59e0b accent)
- **Google Fonts:** Fraunces (serif, italic) + DM Sans (sans)
- **Animations:** Grain overlay, spinner, streaming cursor blink, pulse effects

### Type System

Key types (lib/types.ts):
- `AnalysisMode` — Union of 7 mode IDs + "custom"
- `UploadedImage` — {base64, mimeType, previewUrl, name, size}
- `ConversationTurn` — {role: "user" | "assistant", content}
- `AnalyzeRequest` — Request shape for /api/analyze

### Key Dependencies

- **next@16.2.6** — App Router, SSE streaming, dynamic fonts
- **react@19.2.4, react-dom@19.2.4** — Client components
- **typescript@5** — Type checking (strict mode)
- **react-markdown@10.1.0 + remark-gfm@4.0.1** — Markdown rendering with GFM tables/strikethrough
- **react-syntax-highlighter@16.1.1** — Code block highlighting (oneDark theme)
- **@tailwindcss/postcss@4, tailwindcss@4** — Styling
- **eslint@9 + eslint-config-next** — Linting (web vitals + TypeScript rules)

### Environment

- Requires: `MIMO_API_KEY` from https://api.xiaomimimo.com
- Model: `MiMo-V2.5`
- Max tokens: 2048 per request
- Max image size: 10MB (base64)

### Important Implementation Notes

1. **Streaming:** Client reads SSE chunks line-by-line, parses `data:` prefix, extracts `choices[0].delta.content`
2. **Image handling:** Encoded as `data:${mimeType};base64,${image}` for MiMo multimodal endpoint
3. **Abort pattern:** Uses AbortController to cancel requests (cleanup on component unmount or new analysis)
4. **History management:** First turn always includes image; follow-ups are text-only but rebuild full context for API
5. **Responsive:** 2-column grid (left=controls, right=response) collapses to 1-column on mobile

## Next.js Version Notice

From AGENTS.md: **This version has breaking changes.** Always consult `node_modules/next/dist/docs/` for current App Router conventions before writing new code.

