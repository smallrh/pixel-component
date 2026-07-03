import { useState } from "react";
import clsx from "clsx";
import "./Image.css";

interface ImageProps {
  src: string;
  alt?: string;
  width?: number | string;
  height?: number | string;
  preview?: boolean;
  fallback?: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function Image({
  src,
  alt = "",
  width,
  height,
  preview = true,
  fallback,
  className,
  style,
}: ImageProps) {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [imgError, setImgError] = useState(false);
  const displaySrc = imgError && fallback ? fallback : src;

  return (
    <>
      <div
        className={clsx("pixel-image", className)}
        style={{ width, height, ...style }}
      >
        <img
          src={displaySrc}
          alt={alt}
          className="pixel-image-img"
          onClick={() => preview && setPreviewOpen(true)}
          onError={() => setImgError(true)}
          style={{ width, height }}
        />
      </div>
      {preview && previewOpen && (
        <div className="pixel-image-preview" onClick={() => setPreviewOpen(false)}>
          <div className="pixel-image-preview-wrap">
            <img src={displaySrc} alt={alt} className="pixel-image-preview-img" />
          </div>
        </div>
      )}
    </>
  );
}