"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import CopyButton from "./CopyButton";

interface ResponseAreaProps {
  content: string;
  isStreaming: boolean;
  isError: boolean;
  onFollowUp: () => void;
}

export default function ResponseArea({
  content,
  isStreaming,
  isError,
  onFollowUp,
}: ResponseAreaProps) {
  if (!content && !isStreaming) return null;

  return (
    <div className="response-area fade-in">
      {/* Header */}
      <div className="response-header">
        <div className="response-title-wrap">
          <div className={`status-dot ${isStreaming ? "streaming" : isError ? "error" : "done"}`} />
          <span className="response-title">
            {isStreaming ? "Analyzing…" : isError ? "Error" : "Analysis"}
          </span>
        </div>

        {!isStreaming && !isError && content && (
          <div className="response-actions">
            <CopyButton text={content} id="copy-response-btn" />
            <button
              id="follow-up-btn"
              onClick={onFollowUp}
              className="follow-up-btn"
              aria-label="Ask a follow-up question"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path
                  d="M7 1C3.686 1 1 3.462 1 6.5c0 1.233.424 2.37 1.135 3.282L1.5 13l3.5-1.5A6.028 6.028 0 007 12c3.314 0 6-2.462 6-5.5S10.314 1 7 1z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
              </svg>
              Ask follow-up
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      <div className={`response-content ${isError ? "error-content" : ""}`}>
        {isError ? (
          <p className="error-msg">⚠️ {content}</p>
        ) : (
          <div className={`prose ${isStreaming ? "cursor-blink" : ""}`}>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                code({ inline, className, children, ...props }: any) {
                  const match = /language-(\w+)/.exec(className || "");
                  return !inline && match ? (
                    <SyntaxHighlighter
                      style={oneDark}
                      language={match[1]}
                      PreTag="div"
                      customStyle={{
                        background: "var(--bg-primary)",
                        border: "1px solid var(--border)",
                        borderRadius: "8px",
                        fontSize: "0.85em",
                        margin: "0.5em 0",
                      }}
                      {...props}
                    >
                      {String(children).replace(/\n$/, "")}
                    </SyntaxHighlighter>
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                },
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        )}
      </div>

      <style jsx>{`
        .response-area {
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: 16px;
          overflow: hidden;
        }

        .response-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 16px;
          border-bottom: 1px solid var(--border);
          background: var(--bg-card);
          gap: 12px;
          flex-wrap: wrap;
        }

        .response-title-wrap {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .status-dot.streaming {
          background: var(--accent);
          animation: pulse-amber 1s infinite;
        }

        .status-dot.done {
          background: #4ade80;
        }

        .status-dot.error {
          background: #f87171;
        }

        .response-title {
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--text-muted);
          font-family: var(--font-sans);
        }

        .response-actions {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .follow-up-btn {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 5px 12px;
          border-radius: 9999px;
          border: 1px solid rgba(245, 158, 11, 0.3);
          background: rgba(245, 158, 11, 0.08);
          color: var(--accent);
          font-size: 0.78rem;
          font-family: var(--font-sans);
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
        }

        .follow-up-btn:hover {
          background: rgba(245, 158, 11, 0.15);
          border-color: var(--accent);
        }

        .response-content {
          padding: 20px;
          overflow-y: auto;
          max-height: 600px;
        }

        .error-content {
          padding: 20px;
        }

        .error-msg {
          color: #fca5a5;
          font-size: 0.9rem;
          line-height: 1.5;
        }
      `}</style>
    </div>
  );
}
