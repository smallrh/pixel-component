import { type CSSProperties, type ReactNode, useState, useRef, useEffect } from "react";
import clsx from "clsx";
import "./Tooltip.css";

export interface TooltipProps {
  title: ReactNode;
  children: ReactNode;
  placement?: "top" | "bottom" | "left" | "right";
  className?: string;
  style?: CSSProperties;
}

export default function Tooltip({
  title,
  children,
  placement = "top",
  className,
  style,
}: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const show = () => {
    clearTimeout(timerRef.current);
    setVisible(true);
  };

  const hide = () => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setVisible(false), 100);
  };

  // 卸载时清理定时器，避免内存泄漏
  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  return (
    <span
      className={clsx("pixel-tooltip", className)}
      style={style}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {children}
      {visible && (
        <span
          role="tooltip"
          className={clsx(
            "pixel-tooltip-content",
            `pixel-tooltip--${placement}`
          )}
        >
          {title}
        </span>
      )}
    </span>
  );
}
