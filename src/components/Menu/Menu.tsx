import { type CSSProperties, type ReactNode, useState } from "react";
import clsx from "clsx";
import "./Menu.css";

export interface MenuItem {
  key: string;
  label: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
  children?: MenuItem[];
}

export interface MenuProps {
  items: MenuItem[];
  mode?: "horizontal" | "vertical";
  /** 非受控：默认选中项 */
  defaultSelectedKey?: string;
  /** 受控：当前选中项（传入后由外部管理） */
  selectedKey?: string;
  className?: string;
  style?: CSSProperties;
  onSelect?: (key: string) => void;
}

export default function Menu({
  items,
  mode = "horizontal",
  defaultSelectedKey,
  selectedKey: selectedKeyProp,
  className,
  style,
  onSelect,
}: MenuProps) {
  const [innerSelectedKey, setInnerSelectedKey] = useState(defaultSelectedKey ?? "");
  const isControlled = selectedKeyProp !== undefined;
  const selectedKey = isControlled ? selectedKeyProp : innerSelectedKey;
  const [openKeys, setOpenKeys] = useState<string[]>([]);

  const handleSelect = (key: string, disabled?: boolean) => {
    if (disabled) return;
    if (!isControlled) setInnerSelectedKey(key);
    onSelect?.(key);
  };

  const toggleSubmenu = (key: string) => {
    setOpenKeys((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const renderMenuItem = (item: MenuItem, isSub = false) => {
    const hasChildren = item.children && item.children.length > 0;
    const isOpen = openKeys.includes(item.key);

    return (
      <li
        key={item.key}
        className={clsx(
          "pixel-menu-item",
          selectedKey === item.key && !hasChildren && "pixel-menu-item--selected",
          item.disabled && "pixel-menu-item--disabled",
          isSub && "pixel-menu-item--sub"
        )}
      >
        <button
          type="button"
          className="pixel-menu-item-btn"
          disabled={item.disabled}
          onClick={() => {
            if (hasChildren) {
              toggleSubmenu(item.key);
            } else {
              handleSelect(item.key);
            }
          }}
        >
          {item.icon && <span className="pixel-menu-item-icon">{item.icon}</span>}
          <span className="pixel-menu-item-label">{item.label}</span>
          {hasChildren && (
            <span className={clsx("pixel-menu-arrow", isOpen && "pixel-menu-arrow--open")}>
              ▸
            </span>
          )}
        </button>
        {hasChildren && isOpen && (
          <ul className="pixel-menu-submenu">
            {item.children!.map((child) => renderMenuItem(child, true))}
          </ul>
        )}
      </li>
    );
  };

  return (
    <nav
      className={clsx("pixel-menu", `pixel-menu--${mode}`, className)}
      style={style}
    >
      <ul className="pixel-menu-list">
        {items.map((item) => renderMenuItem(item))}
      </ul>
    </nav>
  );
}