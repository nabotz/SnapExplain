# SnapExplain — AI Image Explainer powered by Xiaomi MiMo Multimodal

> Upload any image. Let MiMo explain it.

SnapExplain is a lightweight, single-page web app that uses **Xiaomi MiMo V2.5** — an omni-modal AI model — to analyze images in real time. Drop a screenshot, photo, chart, handwritten note, or code snippet and get instant, streaming AI analysis.

---

## ✨ Features

- **3 ways to upload**: Drag & drop, file picker, or `Ctrl+V` clipboard paste
- **6 analysis modes**: Explain, Read Text, Analyze Chart, Translate, Code Review, Roast It
- **Custom questions**: Ask anything about your image
- **Streaming responses**: See analysis appear in real time
- **Follow-up chat**: Continue the conversation about the same image (up to 5 turns)
- **Markdown rendering**: Formatted responses with syntax-highlighted code blocks
- **Copy response**: One-click copy to clipboard
- **Polaroid aesthetic**: Warm, analog-inspired dark UI

---

## 🔄 Workflow

```
┌─────────────────────────────────────────────────────────────┐
│                        SNAPEXPLAIN                          │
└─────────────────────────────────────────────────────────────┘

  📁 Upload Image
  ├── Drag & drop onto the zone
  ├── Click to browse files
  └── Ctrl+V  paste from clipboard
              │
              ▼
  🎛️ Choose a Mode
  ├── 💡 Explain       ── What's going on in this image?
  ├── 📝 Read Text     ── Extract and transcribe text
  ├── 📊 Analyze Chart ── Break down data & trends
  ├── 🌐 Translate     ── Translate visible text
  ├── 💻 Code Review   ── Review code in the screenshot
  ├── 😈 Roast It      ── Brutal honest feedback
  └── ✏️  Custom        ── Ask anything
              │
              ▼
  ⚡ Analyze  ──────────────────────────────────────────────┐
              │                                             │
              │   Browser          Next.js API    MiMo V2.5│
              │   ───────►  SSE  ──────────────► Streaming │
              │              ◄── token by token ◄──────────┘
              ▼
  📖 Streaming Response
  └── Markdown + syntax-highlighted code blocks
              │
         ┌────┴────┐
         │         │
         ▼         ▼
  📋 Copy       💬 Follow Up  (up to 5 turns)
  to clipboard  └── Full context re-sent each turn
```

---

## 🚀 Setup

### 1. Clone & Install

```bash
git clone <repo-url>
cd SnapExplain
npm install
```

### 2. Configure API Key

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your MiMo API key:

```
MIMO_API_KEY=your_api_key_here
```

Get your API key at [api.xiaomimimo.com](https://api.xiaomimimo.com).

### 3. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔧 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14+ (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + CSS-in-JS |
| AI Model | Xiaomi MiMo V2.5 (multimodal) |
| Fonts | Fraunces (serif) + DM Sans |
| Markdown | react-markdown + react-syntax-highlighter |

---

## 🏗️ File Structure

```
snapexplain/
├── app/
│   ├── layout.tsx          # Root layout + fonts + SEO
│   ├── page.tsx            # Main page (orchestrator)
│   ├── globals.css         # Design system + animations
│   └── api/
│       └── analyze/
│           └── route.ts    # SSE streaming API route
├── components/
│   ├── ImageDropZone.tsx   # Upload via drag/click/paste
│   ├── ImagePreview.tsx    # Polaroid-style preview
│   ├── ModeSelector.tsx    # Analysis mode pills
│   ├── ResponseArea.tsx    # Streaming markdown response
│   ├── FollowUpInput.tsx   # Chat follow-up input
│   ├── ConversationHistory.tsx  # Chat turn display
│   └── CopyButton.tsx      # Clipboard copy button
├── lib/
│   ├── mimo.ts             # MiMo API client (streaming)
│   ├── types.ts            # TypeScript types
│   └── modes.ts            # Mode definitions + prompts
└── .env.local.example
```

---

## 📄 License

MIT — see [LICENSE](LICENSE).

---

*Powered by Xiaomi MiMo API — MiMo-V2.5 omni-modal model.*
