import { type CSSProperties, forwardRef, useState, useRef, useEffect, type KeyboardEvent, type ReactNode } from "react";
import clsx from "clsx";
import "./Popover.css";
import { mergeRefs } from "../../utils/mergeRefs";
import { deprecated } from "../../utils/deprecated";

export interface PopoverProps {
  /** 卡片标题 */
  title?: ReactNode;
  /** 卡片内容 */
  content: ReactNode;
  /** 触发元素 */
  children: ReactNode;
  /** 触发方式，默认 "click" */
  trigger?: "click" | "hover";
  /** 弹出位置，默认 "bottom" */
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

/**
 * Popover。浮层卡片，包裹触发元素后通过点击或悬停展示标题与内容，点击外部自动收起。
 */
const Popover = forwardRef<HTMLDivElement, PopoverProps>(function Popover({
  title,
  content,
  children,
  trigger = "click",
  placement = "bottom",
  className,
  style,
  open,
  onOpenChange,
  visible,
  onVisibleChange,
}, ref) {
  // 弃用警告（仅开发环境，去重）
  if (visible !== undefined) {
    deprecated({ name: "Popover.visible", alternative: "Popover.open", since: "1.1.0" });
  }
  if (onVisibleChange !== undefined) {
    deprecated({ name: "Popover.onVisibleChange", alternative: "Popover.onOpenChange", since: "1.1.0" });
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
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        emitOpenChange(false);
      }
    };
    if (currentOpen) {
      document.addEventListener("mousedown", handleOutside);
      return () => document.removeEventListener("mousedown", handleOutside);
    }
  }, [currentOpen]);

  return (
    <div
      ref={mergeRefs(ref, rootRef)}
      className={clsx("pixel-popover", className)}
      style={style}
      onMouseEnter={trigger === "hover" ? () => emitOpenChange(true) : undefined}
      onMouseLeave={trigger === "hover" ? () => emitOpenChange(false) : undefined}
    >
      <div
        role="button"
        tabIndex={0}
        aria-expanded={currentOpen}
        onClick={trigger === "click" ? () => emitOpenChange(!currentOpen) : undefined}
        onKeyDown={trigger === "click" ? (e: KeyboardEvent) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            emitOpenChange(!currentOpen);
          }
        } : undefined}
      >
        {children}
      </div>
      {currentOpen && (
        <div
          className={clsx(
            "pixel-popover-card",
            `pixel-popover--${placement}`
          )}
        >
          {title && <div className="pixel-popover-title">{title}</div>}
          <div className="pixel-popover-content">{content}</div>
        </div>
      )}
    </div>
  );
});

export default Popover;
