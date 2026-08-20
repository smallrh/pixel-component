import { type CSSProperties, type ReactNode, useRef, useState, useEffect } from "react";
import clsx from "clsx";
import "./Tooltip.css";
import { usePopupPosition, popupStyle, renderPopup, type PopupPlacement } from "../../utils/popup";

export interface TooltipProps {
  title: ReactNode;
  children: ReactNode;
  placement?: "top" | "bottom" | "left" | "right";
  className?: string;
  style?: CSSProperties;
}

const PLACEMENT_MAP: Record<NonNullable<TooltipProps["placement"]>, PopupPlacement> = {
  top: "top",
  bottom: "bottom",
  left: "left",
  right: "right",
};

export default function Tooltip({
  title,
  children,
  placement = "top",
  className,
  style,
}: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const wrapRef = useRef<HTMLSpanElement>(null);
  const popupRef = useRef<HTMLSpanElement>(null);
  const pos = usePopupPosition(wrapRef, popupRef, visible, PLACEMENT_MAP[placement]);

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
      ref={wrapRef}
      className={clsx("pixel-tooltip", className)}
      style={style}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {children}
      {visible &&
        renderPopup(
          <span
            ref={popupRef}
            role="tooltip"
            className={clsx("pixel-tooltip-content", `pixel-tooltip--${placement}`)}
            style={popupStyle(pos, 1200)}
          >
            {title}
          </span>
        )}
    </span>
  );
}
