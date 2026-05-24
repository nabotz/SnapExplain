"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { UploadedImage } from "@/lib/types";

interface ImageDropZoneProps {
  onImageUpload: (image: UploadedImage) => void;
}

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE = 10 * 1024 * 1024; // 10MB

export default function ImageDropZone({ onImageUpload }: ImageDropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragCounterRef = useRef(0);

  const processFile = useCallback(
    (file: File) => {
      setError(null);

      if (!ACCEPTED_TYPES.includes(file.type)) {
        setError("Unsupported format. Please use JPG, PNG, WebP, or GIF.");
        return;
      }

      if (file.size > MAX_SIZE) {
        setError("File too large. Maximum size is 10MB.");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        const base64 = result.split(",")[1];
        onImageUpload({
          base64,
          mimeType: file.type,
          previewUrl: result,
          name: file.name,
          size: file.size,
        });
      };
      reader.readAsDataURL(file);
    },
    [onImageUpload]
  );

  // Handle paste anywhere on page
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (const item of items) {
        if (item.type.startsWith("image/")) {
          const file = item.getAsFile();
          if (file) {
            processFile(file);
            break;
          }
        }
      }
    };

    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, [processFile]);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    dragCounterRef.current++;
    if (dragCounterRef.current === 1) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    dragCounterRef.current--;
    if (dragCounterRef.current === 0) setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    dragCounterRef.current = 0;
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    e.target.value = "";
  };

  return (
    <div
      className={`drop-zone grain-overlay ${isDragging ? "dragging" : ""}`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && fileInputRef.current?.click()}
      aria-label="Upload image — click, drag and drop, or paste"
    >
      <input
        ref={fileInputRef}
        type="file"
        accept={ACCEPTED_TYPES.join(",")}
        onChange={handleFileChange}
        style={{ display: "none" }}
        id="file-upload-input"
      />

      {/* Film frame corners */}
      <div className="frame-corner top-left" />
      <div className="frame-corner top-right" />
      <div className="frame-corner bottom-left" />
      <div className="frame-corner bottom-right" />

      <div className={`drop-content ${isDragging ? "scale-up" : ""}`}>
        {/* Camera icon */}
        <div className="camera-icon-wrap">
          <svg
            width="56"
            height="56"
            viewBox="0 0 56 56"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="4"
              y="14"
              width="48"
              height="34"
              rx="6"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
            />
            <circle
              cx="28"
              cy="31"
              r="9"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
            />
            <circle cx="28" cy="31" r="4" fill="currentColor" opacity="0.4" />
            <path
              d="M18 14l3-6h14l3 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            <circle cx="44" cy="20" r="2" fill="currentColor" opacity="0.6" />
          </svg>
        </div>

        {isDragging ? (
          <p className="drop-label">Drop it like it&apos;s hot 🔥</p>
        ) : (
          <>
            <p className="drop-label">Drop your image here</p>
            <div className="drop-methods">
              <span>
                <strong>Click</strong> to browse
              </span>
              <span className="dot">·</span>
              <span>
                <strong>Drag</strong> & drop
              </span>
              <span className="dot">·</span>
              <span>
                <kbd>Ctrl+V</kbd> to paste
              </span>
            </div>
            <p className="drop-formats">JPG, PNG, WebP, GIF · Max 10MB</p>
          </>
        )}
      </div>

      {error && (
        <div className="drop-error" onClick={(e) => e.stopPropagation()}>
          ⚠️ {error}
        </div>
      )}

      <style jsx>{`
        .drop-zone {
          position: relative;
          width: 100%;
          border: 2px dashed var(--border-light);
          border-radius: 16px;
          background: var(--bg-secondary);
          cursor: pointer;
          overflow: hidden;
          min-height: 280px;
          display: flex;
          align-items: center;
          justify-content: center;
          user-select: none;
        }

        .drop-zone:hover {
          border-color: var(--accent);
          background: var(--bg-card);
        }

        .drop-zone:focus-visible {
          outline: 2px solid var(--accent);
          outline-offset: 2px;
        }

        .drop-zone.dragging {
          border-color: var(--accent);
          background: var(--bg-card);
          box-shadow: inset 0 0 40px rgba(245, 158, 11, 0.08),
            0 0 0 1px rgba(245, 158, 11, 0.3);
        }

        .frame-corner {
          position: absolute;
          width: 20px;
          height: 20px;
          border-color: var(--accent);
          border-style: solid;
          border-width: 0;
          opacity: 0.5;
          transition: opacity 0.2s;
        }

        .drop-zone:hover .frame-corner,
        .drop-zone.dragging .frame-corner {
          opacity: 1;
        }

        .top-left {
          top: 12px;
          left: 12px;
          border-top-width: 2px;
          border-left-width: 2px;
        }
        .top-right {
          top: 12px;
          right: 12px;
          border-top-width: 2px;
          border-right-width: 2px;
        }
        .bottom-left {
          bottom: 12px;
          left: 12px;
          border-bottom-width: 2px;
          border-left-width: 2px;
        }
        .bottom-right {
          bottom: 12px;
          right: 12px;
          border-bottom-width: 2px;
          border-right-width: 2px;
        }

        .drop-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          padding: 2rem;
          z-index: 1;
          transition: transform 0.2s ease;
        }

        .scale-up {
          transform: scale(1.05);
        }

        .camera-icon-wrap {
          color: var(--text-muted);
          transition: color 0.2s;
        }

        .drop-zone:hover .camera-icon-wrap,
        .drop-zone.dragging .camera-icon-wrap {
          color: var(--accent);
        }

        .drop-label {
          font-family: var(--font-serif);
          font-size: 1.25rem;
          color: var(--text-secondary);
          font-style: italic;
        }

        .drop-methods {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.875rem;
          color: var(--text-muted);
          flex-wrap: wrap;
          justify-content: center;
        }

        .drop-methods strong {
          color: var(--text-secondary);
          font-weight: 600;
        }

        .dot {
          color: var(--border-light);
        }

        kbd {
          display: inline-block;
          padding: 1px 6px;
          background: var(--bg-primary);
          border: 1px solid var(--border-light);
          border-radius: 4px;
          font-size: 0.75rem;
          font-family: monospace;
          color: var(--text-secondary);
        }

        .drop-formats {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .drop-error {
          position: absolute;
          bottom: 16px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(239, 68, 68, 0.15);
          border: 1px solid rgba(239, 68, 68, 0.4);
          color: #fca5a5;
          padding: 6px 16px;
          border-radius: 8px;
          font-size: 0.8rem;
          white-space: nowrap;
          z-index: 2;
        }
      `}</style>
    </div>
  );
}
