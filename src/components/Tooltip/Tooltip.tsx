import { useState, useRef } from "react";
import clsx from "clsx";
import "./Tooltip.css";

interface TooltipProps {
  title: React.ReactNode;
  children: React.ReactNode;
  placement?: "top" | "bottom" | "left" | "right";
  className?: string;
  style?: React.CSSProperties;
}

export default function Tooltip({
  title,
  children,
  placement = "top",
  className,
  style,
}: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  const show = () => {
    clearTimeout(timerRef.current);
    setVisible(true);
  };

  const hide = () => {
    timerRef.current = setTimeout(() => setVisible(false), 100);
  };

  return (
    <span
      className={clsx("pixel-tooltip", className)}
      style={style}
      onMouseEnter={show}
      onMouseLeave={hide}
    >
      {children}
      {visible && (
        <span
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