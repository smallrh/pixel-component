import { type CSSProperties, type ReactNode } from "react";
import clsx from "clsx";
import "./Skeleton.css";

type Size = "sm" | "md" | "lg";
type Shape = "circle" | "square" | "round";

export interface SkeletonProps {
  /** 是否展示动画效果，默认 true */
  active?: boolean;
  /** 为 true 时直接渲染 children，不再展示骨架，默认 false */
  loading?: boolean;
  /** 是否显示标题占位条，默认 true */
  title?: boolean;
  /** 是否显示头像占位，默认 false */
  avatar?: boolean;
  /** 段落占位配置；为 false 不渲染，对象可指定 rows/width，默认 true */
  paragraph?: boolean | { rows?: number; width?: string | number };
  /** 段落行数（覆盖 paragraph.rows），默认 3 */
  rows?: number;
  /** 段落宽度（覆盖 paragraph.width），最后一行默认 60% */
  width?: string | number;
  /** loading 为 true 时实际渲染的内容 */
  children?: ReactNode;
  /** 附加的样式类名 */
  className?: string;
  /** 行内样式 */
  style?: CSSProperties;
}

/**
 * Skeleton 骨架屏。在数据加载前展示占位结构，支持头像、标题、段落与子组件回退，
 * 同时提供 Avatar/Button/Input/Image 复合子组件。
 */
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
export interface AvatarProps {
  /** 是否展示动画效果，默认 true */
  active?: boolean;
  /** 头像尺寸，数字为像素值，否则取档位，默认 "md" */
  size?: number | Size;
  /** 头像形状，默认 "circle" */
  shape?: Shape;
  /** 附加的样式类名 */
  className?: string;
  /** 行内样式 */
  style?: CSSProperties;
}

/**
 * Skeleton.Avatar 头像骨架占位。提供圆/方/圆角三种形状与像素或档位尺寸。
 */
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
export interface ButtonProps {
  /** 是否展示动画效果，默认 true */
  active?: boolean;
  /** 按钮尺寸，默认 "md" */
  size?: Size;
  /** 按钮形状，默认 "round" */
  shape?: Shape;
  /** 是否撑满父级宽度，默认 false */
  block?: boolean;
  /** 附加的样式类名 */
  className?: string;
  /** 行内样式 */
  style?: CSSProperties;
}

/**
 * Skeleton.Button 按钮骨架占位。用于在加载完成前预留按钮形态。
 */
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
export interface InputProps {
  /** 是否展示动画效果，默认 true */
  active?: boolean;
  /** 输入框尺寸，默认 "md" */
  size?: Size;
  /** 附加的样式类名 */
  className?: string;
  /** 行内样式 */
  style?: CSSProperties;
}

/**
 * Skeleton.Input 输入框骨架占位。用于在加载完成前预留表单输入位置。
 */
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
export interface ImageProps {
  /** 是否展示动画效果，默认 true */
  active?: boolean;
  /** 附加的样式类名 */
  className?: string;
  /** 行内样式 */
  style?: CSSProperties;
}

/**
 * Skeleton.Image 图片骨架占位。附带图片图标提示，用于图片资源加载前的占位。
 */
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
