import type { CSSProperties, ReactNode } from "react";
import clsx from "clsx";
import "./Result.css";

export interface ResultProps {
  status?: "success" | "error" | "info" | "warning" | "404" | "500";
  title: ReactNode;
  subTitle?: ReactNode;
  extra?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

const iconMap: Record<string, string> = {
  success: "✓",
  error: "✕",
  info: "i",
  warning: "!",
  "404": "?",
  "500": "!",
};

export default function Result({
  status = "info",
  title,
  subTitle,
  extra,
  className,
  style,
}: ResultProps) {
  return (
    <div className={clsx("pixel-result", className)} style={style}>
      <div className={`pixel-result-icon pixel-result-icon--${status}`}>
        {iconMap[status] ?? "?"}
      </div>
      <div className="pixel-result-title">{title}</div>
      {subTitle && <div className="pixel-result-subtitle">{subTitle}</div>}
      {extra && <div className="pixel-result-extra">{extra}</div>}
    </div>
  );
}