"use client";

import { useState } from "react";

interface FollowUpInputProps {
  onSubmit: (question: string) => void;
  isLoading: boolean;
  disabled: boolean;
}

export default function FollowUpInput({
  onSubmit,
  isLoading,
  disabled,
}: FollowUpInputProps) {
  const [value, setValue] = useState("");

  const handleSubmit = () => {
    if (!value.trim() || isLoading || disabled) return;
    onSubmit(value.trim());
    setValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="followup-wrap fade-in">
      <p className="followup-label">Ask a follow-up</p>

      <div className={`followup-input-box ${disabled ? "disabled" : ""}`}>
        <textarea
          id="follow-up-textarea"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything else about this image… (Enter to send)"
          rows={2}
          disabled={disabled || isLoading}
          className="followup-textarea"
        />
        <button
          id="follow-up-send-btn"
          onClick={handleSubmit}
          disabled={!value.trim() || isLoading || disabled}
          className="send-btn"
          aria-label="Send follow-up question"
        >
          {isLoading ? (
            <span className="loading-spinner" />
          ) : (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M2 8l12-6-6 12V8H2z"
                fill="currentColor"
              />
            </svg>
          )}
        </button>
      </div>

      <p className="followup-hint">
        <kbd>Enter</kbd> to send · <kbd>Shift+Enter</kbd> for new line
      </p>

      <style jsx>{`
        .followup-wrap {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .followup-label {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--text-muted);
          font-weight: 600;
        }

        .followup-input-box {
          display: flex;
          align-items: flex-end;
          gap: 8px;
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 10px 10px 10px 14px;
          transition: border-color 0.2s;
        }

        .followup-input-box:focus-within:not(.disabled) {
          border-color: var(--accent);
          box-shadow: 0 0 0 2px rgba(245, 158, 11, 0.1);
        }

        .followup-input-box.disabled {
          opacity: 0.4;
        }

        .followup-textarea {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          color: var(--text-primary);
          font-family: var(--font-sans);
          font-size: 0.9rem;
          line-height: 1.5;
          resize: none;
        }

        .followup-textarea::placeholder {
          color: var(--text-muted);
          font-style: italic;
        }

        .followup-textarea:disabled {
          cursor: not-allowed;
        }

        .send-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: 9px;
          border: none;
          background: var(--accent);
          color: var(--bg-primary);
          cursor: pointer;
          flex-shrink: 0;
          transition: all 0.2s;
        }

        .send-btn:hover:not(:disabled) {
          background: var(--accent-light);
          transform: translateY(-1px);
          box-shadow: var(--shadow-amber);
        }

        .send-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .loading-spinner {
          width: 14px;
          height: 14px;
          border: 2px solid rgba(0, 0, 0, 0.3);
          border-top-color: var(--bg-primary);
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
          display: block;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .followup-hint {
          font-size: 0.72rem;
          color: var(--text-muted);
          display: flex;
          align-items: center;
          gap: 4px;
        }

        kbd {
          display: inline-block;
          padding: 1px 5px;
          background: var(--bg-primary);
          border: 1px solid var(--border);
          border-radius: 3px;
          font-size: 0.68rem;
          font-family: monospace;
          color: var(--text-secondary);
        }
      `}</style>
    </div>
  );
}
