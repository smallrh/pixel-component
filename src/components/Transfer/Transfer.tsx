import { type CSSProperties, memo, useCallback, useState } from "react";
import clsx from "clsx";
import Button from "../Button";
import "./Transfer.css";

interface TransferItem {
  /** 穿梭项唯一标识 */
  key: string;
  /** 穿梭项显示文本 */
  title: string;
}

export interface TransferProps {
  /** 全部数据源 */
  dataSource: TransferItem[];
  /** 受控：已转移至右侧的 key 列表，默认 [] */
  targetKeys?: string[];
  /** 右侧 key 列表变化回调 */
  onChange?: (targetKeys: string[]) => void;
  /** 自定义类名 */
  className?: string;
  /** 自定义内联样式 */
  style?: CSSProperties;
}

interface TransferItemViewProps {
  item: TransferItem;
  checked: boolean;
  onToggle: (key: string) => void;
}

/**
 * memo 比较函数：checked 为布尔值直接比较；item 引用源自 dataSource（稳定）；
 * onToggle 由 useCallback 稳定，传给 memo(TransferItemView) 不致每次失效。
 */
function areEqual(prev: TransferItemViewProps, next: TransferItemViewProps): boolean {
  if (prev.item !== next.item) return false;
  if (prev.checked !== next.checked) return false;
  if (prev.onToggle !== next.onToggle) return false;
  return true;
}

const TransferItemView = memo(function TransferItemView({
  item,
  checked,
  onToggle,
}: TransferItemViewProps) {
  return (
    <label className="pixel-transfer-item">
      <input
        type="checkbox"
        checked={checked}
        onChange={() => onToggle(item.key)}
      />
      <span>{item.title}</span>
    </label>
  );
}, areEqual);

/**
 * Transfer 穿梭框。在左右两栏间移动数据项，左侧为未选中、右侧为已选中。
 * 关键特性：targetKeys 受控驱动左右分栏；勾选后通过中间按钮单向移动。
 */
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

  // useCallback 稳定引用：函数式更新读取最新 checked，避免引用变化导致 memo 失效
  const toggleLeft = useCallback((key: string) => {
    setLeftChecked((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  }, []);

  const toggleRight = useCallback((key: string) => {
    setRightChecked((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  }, []);

  return (
    <div className={clsx("pixel-transfer", className)} style={style}>
      <div className="pixel-transfer-panel">
        <div className="pixel-transfer-header">{leftItems.length} items</div>
        <div className="pixel-transfer-list">
          {leftItems.map((item) => (
            <TransferItemView
              key={item.key}
              item={item}
              checked={leftChecked.includes(item.key)}
              onToggle={toggleLeft}
            />
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
            <TransferItemView
              key={item.key}
              item={item}
              checked={rightChecked.includes(item.key)}
              onToggle={toggleRight}
            />
          ))}
          {rightItems.length === 0 && (
            <div className="pixel-transfer-empty">Empty</div>
          )}
        </div>
      </div>
    </div>
  );
}
