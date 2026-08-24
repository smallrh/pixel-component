import { type CSSProperties, type ReactNode } from "react";
import clsx from "clsx";
import "./Space.css";

export interface SpaceProps {
  /** 排列方向，默认 "horizontal" */
  direction?: "horizontal" | "vertical";
  /** 间距尺寸，默认 "md" */
  size?: "sm" | "md" | "lg";
  /** 是否换行，默认 false */
  wrap?: boolean;
  /** 自定义附加类名 */
  className?: string;
  /** 自定义内联样式 */
  style?: CSSProperties;
  /** 间距单元内容 */
  children?: ReactNode;
}

/**
 * Space 间距。
 * 按指定方向与尺寸为子元素提供统一间距，支持自动换行。
 */
export default function Space({
  direction = "horizontal",
  size = "md",
  wrap = false,
  className,
  style,
  children,
}: SpaceProps) {
  return (
    <div
      className={clsx(
        "pixel-space",
        `pixel-space--${direction}`,
        `pixel-space--${size}`,
        wrap && "pixel-space--wrap",
        className
      )}
      style={style}
    >
      {children}
    </div>
  );
}