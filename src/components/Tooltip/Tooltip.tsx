import { type CSSProperties, forwardRef, type ReactNode, useRef, useState, useEffect } from "react";
import clsx from "clsx";
import "./Tooltip.css";
import { usePopupPosition, popupStyle, renderPopup, type PopupPlacement } from "../../utils/popup";
import { mergeRefs } from "../../utils/mergeRefs";
import { deprecated } from "../../utils/deprecated";

export interface TooltipProps {
  /** 提示内容 */
  title: ReactNode;
  /** 触发元素 */
  children: ReactNode;
  /** 弹出位置，默认 "top" */
  placement?: "top" | "bottom" | "left" | "right";
  /** 自定义类名 */
  className?: string;
  /** 自定义内联样式 */
  style?: CSSProperties;
  /** 是否展开（受控） */
  open?: boolean;
  /** 展开状态变化回调 */
  onOpenChange?: (open: boolean) => void;
  /**
   * 是否展开（受控）- 已弃用，请使用 `open`
   * @deprecated 使用 `open` 代替（since 1.1.0）
   */
  visible?: boolean;
  /**
   * 展开状态变化回调 - 已弃用，请使用 `onOpenChange`
   * @deprecated 使用 `onOpenChange` 代替（since 1.1.0）
   */
  onVisibleChange?: (visible: boolean) => void;
}

const PLACEMENT_MAP: Record<NonNullable<TooltipProps["placement"]>, PopupPlacement> = {
  top: "top",
  bottom: "bottom",
  left: "left",
  right: "right",
};

/**
 * Tooltip。文字提示，悬停/聚焦触发元素时按 placement 弹出，基于视口定位并支持延迟隐藏。
 */
const Tooltip = forwardRef<HTMLDivElement, TooltipProps>(function Tooltip({
  title,
  children,
  placement = "top",
  className,
  style,
  open,
  onOpenChange,
  visible,
  onVisibleChange,
}, ref) {
  // 弃用警告（仅开发环境，去重）
  if (visible !== undefined) {
    deprecated({ name: "Tooltip.visible", alternative: "Tooltip.open", since: "1.1.0" });
  }
  if (onVisibleChange !== undefined) {
    deprecated({ name: "Tooltip.onVisibleChange", alternative: "Tooltip.onOpenChange", since: "1.1.0" });
  }

  // 受控优先级：open > visible
  const controlledValue = open !== undefined ? open : visible;
  const isControlled = controlledValue !== undefined;
  const [internalOpen, setInternalOpen] = useState(false);
  const currentOpen = isControlled ? controlledValue : internalOpen;

  // visible 变化时同步到 internalOpen（非受控 open 但受控 visible 场景）
  useEffect(() => {
    if (open === undefined && visible !== undefined) {
      setInternalOpen(visible);
    }
  }, [visible, open]);

  const emitOpenChange = (next: boolean) => {
    if (!isControlled) setInternalOpen(next);
    onOpenChange?.(next);
    onVisibleChange?.(next);
  };
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const wrapRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLSpanElement>(null);
  const pos = usePopupPosition(wrapRef, popupRef, currentOpen, PLACEMENT_MAP[placement]);

  const show = () => {
    clearTimeout(timerRef.current);
    emitOpenChange(true);
  };

  const hide = () => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => emitOpenChange(false), 100);
  };

  // 卸载时清理定时器，避免内存泄漏
  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  return (
    <div
      ref={mergeRefs(ref, wrapRef)}
      className={clsx("pixel-tooltip", className)}
      style={style}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {children}
      {currentOpen &&
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
    </div>
  );
});

export default Tooltip;
