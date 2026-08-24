import type { CSSProperties, ReactNode } from "react";
import clsx from "clsx";
import "./Spin.css";

export interface SpinProps {
  /** 是否处于加载状态，默认 true */
  spinning?: boolean;
  /** 需要遮罩加载的内容；不传则仅渲染指示器 */
  children?: ReactNode;
  /** 加载提示文本 */
  tip?: string;
  /** 指示器尺寸，默认 "md" */
  size?: "sm" | "md" | "lg";
  /** 自定义附加类名 */
  className?: string;
  /** 自定义内联样式 */
  style?: CSSProperties;
}

/**
 * Spin 加载中。
 * 提供旋转加载指示器，可作为独立元素或包裹内容形成遮罩加载效果。
 */
export default function Spin({
  spinning = true,
  children,
  tip,
  size = "md",
  className,
  style,
}: SpinProps) {
  const content = (
    <div className={clsx("pixel-spin-indicator", `pixel-spin--${size}`)}>
      <div className="pixel-spin-dot" />
      {tip && <div className="pixel-spin-tip">{tip}</div>}
    </div>
  );

  if (!children) return spinning ? content : null;

  return (
    <div className={clsx("pixel-spin", className)} style={style}>
      {spinning && <div className="pixel-spin-overlay">{content}</div>}
      <div className={clsx(spinning && "pixel-spin-blur")}>{children}</div>
    </div>
  );
}