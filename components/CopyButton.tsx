"use client";

import { useState } from "react";

interface CopyButtonProps {
  text: string;
  id?: string;
}

export default function CopyButton({ text, id = "copy-btn" }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      id={id}
      onClick={handleCopy}
      className="copy-btn"
      aria-label={copied ? "Copied!" : "Copy response"}
      title={copied ? "Copied!" : "Copy to clipboard"}
    >
      {copied ? (
        <>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M2 7l3.5 3.5L12 3"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Copied!
        </>
      ) : (
        <>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <rect
              x="4"
              y="4"
              width="8"
              height="9"
              rx="1.5"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path
              d="M4 3.5A1.5 1.5 0 012.5 5V10.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <rect
              x="2"
              y="1"
              width="8"
              height="9"
              rx="1.5"
              stroke="currentColor"
              strokeWidth="1.5"
            />
          </svg>
          Copy
        </>
      )}

      <style jsx>{`
        .copy-btn {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 5px 12px;
          border-radius: 9999px;
          border: 1px solid var(--border);
          background: var(--bg-card);
          color: var(--text-muted);
          font-size: 0.78rem;
          font-family: var(--font-sans);
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
        }

        .copy-btn:hover {
          background: var(--bg-hover);
          border-color: var(--border-light);
          color: var(--text-secondary);
        }

        .copy-btn:active {
          transform: scale(0.95);
        }
      `}</style>
    </button>
  );
}
