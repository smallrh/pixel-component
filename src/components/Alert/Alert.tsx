import { useState } from "react";
import clsx from "clsx";
import "./Alert.css";

interface AlertProps {
  message: React.ReactNode;
  description?: React.ReactNode;
  type?: "info" | "success" | "warning" | "error";
  closable?: boolean;
  showIcon?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const iconMap: Record<string, string> = {
  info: "i",
  success: "✓",
  warning: "!",
  error: "✕",
};

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
        <button className="pixel-alert-close" onClick={() => setClosed(true)}>
          ✕
        </button>
      )}
    </div>
  );
}