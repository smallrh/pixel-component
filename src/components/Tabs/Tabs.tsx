import { type CSSProperties, type KeyboardEvent, forwardRef, memo, useCallback, useId, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import clsx from "clsx";
import "./Tabs.css";

interface TabItem {
  /** 选项唯一标识 */
  key: string;
  /** 选项标签 */
  label: ReactNode;
  /** 是否禁用 */
  disabled?: boolean;
  /** 选项面板内容 */
  children?: ReactNode;
}

export interface TabsProps {
  /** 选项列表 */
  items: TabItem[];
  /** 受控激活项 key（优先级高于 defaultActiveKey） */
  activeKey?: string;
  /** 初始激活项 key（非受控），默认取首项 */
  defaultActiveKey?: string;
  /** 自定义类名 */
  className?: string;
  /** 自定义内联样式 */
  style?: CSSProperties;
  /** 尺寸，默认 "md" */
  size?: "sm" | "md" | "lg";
  /** 切换回调 */
  onChange?: (key: string) => void;
}

interface TabProps {
  item: TabItem;
  activeKey: string;
  tabId: string;
  panelId: string;
  onSelect: (key: string, disabled?: boolean) => void;
}

/**
 * memo 比较函数：对 item 做浅层关键字段比较（避免 Storybook Docs 模式下
 * items 数组引用每次渲染变化导致 memo 完全失效）。
 * onSelect/tabId/panelId 使用引用比较（handleSelect 已用 ref 保持稳定引用）。
 */
function areEqual(prev: TabProps, next: TabProps): boolean {
  if (prev.onSelect !== next.onSelect) return false;
  if (prev.tabId !== next.tabId) return false;
  if (prev.panelId !== next.panelId) return false;
  // item 关键字段浅比较
  const pi = prev.item;
  const ni = next.item;
  if (pi.key !== ni.key) return false;
  if (pi.disabled !== ni.disabled) return false;
  // label 为 ReactNode：引用变化视为变化（Storybook 正常情况下不会频繁改变 label）
  if (pi.label !== ni.label) return false;
  if (pi.children !== ni.children) return false;
  // 当前 tab 是否激活
  const prevActive = prev.activeKey === pi.key;
  const nextActive = next.activeKey === ni.key;
  if (prevActive !== nextActive) return false;
  return true;
}

const Tab = memo(function Tab({ item, activeKey, tabId, panelId, onSelect }: TabProps) {
  return (
    <button
      type="button"
      id={tabId}
      className={clsx(
        "pixel-tabs-tab",
        activeKey === item.key && "pixel-tabs-tab--active",
        item.disabled && "pixel-tabs-tab--disabled"
      )}
      disabled={item.disabled}
      onClick={() => onSelect(item.key, item.disabled)}
      role="tab"
      aria-selected={activeKey === item.key}
      aria-controls={panelId}
      data-key={item.key}
    >
      {item.label}
    </button>
  );
}, areEqual);

/**
 * Tabs。标签页容器，渲染选项条与对应面板，支持禁用项与切换回调，激活态支持受控(activeKey)与非受控(defaultActiveKey)。
 */
const Tabs = forwardRef<HTMLDivElement, TabsProps>(function Tabs({
  items,
  activeKey: controlledActiveKey,
  defaultActiveKey,
  className,
  style,
  size = "md",
  onChange,
}, ref) {
  const isControlled = controlledActiveKey !== undefined;
  const [internalActiveKey, setInternalActiveKey] = useState(
    defaultActiveKey ?? items.find((i) => i.key === defaultActiveKey)?.key ?? items[0]?.key ?? ""
  );
  // 受控模式下以外部 activeKey 为准，未传则使用内部 state 管理
  const activeKey = controlledActiveKey ?? internalActiveKey;

  // 当 items 数组“真正变化”时（key 集合不同），同步内部激活态。
  // 使用 ref 缓存上次的 key 签名（"k1|k2|k3"），避免 Storybook 中 items 引用每次不同导致误触发。
  const lastKeysSigRef = useRef("");
  useLayoutEffect(() => {
    if (isControlled) return;
    if (items.length === 0) return;
    const sig = items.map((item) => item.key).join("|");
    if (sig === lastKeysSigRef.current) return;
    lastKeysSigRef.current = sig;
    // 当前激活的 key 若不再存在，则回退
    const keys = items.map((i) => i.key);
    if (!keys.includes(internalActiveKey)) {
      setInternalActiveKey(defaultActiveKey ?? keys[0]);
    }
  }, [items, isControlled, defaultActiveKey]); // 故意不依赖 internalActiveKey

  const uid = useId();
  const tabId = (key: string) => `pixel-tabs${uid}-tab-${key}`;
  const panelId = (key: string) => `pixel-tabs${uid}-panel-${key}`;

  // 用 ref 持有最新的 activeKey / isControlled / onChange，使 handleSelect 无需把它们列入依赖，
  // 从而保持引用永久稳定，避免 memo(Tab) 因 onSelect 引用变化而每次失效重渲染（Cascader 同模式）
  const latestRef = useRef({ activeKey, isControlled, onChange, internalActiveKey });
  latestRef.current = { activeKey, isControlled, onChange, internalActiveKey };

  // useCallback 稳定引用（依赖数组为空）：保证 memo(Tab) 的 areEqual 中 onSelect 比较一致
  const handleSelect = useCallback(
    (key: string, disabled?: boolean) => {
      const { activeKey: curActive, isControlled: curControlled, onChange: curOnChange } = latestRef.current;
      if (disabled) return;
      // 目标值与当前一致：避免无意义的 re-render / onChange 回调，
      // 同时防止外层 onChange → 重渲染 → 引用变化 → 状态回写震荡（经验 732077）
      if (key === curActive) return;
      if (!curControlled) {
        setInternalActiveKey(key);
      }
      curOnChange?.(key);
    },
    []
  );

  const activeItem = items.find((item) => item.key === activeKey);

  // 键盘交互（ARIA APG tabs，automatic activation）：
  // ArrowLeft/Right 在可聚焦 tab 间移动焦点并自动激活目标 tab；Tab 键保持原生顺序。
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.getAttribute("role") !== "tab") return;
    let dir = 0;
    if (e.key === "ArrowRight") dir = 1;
    else if (e.key === "ArrowLeft") dir = -1;
    else return;
    e.preventDefault();
    const tabs = Array.from(
      (e.currentTarget as HTMLElement).querySelectorAll<HTMLButtonElement>(
        '[role="tab"]:not([disabled])'
      )
    );
    const currentIndex = tabs.indexOf(target as HTMLButtonElement);
    if (currentIndex === -1) return;
    const nextIndex = (currentIndex + dir + tabs.length) % tabs.length;
    const nextTab = tabs[nextIndex];
    nextTab.focus();
    const key = nextTab.dataset.key;
    if (key) handleSelect(key);
  };

  return (
    <div ref={ref} className={clsx("pixel-tabs", `pixel-tabs--${size}`, className)} style={style}>
      <div className="pixel-tabs-bar" onKeyDown={handleKeyDown} role="tablist">
        {items.map((item) => (
          <Tab
            key={item.key}
            item={item}
            activeKey={activeKey}
            tabId={tabId(item.key)}
            panelId={panelId(item.key)}
            onSelect={handleSelect}
          />
        ))}
        <span className="pixel-tabs-indicator" />
      </div>
      {activeItem && (
        <div
          id={panelId(activeItem.key)}
          className="pixel-tabs-content"
          role="tabpanel"
          aria-labelledby={tabId(activeItem.key)}
        >
          {activeItem.children}
        </div>
      )}
    </div>
  );
});

export default Tabs;
