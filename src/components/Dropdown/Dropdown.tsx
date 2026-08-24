import { type CSSProperties, forwardRef, useState, useRef, useEffect, type KeyboardEvent, type ReactNode } from "react";
import clsx from "clsx";
import "./Dropdown.css";
import { mergeRefs } from "../../utils/mergeRefs";

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
 * 关键特性：点击外部自动关闭；支持禁用项、危险项与分隔线。
 */
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
  const emitOpenChange = (next: boolean) => {
    if (!isControlled) setInternalOpen(next);
    onOpenChange?.(next);
  };
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        emitOpenChange(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (item: DropdownItem) => {
    if (item.disabled) return;
    onSelect?.(item.key);
    emitOpenChange(false);
  };

  return (
    <div
      ref={mergeRefs(ref, rootRef)}
      className={clsx("pixel-dropdown", className)}
      style={style}
      onMouseEnter={trigger === "hover" ? () => emitOpenChange(true) : undefined}
      onMouseLeave={trigger === "hover" ? () => emitOpenChange(false) : undefined}
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
      {currentOpen && (
        <ul className="pixel-dropdown-menu">
          {items.map((item) => {
            if (item.divider) {
              return <li key={item.key} className="pixel-dropdown-divider" />;
            }
            return (
              <li
                key={item.key}
                className={clsx(
                  "pixel-dropdown-item",
                  item.disabled && "pixel-dropdown-item--disabled",
                  item.danger && "pixel-dropdown-item--danger"
                )}
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