"use client";

import { useState } from "react";
import { AnalysisMode } from "@/lib/types";
import { MODES } from "@/lib/modes";

interface ModeSelectorProps {
  selectedMode: AnalysisMode;
  onModeChange: (mode: AnalysisMode) => void;
  customPrompt: string;
  onCustomPromptChange: (val: string) => void;
}

export default function ModeSelector({
  selectedMode,
  onModeChange,
  customPrompt,
  onCustomPromptChange,
}: ModeSelectorProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="mode-selector">
      <p className="mode-label">Analysis Mode</p>

      <div className="modes-scroll" role="group" aria-label="Analysis modes">
        {MODES.map((mode) => (
          <button
            key={mode.id}
            onClick={() => onModeChange(mode.id)}
            className={`mode-btn ${selectedMode === mode.id ? "active" : ""}`}
            id={`mode-btn-${mode.id}`}
            aria-pressed={selectedMode === mode.id}
            title={mode.description}
          >
            <span className="mode-emoji">{mode.emoji}</span>
            <span>{mode.label}</span>
          </button>
        ))}
      </div>

      {selectedMode === "custom" && (
        <div className={`custom-input-wrap ${isFocused ? "focused" : ""} fade-in`}>
          <textarea
            id="custom-prompt-input"
            value={customPrompt}
            onChange={(e) => onCustomPromptChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Ask anything about this image... What do you see? What's the mood? Describe the colors..."
            rows={3}
            className="custom-textarea"
          />
          <div className="char-count">{customPrompt.length} chars</div>
        </div>
      )}

      {selectedMode !== "custom" && (
        <p className="mode-description fade-in">
          <span className="desc-icon">💡</span>
          {MODES.find((m) => m.id === selectedMode)?.description}
        </p>
      )}

      <style jsx>{`
        .mode-selector {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .mode-label {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--text-muted);
          font-weight: 600;
        }

        .modes-scroll {
          display: flex;
          gap: 8px;
          overflow-x: auto;
          padding-bottom: 4px;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }

        .modes-scroll::-webkit-scrollbar {
          display: none;
        }

        .mode-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          border-radius: 9999px;
          border: 1px solid var(--border);
          background: var(--bg-card);
          color: var(--text-secondary);
          font-size: 0.875rem;
          font-family: var(--font-sans);
          font-weight: 500;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.2s;
          flex-shrink: 0;
        }

        .mode-btn:hover {
          border-color: var(--accent);
          color: var(--text-primary);
          background: var(--bg-hover);
        }

        .mode-btn.active {
          border-color: var(--accent);
          background: rgba(245, 158, 11, 0.12);
          color: var(--accent-light);
          box-shadow: 0 0 0 1px rgba(245, 158, 11, 0.2);
        }

        .mode-emoji {
          font-size: 1em;
        }

        .custom-input-wrap {
          position: relative;
          border-radius: 12px;
          border: 1px solid var(--border);
          background: var(--bg-card);
          overflow: hidden;
          transition: border-color 0.2s;
        }

        .custom-input-wrap.focused {
          border-color: var(--accent);
          box-shadow: 0 0 0 2px rgba(245, 158, 11, 0.1);
        }

        .custom-textarea {
          width: 100%;
          background: transparent;
          border: none;
          outline: none;
          padding: 12px 14px;
          color: var(--text-primary);
          font-family: var(--font-sans);
          font-size: 0.9rem;
          line-height: 1.6;
          resize: none;
        }

        .custom-textarea::placeholder {
          color: var(--text-muted);
          font-style: italic;
        }

        .char-count {
          text-align: right;
          padding: 4px 12px 8px;
          font-size: 0.7rem;
          color: var(--text-muted);
          font-family: monospace;
        }

        .mode-description {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.8rem;
          color: var(--text-muted);
          font-style: italic;
          padding: 0 4px;
        }

        .desc-icon {
          font-style: normal;
        }
      `}</style>
    </div>
  );
}
