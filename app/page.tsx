"use client";

import { useState, useCallback, useRef } from "react";
import ImageDropZone from "@/components/ImageDropZone";
import ImagePreview from "@/components/ImagePreview";
import ModeSelector from "@/components/ModeSelector";
import ResponseArea from "@/components/ResponseArea";
import FollowUpInput from "@/components/FollowUpInput";
import ConversationHistory from "@/components/ConversationHistory";
import { UploadedImage, AnalysisMode, ConversationTurn } from "@/lib/types";
import { MODES } from "@/lib/modes";

const MAX_HISTORY_TURNS = 5;

export default function Home() {
  const [image, setImage] = useState<UploadedImage | null>(null);
  const [mode, setMode] = useState<AnalysisMode>("explain");
  const [customPrompt, setCustomPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [isError, setIsError] = useState(false);
  const [history, setHistory] = useState<ConversationTurn[]>([]);
  const [showFollowUp, setShowFollowUp] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const getPrompt = useCallback(() => {
    if (mode === "custom") return customPrompt.trim();
    return MODES.find((m) => m.id === mode)?.prompt ?? "";
  }, [mode, customPrompt]);

  const runAnalysis = useCallback(
    async (prompt: string, currentHistory: ConversationTurn[]) => {
      if (!image) return;

      // Abort any in-progress stream
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setIsStreaming(true);
      setIsError(false);
      setResponse("");
      setShowFollowUp(false);

      try {
        const res = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
          body: JSON.stringify({
            image: image.base64,
            mimeType: image.mimeType,
            prompt,
            history: currentHistory,
          }),
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "API request failed");
        }

        const reader = res.body?.getReader();
        const decoder = new TextDecoder();
        let fullText = "";

        if (!reader) throw new Error("No response stream");

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            const data = line.slice(6).trim();
            if (data === "[DONE]") break;

            try {
              const json = JSON.parse(data);
              const delta = json.choices?.[0]?.delta?.content;
              if (delta) {
                fullText += delta;
                setResponse(fullText);
              }
            } catch {
              // Skip malformed chunks
            }
          }
        }

        // Update history
        const newHistory: ConversationTurn[] = [
          ...currentHistory,
          { role: "assistant", content: fullText },
        ];

        // Cap at MAX_HISTORY_TURNS pairs (each pair = 2 entries, keep first user msg)
        const capped =
          newHistory.length > MAX_HISTORY_TURNS * 2
            ? [newHistory[0], ...newHistory.slice(-(MAX_HISTORY_TURNS * 2 - 1))]
            : newHistory;

        setHistory(capped);
        setShowFollowUp(true);
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
        setIsError(true);
        setResponse((err as Error).message);
      } finally {
        setIsStreaming(false);
      }
    },
    [image]
  );

  const handleAnalyze = useCallback(() => {
    const prompt = getPrompt();
    if (!prompt) return;
    if (!image) return;

    // Start fresh history
    const initialHistory: ConversationTurn[] = [
      { role: "user", content: prompt },
    ];
    setHistory(initialHistory);
    runAnalysis(prompt, initialHistory);
  }, [image, getPrompt, runAnalysis]);

  const handleFollowUp = useCallback(
    (question: string) => {
      const nextHistory: ConversationTurn[] = [
        ...history,
        { role: "user", content: question },
      ];
      setHistory(nextHistory);
      runAnalysis(question, nextHistory);
    },
    [history, runAnalysis]
  );

  const handleReset = useCallback(() => {
    abortRef.current?.abort();
    setImage(null);
    setResponse("");
    setHistory([]);
    setShowFollowUp(false);
    setIsStreaming(false);
    setIsError(false);
    setMode("explain");
    setCustomPrompt("");
  }, []);

  const prompt = getPrompt();
  const canAnalyze = !!image && !!prompt && !isStreaming;

  return (
    <main className="page">
      {/* Header */}
      <header className="site-header">
        <div className="header-inner">
          <div className="logo-wrap">
            <div className="logo-icon">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <rect x="2" y="6" width="24" height="18" rx="3" stroke="currentColor" strokeWidth="1.8" fill="none" />
                <circle cx="14" cy="15" r="5" stroke="currentColor" strokeWidth="1.8" fill="none" />
                <circle cx="14" cy="15" r="2" fill="currentColor" opacity="0.5" />
                <path d="M9 6L10.5 3h7L19 6" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
                <circle cx="22" cy="9" r="1.2" fill="currentColor" opacity="0.7" />
              </svg>
            </div>
            <div>
              <h1 className="logo-text">SnapExplain</h1>
              <p className="logo-sub">AI Image Analysis</p>
            </div>
          </div>

          {image && (
            <button
              id="new-image-btn"
              onClick={handleReset}
              className="btn btn-secondary"
              aria-label="Start over with a new image"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path
                  d="M1 7a6 6 0 1 0 1.2-3.6"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <path d="M1 1v3h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              New Image
            </button>
          )}
        </div>
      </header>

      {/* Main content */}
      <div className="content-grid">
        {/* Left column: image + controls */}
        <section className="left-col" aria-label="Image upload and controls">
          {!image ? (
            <ImageDropZone onImageUpload={setImage} />
          ) : (
            <ImagePreview image={image} onRemove={handleReset} />
          )}

          {image && (
            <div className="controls-card fade-in">
              <ModeSelector
                selectedMode={mode}
                onModeChange={setMode}
                customPrompt={customPrompt}
                onCustomPromptChange={setCustomPrompt}
              />

              <button
                id="analyze-btn"
                onClick={handleAnalyze}
                disabled={!canAnalyze}
                className={`btn btn-primary analyze-btn ${canAnalyze ? "pulse-amber" : ""}`}
                aria-label="Analyze image"
              >
                {isStreaming ? (
                  <>
                    <span className="spinner" />
                    Analyzing…
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.8" fill="none" />
                      <path d="M5.5 8h5M8 5.5v5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                    </svg>
                    Analyze Image
                  </>
                )}
              </button>
            </div>
          )}
        </section>

        {/* Right column: response */}
        <section className="right-col" aria-label="Analysis response">
          {!image && !response && (
            <div className="empty-state">
              <div className="empty-icon">
                <svg width="64" height="64" viewBox="0 0 64 64" fill="none" opacity="0.25">
                  <rect x="8" y="16" width="48" height="36" rx="6" stroke="currentColor" strokeWidth="2" />
                  <circle cx="32" cy="34" r="10" stroke="currentColor" strokeWidth="2" />
                  <circle cx="32" cy="34" r="4" fill="currentColor" />
                  <path d="M20 16l3-6h18l3 6" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                  <path d="M20 28l-4 4 4 4M44 28l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.5" />
                </svg>
              </div>
              <h2 className="empty-title">Upload an image to begin</h2>
              <p className="empty-desc">
                Drop any image — screenshots, photos, charts, handwritten notes, code snippets — and let MiMo explain it.
              </p>
              <div className="empty-examples">
                {["📊 Analyze charts", "📝 Read handwriting", "💻 Review code", "🌐 Translate text", "🔥 Get roasted"].map((ex) => (
                  <span key={ex} className="example-chip">{ex}</span>
                ))}
              </div>
            </div>
          )}

          {(response || isStreaming) && (
            <ResponseArea
              content={response}
              isStreaming={isStreaming}
              isError={isError}
              onFollowUp={() => setShowFollowUp(true)}
            />
          )}

          {history.length > 1 && (
            <ConversationHistory history={history} />
          )}

          {showFollowUp && !isStreaming && !isError && (
            <FollowUpInput
              onSubmit={handleFollowUp}
              isLoading={isStreaming}
              disabled={!image}
            />
          )}
        </section>
      </div>

      {/* Footer */}
      <footer className="site-footer">
        <p>
          Powered by{" "}
          <a
            href="https://api.xiaomimimo.com"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            Xiaomi MiMo V2.5
          </a>{" "}
          · Multimodal AI
        </p>
      </footer>

      <style jsx>{`
        .page {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        /* Header */
        .site-header {
          border-bottom: 1px solid var(--border);
          background: rgba(26, 22, 20, 0.95);
          backdrop-filter: blur(12px);
          position: sticky;
          top: 0;
          z-index: 50;
        }

        .header-inner {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 24px;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .logo-wrap {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .logo-icon {
          color: var(--accent);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .logo-text {
          font-family: var(--font-serif);
          font-size: 1.35rem;
          color: var(--text-primary);
          line-height: 1.1;
          font-style: italic;
        }

        .logo-sub {
          font-size: 0.68rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.12em;
          margin-top: 1px;
        }

        /* Content grid */
        .content-grid {
          flex: 1;
          max-width: 1280px;
          margin: 0 auto;
          width: 100%;
          padding: 32px 24px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 32px;
          align-items: start;
        }

        @media (max-width: 768px) {
          .content-grid {
            grid-template-columns: 1fr;
            padding: 20px 16px;
            gap: 24px;
          }
        }

        .left-col {
          display: flex;
          flex-direction: column;
          gap: 20px;
          position: sticky;
          top: 88px;
        }

        @media (max-width: 768px) {
          .left-col {
            position: static;
          }
        }

        .right-col {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        /* Controls card */
        .controls-card {
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        /* Analyze button */
        .analyze-btn {
          width: 100%;
          justify-content: center;
          padding: 12px 24px;
          font-size: 1rem;
          font-weight: 600;
          border-radius: 12px;
          letter-spacing: 0.02em;
        }

        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(26, 22, 20, 0.3);
          border-top-color: var(--bg-primary);
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
          display: block;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Empty state */
        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          gap: 16px;
          min-height: 400px;
          padding: 40px 20px;
        }

        .empty-icon {
          color: var(--text-muted);
        }

        .empty-title {
          font-family: var(--font-serif);
          font-size: 1.5rem;
          color: var(--text-secondary);
          font-style: italic;
        }

        .empty-desc {
          font-size: 0.9rem;
          color: var(--text-muted);
          max-width: 360px;
          line-height: 1.6;
        }

        .empty-examples {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          justify-content: center;
          margin-top: 8px;
        }

        .example-chip {
          padding: 5px 14px;
          border-radius: 9999px;
          border: 1px solid var(--border);
          background: var(--bg-card);
          color: var(--text-muted);
          font-size: 0.8rem;
        }

        /* Footer */
        .site-footer {
          border-top: 1px solid var(--border);
          padding: 16px 24px;
          text-align: center;
          font-size: 0.78rem;
          color: var(--text-muted);
        }

        .footer-link {
          color: var(--accent);
          text-decoration: none;
        }

        .footer-link:hover {
          text-decoration: underline;
        }
      `}</style>
    </main>
  );
}
