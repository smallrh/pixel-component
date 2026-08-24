import { type CSSProperties, type ReactNode, useState } from "react";
import clsx from "clsx";
import "./Alert.css";

export interface AlertProps {
  /** 主要提示信息 */
  message: ReactNode;
  /** 辅助说明文本 */
  description?: ReactNode;
  /** 提示类型，决定配色与图标，默认 "info" */
  type?: "info" | "success" | "warning" | "error";
  /** 是否允许用户关闭，默认 false */
  closable?: boolean;
  /** 是否显示类型图标，默认 true */
  showIcon?: boolean;
  /** 自定义附加类名 */
  className?: string;
  /** 自定义内联样式 */
  style?: CSSProperties;
}

const iconMap: Record<string, string> = {
  info: "i",
  success: "✓",
  warning: "!",
  error: "✕",
};

/**
 * Alert 警告提示。
 * 用于在页面内展示重要的全局提示信息，支持类型配色、图标与可关闭交互。
 */
export default function Alert({
  message,
  description,
  type = "info",
  closable = false,
  showIcon = true,
  className,
  style,
}: AlertProps) {
  const [closed, setClosed] = useState(false);
  if (closed) return null;

  return (
    <div
      className={clsx("pixel-alert", `pixel-alert--${type}`, className)}
      style={style}
    >
      {showIcon && <span className="pixel-alert-icon">{iconMap[type]}</span>}
      <div className="pixel-alert-body">
        <div className="pixel-alert-message">{message}</div>
        {description && <div className="pixel-alert-desc">{description}</div>}
      </div>
      {closable && (
        <button
          type="button"
          className="pixel-alert-close"
          onClick={() => setClosed(true)}
          aria-label="Close"
        >
          ✕
        </button>
      )}
    </div>
  );
}