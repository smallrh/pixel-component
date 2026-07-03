import { useState, type ReactNode } from "react";
import clsx from "clsx";
import "./Collapse.css";

interface CollapseItem {
  key: string;
  label: ReactNode;
  children: ReactNode;
}

interface CollapseProps {
  items: CollapseItem[];
  defaultActiveKey?: string[];
  accordion?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export default function Collapse({
  items,
  defaultActiveKey = [],
  accordion = false,
  className,
  style,
}: CollapseProps) {
  const [activeKeys, setActiveKeys] = useState<string[]>(defaultActiveKey);

  const toggle = (key: string) => {
    if (accordion) {
      setActiveKeys(activeKeys.includes(key) ? [] : [key]);
    } else {
      setActiveKeys((prev) =>
        prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
      );
    }
  };

  return (
    <div className={clsx("pixel-collapse", className)} style={style}>
      {items.map((item) => (
        <div
          key={item.key}
          className={clsx(
            "pixel-collapse-item",
            activeKeys.includes(item.key) && "pixel-collapse-item--active"
          )}
        >
          <div
            className="pixel-collapse-header"
            onClick={() => toggle(item.key)}
          >
            <span className="pixel-collapse-arrow">
              {activeKeys.includes(item.key) ? "▾" : "▸"}
            </span>
            <span>{item.label}</span>
          </div>
          {activeKeys.includes(item.key) && (
            <div className="pixel-collapse-body">{item.children}</div>
          )}
        </div>
      ))}
    </div>
  );
}