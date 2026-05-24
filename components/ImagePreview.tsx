"use client";

import Image from "next/image";
import { UploadedImage } from "@/lib/types";

interface ImagePreviewProps {
  image: UploadedImage;
  onRemove: () => void;
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function ImagePreview({ image, onRemove }: ImagePreviewProps) {
  return (
    <div className="preview-wrapper fade-in">
      <div className="polaroid">
        {/* Polaroid frame */}
        <div className="polaroid-photo">
          <Image
            src={image.previewUrl}
            alt={image.name}
            fill
            style={{ objectFit: "cover" }}
            unoptimized
          />
        </div>
        <div className="polaroid-caption">
          <span className="caption-name">{image.name}</span>
          <span className="caption-size">{formatBytes(image.size)}</span>
        </div>
      </div>

      {/* Remove button */}
      <button
        onClick={onRemove}
        className="remove-btn"
        aria-label="Remove image"
        id="remove-image-btn"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1 1l12 12M13 1L1 13"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
        Remove
      </button>

      <style jsx>{`
        .preview-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          padding: 1rem 0;
        }

        .polaroid {
          background: #f5f0e8;
          padding: 12px 12px 44px;
          box-shadow: var(--shadow-lg), 2px 4px 12px rgba(0, 0, 0, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.3);
          transform: rotate(-2deg);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          max-width: 320px;
          width: 100%;
        }

        .polaroid:hover {
          transform: rotate(0deg) scale(1.02);
          box-shadow: var(--shadow-lg), 4px 8px 24px rgba(0, 0, 0, 0.4),
            inset 0 1px 0 rgba(255, 255, 255, 0.3);
        }

        .polaroid-photo {
          position: relative;
          width: 100%;
          aspect-ratio: 4 / 3;
          background: #e0d8c8;
          overflow: hidden;
        }

        .polaroid-caption {
          margin-top: 8px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
          padding: 4px 0 0;
        }

        .caption-name {
          font-family: var(--font-serif);
          font-size: 0.85rem;
          color: #5a4a3a;
          font-style: italic;
          max-width: 200px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .caption-size {
          font-size: 0.7rem;
          color: #8a7a6a;
          font-family: monospace;
        }

        .remove-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 16px;
          border-radius: 9999px;
          border: 1px solid rgba(239, 68, 68, 0.3);
          background: rgba(239, 68, 68, 0.08);
          color: #fca5a5;
          font-size: 0.8rem;
          font-family: var(--font-sans);
          cursor: pointer;
          transition: all 0.2s;
        }

        .remove-btn:hover {
          background: rgba(239, 68, 68, 0.15);
          border-color: rgba(239, 68, 68, 0.5);
          color: #f87171;
        }
      `}</style>
    </div>
  );
}
