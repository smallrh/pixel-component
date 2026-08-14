import { type ReactNode } from "react";
import clsx from "clsx";
import "./Skeleton.css";

type Size = "sm" | "md" | "lg";
type Shape = "circle" | "square" | "round";

interface SkeletonProps {
  active?: boolean;
  loading?: boolean;
  title?: boolean;
  avatar?: boolean;
  paragraph?: boolean | { rows?: number; width?: string | number };
  rows?: number;
  width?: string | number;
  children?: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

function Skeleton({
  active = true,
  loading = false,
  title = true,
  avatar = false,
  paragraph = true,
  rows,
  width,
  children,
  className,
  style,
}: SkeletonProps) {
  if (loading) return <>{children}</>;

  const lineCount = rows ?? (typeof paragraph === "object" ? paragraph.rows : undefined) ?? 3;
  const lineWidth =
    width ??
    (typeof paragraph === "object" ? paragraph.width : undefined);

  return (
    <div className={clsx("pixel-skeleton", active && "pixel-skeleton--active", className)} style={style}>
      <div className="pixel-skeleton-container">
        {avatar && (
          <SkeletonAvatar active={active} />
        )}
        <div className="pixel-skeleton-content">
          {title && (
            <div
              className="pixel-skeleton-line pixel-skeleton-line--title"
              style={{ width: title === true ? "38%" : undefined }}
            />
          )}
          {Array.from({ length: lineCount }).map((_, i) => (
            <div
              key={i}
              className="pixel-skeleton-line"
              style={{ width: lineWidth ?? (i === lineCount - 1 ? "60%" : "100%") }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// --- Skeleton.Avatar ---
interface AvatarProps {
  active?: boolean;
  size?: number | Size;
  shape?: Shape;
  className?: string;
  style?: React.CSSProperties;
}

function SkeletonAvatar({
  active = true,
  size = "md",
  shape = "circle",
  className,
  style,
}: AvatarProps) {
  const px = typeof size === "number" ? size : undefined;
  return (
    <div
      className={clsx(
        "pixel-skeleton-avatar",
        `pixel-skeleton-avatar--${shape}`,
        active && "pixel-skeleton--active",
        className
      )}
      style={{ ...(px ? { width: px, height: px } : {}), ...style }}
    >
      <span className="pixel-skeleton-block" />
    </div>
  );
}

// --- Skeleton.Button ---
interface ButtonProps {
  active?: boolean;
  size?: Size;
  shape?: Shape;
  block?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

function SkeletonButton({
  active = true,
  size = "md",
  shape = "round",
  block = false,
  className,
  style,
}: ButtonProps) {
  return (
    <div
      className={clsx(
        "pixel-skeleton-btn",
        `pixel-skeleton-btn--${size}`,
        `pixel-skeleton-btn--${shape}`,
        active && "pixel-skeleton--active",
        block && "pixel-skeleton-btn--block",
        className
      )}
      style={style}
    >
      <span className="pixel-skeleton-block" />
    </div>
  );
}

// --- Skeleton.Input ---
interface InputProps {
  active?: boolean;
  size?: Size;
  className?: string;
  style?: React.CSSProperties;
}

function SkeletonInput({
  active = true,
  size = "md",
  className,
  style,
}: InputProps) {
  return (
    <div
      className={clsx(
        "pixel-skeleton-input",
        `pixel-skeleton-input--${size}`,
        active && "pixel-skeleton--active",
        className
      )}
      style={style}
    >
      <span className="pixel-skeleton-block" />
    </div>
  );
}

// --- Skeleton.Image ---
interface ImageProps {
  active?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

function SkeletonImage({
  active = true,
  className,
  style,
}: ImageProps) {
  return (
    <div
      className={clsx(
        "pixel-skeleton-image",
        active && "pixel-skeleton--active",
        className
      )}
      style={style}
    >
      <span className="pixel-skeleton-block" />
      <span className="pixel-skeleton-image-icon" aria-hidden />
    </div>
  );
}

const SkeletonComponent = Skeleton as typeof Skeleton & {
  Avatar: typeof SkeletonAvatar;
  Button: typeof SkeletonButton;
  Input: typeof SkeletonInput;
  Image: typeof SkeletonImage;
};

SkeletonComponent.Avatar = SkeletonAvatar;
SkeletonComponent.Button = SkeletonButton;
SkeletonComponent.Input = SkeletonInput;
SkeletonComponent.Image = SkeletonImage;

export default SkeletonComponent;
