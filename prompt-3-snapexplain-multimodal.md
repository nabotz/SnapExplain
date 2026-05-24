# Claude Code Prompt — SnapExplain: AI Image Explainer

## Overview

Build a **single-page web app** called **SnapExplain** where users upload or paste an image, and MiMo's multimodal model analyzes it and responds to questions about the image. Use cases: explain a screenshot, read handwritten notes, analyze a chart/graph, identify objects, translate text in photos, explain code screenshots, describe art.

Lightweight, no database, no auth. One page, one purpose.

---

## Tech Stack

- **Framework:** Next.js 14+ (App Router), TypeScript, Tailwind CSS
- **Image handling:** Native File API + drag-and-drop + clipboard paste
- **LLM:** Xiaomi MiMo API multimodal (OpenAI-compatible with image input)
- **State:** React hooks

---

## MiMo Multimodal API Reference

```typescript
// POST https://api.xiaomimimo.com/v1/chat/completions
{
  model: "MiMo-V2.5",  // omni-modal model
  messages: [
    {
      role: "user",
      content: [
        {
          type: "image_url",
          image_url: {
            url: "data:image/jpeg;base64,{base64_data}"
          }
        },
        {
          type: "text",
          text: "What's in this image? Explain in detail."
        }
      ]
    }
  ]
}
```

---

## Features

### 1. Image Input (3 methods)
- **Drag & drop** — drop zone with visual feedback
- **File picker** — click to browse
- **Clipboard paste** — Ctrl+V / Cmd+V anywhere on the page
- Show image preview after upload with remove button
- Max file size: 10MB. Supported: jpg, png, webp, gif

### 2. Analysis Mode Selector
Quick-select buttons that set the prompt context:

| Mode | Prompt Instruction |
|------|-------------------|
| **Explain** | "Explain everything you see in this image in detail." |
| **Read Text** | "Extract and transcribe all text visible in this image." |
| **Analyze Chart** | "Analyze this chart/graph. Describe the data, trends, and key takeaways." |
| **Translate** | "Identify any text in this image and translate it to English." |
| **Code Review** | "This is a code screenshot. Explain what the code does, identify any issues." |
| **Roast It** | "Give a funny, light-hearted roast of this image. Be witty." |
| **Custom** | Free text input for custom questions |

### 3. Response Area
- Streaming response display (SSE or chunked)
- Markdown rendering for formatted output
- Copy response button
- "Ask follow-up" button that keeps the image context and allows a new question

### 4. Follow-up Chat
- After initial analysis, user can ask follow-up questions about the same image
- Maintain conversation history in state (max 5 turns)
- Each turn shows user question + AI response
- "New Image" button resets everything

---

## API Route

```
POST /api/analyze
Body: {
  image: string,          // base64 encoded image
  mimeType: string,       // image/jpeg, image/png, etc.
  prompt: string,         // the question/instruction
  history?: Array<{       // previous conversation turns
    role: "user" | "assistant",
    content: string
  }>
}
Response: ReadableStream (SSE for streaming response)
```

The API route:
1. Constructs the messages array with image + text for first turn
2. Appends conversation history for follow-ups
3. Streams the response back using MiMo's streaming API
4. Frontend reads the stream and renders progressively

---

## UI/UX Requirements

- **Design direction:** Polaroid / photo lab aesthetic. Warm, slightly analog feel with modern functionality. Think: a darkroom meets a modern AI tool.
- **Typography:** Distinctive serif for headings (e.g., Fraunces, Lora). Clean sans for body (e.g., DM Sans, Manrope).
- **Color palette:** Warm dark background (#1a1614), cream/off-white text (#f5f0e8), accent in warm amber (#f59e0b). Image drop zone has a subtle film-grain texture overlay.
- **Layout:** Two-column on desktop: left = image + controls, right = response. Stacked on mobile.
- **Drop zone:** Large, dashed border, changes color/style on drag hover. Shows a camera icon or film frame illustration.
- **Image preview:** Displayed in a polaroid-style frame with slight rotation and shadow.
- **Response rendering:** Clean markdown with syntax highlighting for code blocks.
- **Mode buttons:** Pill-shaped, horizontally scrollable on mobile.
- **Loading state:** Typewriter-style text appearance as streaming comes in.
- **Responsive:** Mobile-first for the image capture use case (take photo → analyze).

---

## File Structure

```
snapexplain/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   └── api/
│       └── analyze/
│           └── route.ts
├── components/
│   ├── ImageDropZone.tsx
│   ├── ImagePreview.tsx
│   ├── ModeSelector.tsx
│   ├── ResponseArea.tsx
│   ├── FollowUpInput.tsx
│   ├── ConversationHistory.tsx
│   └── CopyButton.tsx
├── lib/
│   ├── mimo.ts
│   ├── types.ts
│   └── modes.ts        // mode definitions with prompts
├── .env.local.example
├── package.json
└── README.md
```

---

## README

- Title: "SnapExplain — AI Image Explainer powered by Xiaomi MiMo Multimodal"
- Highlight: uses MiMo-V2.5 omni-modal capabilities (image + text understanding)
- Setup: clone, install, env, run
- "Powered by Xiaomi MiMo API"
- License: MIT

---

## Build Order

1. Setup Next.js
2. Build `lib/mimo.ts` with multimodal API call + streaming
3. Build API route with SSE streaming
4. Build ImageDropZone (drag-drop, file pick, paste)
5. Build ImagePreview with polaroid style
6. Build ModeSelector
7. Build ResponseArea with streaming markdown render
8. Build FollowUpInput + ConversationHistory
9. Polish: animations, grain texture, responsive
10. Write README
