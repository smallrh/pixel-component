import type { CSSProperties } from "react";
import clsx from "clsx";
import "./Progress.css";

export interface ProgressProps {
  /** 完成百分比，会被限制在 0-100 之间 */
  percent: number;
  /** 是否展示百分比文本，默认 true */
  showInfo?: boolean;
  /** 进度条填充颜色，默认 "#000" */
  strokeColor?: string;
  /** 自定义附加类名 */
  className?: string;
  /** 自定义内联样式 */
  style?: CSSProperties;
}

/**
 * Progress 进度条。
 * 以水平进度条形式展示任务完成度，支持自定义填充色与百分比文本展示。
 */
export default function Progress({
  percent,
  showInfo = true,
  strokeColor = "#000",
  className,
  style,
}: ProgressProps) {
  const clamped = Math.min(100, Math.max(0, percent));

  return (
    <div className={clsx("pixel-progress", className)} style={style}>
      <div className="pixel-progress-track">
        <div
          className="pixel-progress-fill"
          style={{ width: `${clamped}%`, background: strokeColor }}
        />
      </div>
      {showInfo && (
        <span className="pixel-progress-text">{clamped}%</span>
      )}
    </div>
  );
}