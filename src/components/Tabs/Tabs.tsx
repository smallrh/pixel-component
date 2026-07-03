import { useState, type ReactNode } from "react";
import clsx from "clsx";
import "./Tabs.css";

interface TabItem {
  key: string;
  label: ReactNode;
  disabled?: boolean;
  children?: ReactNode;
}

interface TabsProps {
  items: TabItem[];
  defaultActiveKey?: string;
  className?: string;
  style?: React.CSSProperties;
  onChange?: (key: string) => void;
}

export default function Tabs({
  items,
  defaultActiveKey,
  className,
  style,
  onChange,
}: TabsProps) {
  const [activeKey, setActiveKey] = useState(defaultActiveKey ?? items[0]?.key ?? "");

  const handleSelect = (key: string, disabled?: boolean) => {
    if (disabled) return;
    setActiveKey(key);
    onChange?.(key);
  };

  const activeItem = items.find((item) => item.key === activeKey);

  return (
    <div className={clsx("pixel-tabs", className)} style={style}>
      <div className="pixel-tabs-bar">
        {items.map((item) => (
          <button
            key={item.key}
            className={clsx(
              "pixel-tabs-tab",
              activeKey === item.key && "pixel-tabs-tab--active",
              item.disabled && "pixel-tabs-tab--disabled"
            )}
            disabled={item.disabled}
            onClick={() => handleSelect(item.key, item.disabled)}
          >
            {item.label}
          </button>
        ))}
        <span className="pixel-tabs-indicator" />
      </div>
      {activeItem && (
        <div className="pixel-tabs-content">{activeItem.children}</div>
      )}
    </div>
  );
}