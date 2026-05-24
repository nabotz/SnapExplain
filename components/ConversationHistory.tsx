"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ConversationTurn } from "@/lib/types";
import CopyButton from "./CopyButton";

interface ConversationHistoryProps {
  history: ConversationTurn[];
}

export default function ConversationHistory({
  history,
}: ConversationHistoryProps) {
  if (history.length === 0) return null;

  // Filter to pairs: skip the very first user message (shown as the mode prompt)
  // and show all subsequent turns
  const displayTurns = history.slice(1);
  if (displayTurns.length === 0) return null;

  return (
    <div className="history-wrap">
      <div className="history-divider">
        <span>Conversation</span>
      </div>

      <div className="turns">
        {displayTurns.map((turn, i) => (
          <div
            key={i}
            className={`turn turn-${turn.role} fade-in`}
          >
            {turn.role === "user" ? (
              <div className="user-bubble">
                <span className="turn-icon">You</span>
                <p className="user-text">{turn.content}</p>
              </div>
            ) : (
              <div className="assistant-bubble">
                <div className="assistant-header">
                  <span className="turn-icon ai-icon">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.5" />
                      <path d="M4 6h4M6 4v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                    MiMo
                  </span>
                  <CopyButton text={turn.content} id={`copy-history-${i}`} />
                </div>
                <div className="prose prose-sm">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {turn.content}
                  </ReactMarkdown>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <style jsx>{`
        .history-wrap {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .history-divider {
          display: flex;
          align-items: center;
          gap: 12px;
          color: var(--text-muted);
          font-size: 0.72rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        .history-divider::before,
        .history-divider::after {
          content: "";
          flex: 1;
          height: 1px;
          background: var(--border);
        }

        .turns {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .turn {
          display: flex;
          flex-direction: column;
        }

        .user-bubble {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 4px;
        }

        .user-text {
          background: rgba(245, 158, 11, 0.12);
          border: 1px solid rgba(245, 158, 11, 0.2);
          border-radius: 12px 12px 4px 12px;
          padding: 10px 14px;
          color: var(--text-primary);
          font-size: 0.9rem;
          line-height: 1.5;
          max-width: 85%;
        }

        .assistant-bubble {
          display: flex;
          flex-direction: column;
          gap: 8px;
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 4px 12px 12px 12px;
          padding: 12px 16px;
        }

        .assistant-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
        }

        .turn-icon {
          font-size: 0.72rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--text-muted);
          font-weight: 600;
          font-family: var(--font-sans);
        }

        .ai-icon {
          display: flex;
          align-items: center;
          gap: 5px;
          color: var(--accent);
        }

        .prose-sm {
          font-size: 0.875rem;
        }
      `}</style>
    </div>
  );
}
