import { useState, useRef, useEffect, type ReactNode } from "react";
import clsx from "clsx";
import "./Dropdown.css";

interface DropdownItem {
  key: string;
  label: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
  danger?: boolean;
  divider?: boolean;
}

interface DropdownProps {
  items: DropdownItem[];
  children: ReactNode;
  trigger?: "hover" | "click";
  className?: string;
  style?: React.CSSProperties;
  onSelect?: (key: string) => void;
}

export default function Dropdown({
  items,
  children,
  trigger = "hover",
  className,
  style,
  onSelect,
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (item: DropdownItem) => {
    if (item.disabled) return;
    onSelect?.(item.key);
    setOpen(false);
  };

  return (
    <div
      ref={ref}
      className={clsx("pixel-dropdown", className)}
      style={style}
      onMouseEnter={trigger === "hover" ? () => setOpen(true) : undefined}
      onMouseLeave={trigger === "hover" ? () => setOpen(false) : undefined}
    >
      <div
        className="pixel-dropdown-trigger"
        onClick={trigger === "click" ? () => setOpen((v) => !v) : undefined}
      >
        {children}
      </div>
      {open && (
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
}