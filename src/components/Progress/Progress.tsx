import type { CSSProperties } from "react";
import clsx from "clsx";
import "./Progress.css";

export interface ProgressProps {
  percent: number;
  showInfo?: boolean;
  strokeColor?: string;
  className?: string;
  style?: CSSProperties;
}

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