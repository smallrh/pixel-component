import { type CSSProperties, forwardRef, useState, useRef, useEffect, useCallback, type KeyboardEvent, type ReactNode } from "react";
import clsx from "clsx";
import "./Dropdown.css";
import { mergeRefs } from "../../utils/mergeRefs";
import { usePopupPosition, popupStyle, renderPopup } from "../../utils/popup";

interface DropdownItem {
  /** 菜单项唯一标识 */
  key: string;
  /** 菜单项显示内容 */
  label: ReactNode;
  /** 菜单项前缀图标 */
  icon?: ReactNode;
  /** 是否禁用 */
  disabled?: boolean;
  /** 是否为危险操作（红色样式） */
  danger?: boolean;
  /** 是否渲染为分隔线（此时不显示内容） */
  divider?: boolean;
}

export interface DropdownProps {
  /** 下拉菜单项列表 */
  items: DropdownItem[];
  /** 触发下拉的载体节点 */
  children: ReactNode;
  /** 触发方式，默认 "hover" */
  trigger?: "hover" | "click";
  /** 自定义类名 */
  className?: string;
  /** 自定义内联样式 */
  style?: CSSProperties;
  /** 选中菜单项回调，参数为该项的 key */
  onSelect?: (key: string) => void;
  /** 是否展开（受控） */
  open?: boolean;
  /** 展开状态变化回调 */
  onOpenChange?: (open: boolean) => void;
}

/**
 * Dropdown 下拉菜单。在触发节点下方弹出菜单列表，支持悬停或点击触发。
 * 关键特性：弹层 portal 到 body 避免被祖先 overflow 裁剪；hover 模式使用延迟防闪烁；
 * 点击外部自动关闭；支持禁用项、危险项与分隔线。
 */
const DROPDOWN_Z_INDEX = 1000;
const HOVER_CLOSE_DELAY = 120; // hover trigger 延迟关闭毫秒数，防鼠标从 trigger 快速移到弹层时误关闭

const Dropdown = forwardRef<HTMLDivElement, DropdownProps>(function Dropdown({
  items,
  children,
  trigger = "hover",
  className,
  style,
  onSelect,
  open,
  onOpenChange,
}, ref) {
  const isControlled = open !== undefined;
  const [internalOpen, setInternalOpen] = useState(false);
  const currentOpen = isControlled ? open : internalOpen;

  // hover trigger 下的关闭定时器：鼠标短暂离开时不立即关闭
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const emitOpenChange = useCallback((next: boolean) => {
    if (!isControlled) setInternalOpen(next);
    onOpenChange?.(next);
  }, [isControlled, onOpenChange]);

  const triggerRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLUListElement>(null);
  const pos = usePopupPosition(triggerRef, popupRef, currentOpen, "bottomLeft");

  // 清除 hover 关闭定时器的辅助函数
  const clearCloseTimer = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = undefined;
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      const insideTrigger = triggerRef.current?.contains(target);
      const insidePopup = popupRef.current?.contains(target);
      if (!insideTrigger && !insidePopup) {
        emitOpenChange(false);
      }
    };
    if (currentOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [currentOpen, emitOpenChange]);

  // 触发节点上的 hover：进入立即打开，离开延迟关闭（防闪烁）
  const handleTriggerEnter = () => {
    if (trigger === "hover") {
      clearCloseTimer();
      emitOpenChange(true);
    }
  };

  const handleTriggerLeave = () => {
    if (trigger === "hover") {
      clearCloseTimer();
      closeTimerRef.current = setTimeout(() => emitOpenChange(false), HOVER_CLOSE_DELAY);
    }
  };

  // 弹层上的 hover：进入时取消关闭定时器，离开时触发关闭
  const handlePopupEnter = () => {
    if (trigger === "hover") clearCloseTimer();
  };

  const handlePopupLeave = () => {
    if (trigger === "hover") {
      clearCloseTimer();
      emitOpenChange(false);
    }
  };

  const handleSelect = useCallback((item: DropdownItem) => {
    if (item.disabled) return;
    onSelect?.(item.key);
    emitOpenChange(false);
  }, [onSelect, emitOpenChange]);

  return (
    <div
      ref={mergeRefs(ref, triggerRef)}
      className={clsx("pixel-dropdown", className)}
      style={style}
      onMouseEnter={handleTriggerEnter}
      onMouseLeave={handleTriggerLeave}
    >
      <div
        className="pixel-dropdown-trigger"
        role="button"
        tabIndex={0}
        aria-haspopup="menu"
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
      {currentOpen &&
        renderPopup(
          <ul
            ref={popupRef}
            className="pixel-dropdown-menu"
            role="menu"
            style={popupStyle(pos, DROPDOWN_Z_INDEX)}
            onMouseEnter={handlePopupEnter}
            onMouseLeave={handlePopupLeave}
          >
            {items.map((item) => {
              if (item.divider) {
                return <li key={item.key} role="separator" className="pixel-dropdown-divider" />;
              }
              return (
                <li
                  key={item.key}
                  role="menuitem"
                  className={clsx(
                    "pixel-dropdown-item",
                    item.disabled && "pixel-dropdown-item--disabled",
                    item.danger && "pixel-dropdown-item--danger"
                  )}
                  aria-disabled={item.disabled || undefined}
                  onClick={() => handleSelect(item)}
                >
                  {item.icon && <span className="pixel-dropdown-item-icon">{item.icon}</span>}
                  <span>{item.label}</span>
                </li>
              );
            })}
          </ul>
        )}
    </div>
  );
});

export default Dropdown;