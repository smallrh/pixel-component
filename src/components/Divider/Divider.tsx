import type { CSSProperties } from "react";
import clsx from "clsx";
import "./Divider.css";

export interface DividerProps {
  /** 分隔线上显示的文本，留空则渲染为纯线条 */
  text?: string;
  /** 文本对齐位置，默认 "center" */
  orientation?: "left" | "center" | "right";
  /** 自定义附加类名 */
  className?: string;
  /** 自定义内联样式 */
  style?: CSSProperties;
}

/**
 * Divider 分隔线。
 * 用于区隔内容区块，支持在分隔线上展示文本，并控制文本对齐方向。
 */
export default function Divider({
  text,
  orientation = "center",
  className,
  style,
}: DividerProps) {
  return (
    <div
      className={clsx(
        "pixel-divider",
        text && `pixel-divider--with-text pixel-divider--text-${orientation}`,
        className
      )}
      style={style}
    >
      {text && <span className="pixel-divider-text">{text}</span>}
    </div>
  );
}