import { type CSSProperties, type KeyboardEvent, memo, useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import clsx from "clsx";
import "./TreeSelect.css";
import { useLocale, t } from "../LocaleProvider";

export interface TreeSelectNode {
  /** 节点显示文本 */
  title: string;
  /** 节点值 */
  value: string;
  /** 子节点 */
  children?: TreeSelectNode[];
}

export interface TreeSelectProps {
  /** 树形数据 */
  treeData: TreeSelectNode[];
  /** 受控：当前选中值 */
  value?: string;
  /** 选中值变化回调 */
  onChange?: (value: string) => void;
  /** 是否展开（受控） */
  open?: boolean;
  /** 展开状态变化回调 */
  onOpenChange?: (open: boolean) => void;
  /** 占位提示文本 */
  placeholder?: string;
  /** 自定义类名 */
  className?: string;
  /** 自定义内联样式 */
  style?: CSSProperties;
  /** 尺寸，默认 "md" */
  size?: "sm" | "md" | "lg";
  /** 无障碍标签（用于屏幕阅读器关联 label） */
  "aria-label"?: string;
}

interface FlatNode {
  title: string;
  value: string;
  level: number;
}

function flattenTree(nodes: TreeSelectNode[], level = 0): FlatNode[] {
  const result: FlatNode[] = [];
  nodes.forEach((n) => {
    result.push({ title: n.title, value: n.value, level });
    if (n.children) result.push(...flattenTree(n.children, level + 1));
  });
  return result;
}

interface TreeSelectOptionViewProps {
  opt: FlatNode;
  index: number;
  optionId: string;
  selected: boolean;
  highlighted: boolean;
  onHover: (index: number) => void;
  onPick: (value: string) => void;
}

/**
 * memo 比较函数：selected 与 highlighted 均为布尔值，直接比较即可；
 * opt 引用稳定（由 useMemo(flat) 保证），index/onHover/onPick 引用稳定。
 */
function areEqual(prev: TreeSelectOptionViewProps, next: TreeSelectOptionViewProps): boolean {
  if (prev.opt !== next.opt) return false;
  if (prev.index !== next.index) return false;
  if (prev.optionId !== next.optionId) return false;
  if (prev.selected !== next.selected) return false;
  if (prev.highlighted !== next.highlighted) return false;
  if (prev.onHover !== next.onHover) return false;
  if (prev.onPick !== next.onPick) return false;
  return true;
}

const TreeSelectOptionView = memo(function TreeSelectOptionView({
  opt,
  index,
  optionId,
  selected,
  highlighted,
  onHover,
  onPick,
}: TreeSelectOptionViewProps) {
  return (
    <div
      id={optionId}
      role="option"
      aria-selected={selected}
      className={clsx(
        "pixel-treeselect-option",
        selected && "pixel-treeselect-option--selected",
        highlighted && "pixel-treeselect-option--highlighted"
      )}
      style={{ paddingLeft: 10 + opt.level * 16 }}
      onMouseEnter={() => onHover(index)}
      onClick={() => onPick(opt.value)}
    >
      {opt.level > 0 && <span className="pixel-treeselect-indent">└ </span>}
      {opt.title}
    </div>
  );
}, areEqual);

/**
 * TreeSelect 树选择。将树形数据扁平化后以下拉形式展示，支持缩进与键盘导航。
 * 关键特性：箭头键高亮、Enter 选中、Esc 关闭；点击外部自动关闭。
 */
export default function TreeSelect({
  treeData,
  value,
  onChange,
  open,
  onOpenChange,
  placeholder,
  className,
  style,
  size = "md",
  "aria-label": ariaLabel,
}: TreeSelectProps) {
  const { messages } = useLocale();
  const placeholderText = placeholder ?? t("treeselect.placeholder", messages);
  const isControlled = open !== undefined;
  const [internalOpen, setInternalOpen] = useState(false);
  const currentOpen = isControlled ? open : internalOpen;
  // useCallback 稳定引用：供 close/handlePick 复用，避免闭包每次变化导致 memo 失效
  const emitOpenChange = useCallback((next: boolean) => {
    if (!isControlled) setInternalOpen(next);
    onOpenChange?.(next);
  }, [isControlled, onOpenChange]);
  const [highlighted, setHighlighted] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const uid = useId();
  const listboxId = `pixel-treeselect${uid}-listbox`;
  const optionId = (i: number) => `pixel-treeselect${uid}-option-${i}`;

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) emitOpenChange(false);
    };
    if (currentOpen) document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [currentOpen, emitOpenChange]);

  const close = useCallback(() => emitOpenChange(false), [emitOpenChange]);

  // useMemo 稳定 flat 引用：使每个 FlatNode 对象引用在 treeData 不变时保持稳定，
  // 否则每次 render 重新 flatten 会令 memo(TreeSelectOptionView) 全部失效。
  const flat = useMemo(() => flattenTree(treeData), [treeData]);
  const selected = flat.find((f) => f.value === value);

  const openDropdown = useCallback(() => {
    const idx = flat.findIndex((f) => f.value === value);
    setHighlighted(idx >= 0 ? idx : 0);
    emitOpenChange(true);
  }, [flat, value, emitOpenChange]);

  // 稳定引用：onHover 直接复用 useState 的 setter（React 保证稳定）；
  // onPick 仅依赖外部 props，传给 memo(TreeSelectOptionView) 不致每次失效。
  const handlePick = useCallback(
    (nextValue: string) => {
      onChange?.(nextValue);
      emitOpenChange(false);
    },
    [onChange, emitOpenChange]
  );

  const handleKeyDown = (e: KeyboardEvent) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        if (!currentOpen) openDropdown();
        else setHighlighted((h) => (h + 1) % flat.length);
        break;
      case "ArrowUp":
        e.preventDefault();
        if (currentOpen) setHighlighted((h) => (h - 1 + flat.length) % flat.length);
        break;
      case "Enter":
        e.preventDefault();
        if (currentOpen && flat[highlighted]) {
          onChange?.(flat[highlighted].value);
          close();
        } else if (!currentOpen) {
          openDropdown();
        }
        break;
      case "Escape":
        e.preventDefault();
        close();
        break;
      case "Tab":
        close();
        break;
    }
  };

  return (
    <div ref={ref} className={clsx("pixel-treeselect", `pixel-treeselect--${size}`, className)} style={style}>
      <div
        className="pixel-treeselect-trigger"
        role="combobox"
        aria-expanded={currentOpen}
        aria-haspopup="listbox"
        aria-controls={currentOpen ? listboxId : undefined}
        aria-activedescendant={currentOpen && flat[highlighted] ? optionId(highlighted) : undefined}
        aria-label={ariaLabel}
        tabIndex={0}
        onClick={() => (currentOpen ? close() : openDropdown())}
        onKeyDown={handleKeyDown}
      >
        <span className={clsx(!selected && "pixel-treeselect-placeholder")}>
          {selected?.title ?? placeholderText}
        </span>
        <span className="pixel-treeselect-arrow">{currentOpen ? "▴" : "▾"}</span>
      </div>
      {currentOpen && (
        <div id={listboxId} className="pixel-treeselect-dropdown" role="listbox">
          {flat.map((opt, i) => (
            <TreeSelectOptionView
              key={opt.value}
              opt={opt}
              index={i}
              optionId={optionId(i)}
              selected={opt.value === value}
              highlighted={i === highlighted}
              onHover={setHighlighted}
              onPick={handlePick}
            />
          ))}
        </div>
      )}
    </div>
  );
}
