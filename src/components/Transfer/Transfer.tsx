import { type CSSProperties, useState } from "react";
import clsx from "clsx";
import Button from "../Button";
import "./Transfer.css";

interface TransferItem {
  key: string;
  title: string;
}

export interface TransferProps {
  dataSource: TransferItem[];
  targetKeys?: string[];
  onChange?: (targetKeys: string[]) => void;
  className?: string;
  style?: CSSProperties;
}

export default function Transfer({
  dataSource,
  targetKeys = [],
  onChange,
  className,
  style,
}: TransferProps) {
  const [leftChecked, setLeftChecked] = useState<string[]>([]);
  const [rightChecked, setRightChecked] = useState<string[]>([]);

  const leftItems = dataSource.filter((d) => !targetKeys.includes(d.key));
  const rightItems = dataSource.filter((d) => targetKeys.includes(d.key));

  const moveRight = () => {
    if (leftChecked.length === 0) return;
    onChange?.([...targetKeys, ...leftChecked]);
    setLeftChecked([]);
  };

  const moveLeft = () => {
    if (rightChecked.length === 0) return;
    onChange?.(targetKeys.filter((k) => !rightChecked.includes(k)));
    setRightChecked([]);
  };

  const toggleLeft = (key: string) => {
    setLeftChecked((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const toggleRight = (key: string) => {
    setRightChecked((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  return (
    <div className={clsx("pixel-transfer", className)} style={style}>
      <div className="pixel-transfer-panel">
        <div className="pixel-transfer-header">{leftItems.length} items</div>
        <div className="pixel-transfer-list">
          {leftItems.map((item) => (
            <label key={item.key} className="pixel-transfer-item">
              <input
                type="checkbox"
                checked={leftChecked.includes(item.key)}
                onChange={() => toggleLeft(item.key)}
              />
              <span>{item.title}</span>
            </label>
          ))}
          {leftItems.length === 0 && (
            <div className="pixel-transfer-empty">Empty</div>
          )}
        </div>
      </div>
      <div className="pixel-transfer-actions">
        <Button size="sm" onClick={moveRight} disabled={leftChecked.length === 0}>
          &gt;
        </Button>
        <Button size="sm" onClick={moveLeft} disabled={rightChecked.length === 0}>
          &lt;
        </Button>
      </div>
      <div className="pixel-transfer-panel">
        <div className="pixel-transfer-header">{rightItems.length} items</div>
        <div className="pixel-transfer-list">
          {rightItems.map((item) => (
            <label key={item.key} className="pixel-transfer-item">
              <input
                type="checkbox"
                checked={rightChecked.includes(item.key)}
                onChange={() => toggleRight(item.key)}
              />
              <span>{item.title}</span>
            </label>
          ))}
          {rightItems.length === 0 && (
            <div className="pixel-transfer-empty">Empty</div>
          )}
        </div>
      </div>
    </div>
  );
}