import type { CSSProperties, ReactNode } from "react";
import clsx from "clsx";
import "./Result.css";

export interface ResultProps {
  /** 结果状态，决定图标与配色，默认 "info" */
  status?: "success" | "error" | "info" | "warning" | "404" | "500";
  /** 标题内容 */
  title: ReactNode;
  /** 副标题内容 */
  subTitle?: ReactNode;
  /** 补充操作区域，常放返回按钮等 */
  extra?: ReactNode;
  /** 自定义附加类名 */
  className?: string;
  /** 自定义内联样式 */
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

/**
 * Result 结果页。
 * 用于反馈操作结果或异常状态，包含图标、标题、副标题与补充操作区。
 */
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