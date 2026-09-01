import { type CSSProperties, forwardRef, memo, useCallback, useState, type ReactNode } from "react";
import clsx from "clsx";
import "./Collapse.css";

interface CollapseItem {
  /** 折叠项唯一标识 */
  key: string;
  /** 折叠项标题 */
  label: ReactNode;
  /** 折叠项展开内容 */
  children: ReactNode;
  /** 是否禁用该项的展开/收起 */
  disabled?: boolean;
}

export interface CollapseProps {
  /** 折叠项列表 */
  items: CollapseItem[];
  /** 受控：当前展开项 key 列表 */
  activeKey?: string[];
  /** 非受控：默认展开项 key 列表 */
  defaultActiveKey?: string[];
  /** 展开项变化回调，参数为最新的展开 key 列表 */
  onChange?: (keys: string[]) => void;
  /** 是否手风琴模式（同一时刻只展开一项），默认 false */
  accordion?: boolean;
  /** 自定义类名 */
  className?: string;
  /** 自定义内联样式 */
  style?: CSSProperties;
}

interface CollapsePanelProps {
  item: CollapseItem;
  activeKeys: string[];
  onToggle: (key: string) => void;
}

/**
 * memo 比较函数：activeKeys 每次 state 变化都是新引用，
 * 因此按内容比较——面板只关心自身 key 是否在 activeKeys 中。
 */
function areEqual(prev: CollapsePanelProps, next: CollapsePanelProps): boolean {
  if (prev.item !== next.item) return false;
  if (prev.onToggle !== next.onToggle) return false;
  // 当前面板是否展开
  const prevActive = prev.activeKeys.includes(prev.item.key);
  const nextActive = next.activeKeys.includes(next.item.key);
  if (prevActive !== nextActive) return false;
  return true;
}

const CollapsePanel = memo(function CollapsePanel({
  item,
  activeKeys,
  onToggle,
}: CollapsePanelProps) {
  const isActive = activeKeys.includes(item.key);

  return (
    <div
      className={clsx(
        "pixel-collapse-item",
        isActive && "pixel-collapse-item--active"
      )}
    >
      <div className="pixel-collapse-header" onClick={() => onToggle(item.key)}>
        <span className="pixel-collapse-arrow">
          {isActive ? "▾" : "▸"}
        </span>
        <span>{item.label}</span>
      </div>
      {isActive && (
        <div className="pixel-collapse-body">{item.children}</div>
      )}
    </div>
  );
}, areEqual);

/**
 * Collapse 折叠面板。点击标题切换展开/收起，支持手风琴模式。
 * 关键特性：支持受控 activeKey / 非受控 defaultActiveKey；手风琴模式下仅保留一个展开项。
 */
const Collapse = forwardRef<HTMLDivElement, CollapseProps>(function Collapse({
  items,
  activeKey,
  defaultActiveKey = [],
  onChange,
  accordion = false,
  className,
  style,
}, ref) {
  const isControlled = activeKey !== undefined;
  const [internalActive, setInternalActive] = useState<string[]>(defaultActiveKey);
  const currentActive = isControlled ? activeKey : internalActive;

  // useCallback 稳定引用：函数式更新读取最新 activeKeys，
  // 避免 activeKeys 进入依赖导致引用变化、memo 失效。
  const toggle = useCallback(
    (key: string) => {
      setInternalActive((prev) => {
        if (accordion) {
          const next = prev.includes(key) ? [] : [key];
          if (!isControlled) setInternalActive(next);
          onChange?.(next);
          return next;
        }
        const next = prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key];
        if (!isControlled) setInternalActive(next);
        onChange?.(next);
        return next;
      });
    },
    [accordion, isControlled, onChange]
  );

  return (
    <div ref={ref} className={clsx("pixel-collapse", className)} style={style}>
      {items.map((item) => (
        <CollapsePanel
          key={item.key}
          item={item}
          activeKeys={currentActive}
          onToggle={toggle}
        />
      ))}
    </div>
  );
});

export default Collapse;
