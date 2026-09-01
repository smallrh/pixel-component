import { type CSSProperties, type KeyboardEvent, memo, useCallback, useEffect, useId, useRef, useState } from "react";
import clsx from "clsx";
import "./Cascader.css";
import { useLocale, t } from "../LocaleProvider";

export interface CascaderOption {
  /** 节点展示文本 */
  label: string;
  /** 节点值（路径上的唯一标识） */
  value: string;
  /** 子级选项（存在则可继续展开下一列） */
  children?: CascaderOption[];
}

export interface CascaderProps {
  /** 级联选项树 */
  options: CascaderOption[];
  /** 当前选中路径（受控，由每列选中 value 组成的数组） */
  value?: string[];
  /** 非受控：初始选中路径 */
  defaultValue?: string[];
  /** 选中叶子节点时回调，回传 value 路径与 label 路径 */
  onChange?: (value: string[], labels: string[]) => void;
  /** 是否禁用 */
  disabled?: boolean;
  /** 是否展开（受控） */
  open?: boolean;
  /** 展开状态变化回调 */
  onOpenChange?: (open: boolean) => void;
  /** 未选中时的占位文本，默认取 LocaleProvider 的 cascader.placeholder */
  placeholder?: string;
  /** 附加的样式类名 */
  className?: string;
  /** 行内样式 */
  style?: CSSProperties;
  /** 尺寸，默认 "md" */
  size?: "sm" | "md" | "lg";
  /** 无障碍标签（用于屏幕阅读器关联 label） */
  "aria-label"?: string;
}

/** 根据当前路径（每列选中的 value）计算各列要展示的选项 */
function buildColumns(options: CascaderOption[], path: string[]): CascaderOption[][] {
  const columns: CascaderOption[][] = [options];
  let current = options;
  for (const v of path) {
    const node = current.find((o) => o.value === v);
    if (!node?.children || node.children.length === 0) break;
    columns.push(node.children);
    current = node.children;
  }
  return columns;
}

/** 从选项树中根据 value 路径收集 label 路径 */
function collectLabels(options: CascaderOption[], path: string[]): string[] {
  const labels: string[] = [];
  let current = options;
  for (const v of path) {
    const node = current.find((o) => o.value === v);
    if (!node) break;
    labels.push(node.label);
    current = node.children ?? [];
  }
  return labels;
}

interface CascaderOptionViewProps {
  option: CascaderOption;
  colIndex: number;
  optionId: string;
  activeValue?: string;
  onSelect: (node: CascaderOption, columnIndex: number) => void;
}

/**
 * memo 比较函数：activeValue 为字符串，选项只关心自身是否为该列选中项，
 * 因此比较 activeValue 是否等于当前 option.value 即可。
 */
function areEqual(prev: CascaderOptionViewProps, next: CascaderOptionViewProps): boolean {
  if (prev.option !== next.option) return false;
  if (prev.colIndex !== next.colIndex) return false;
  if (prev.optionId !== next.optionId) return false;
  if (prev.onSelect !== next.onSelect) return false;
  // 当前选项是否为该列选中项
  const prevActive = prev.activeValue === prev.option.value;
  const nextActive = next.activeValue === next.option.value;
  if (prevActive !== nextActive) return false;
  return true;
}

const CascaderOptionView = memo(function CascaderOptionView({
  option,
  colIndex,
  optionId,
  activeValue,
  onSelect,
}: CascaderOptionViewProps) {
  const isActive = activeValue === option.value;
  const hasChildren = !!option.children && option.children.length > 0;
  return (
    <div
      id={optionId}
      role="option"
      aria-selected={isActive}
      className={clsx(
        "pixel-cascader-option",
        isActive && "pixel-cascader-option--active"
      )}
      onClick={() => onSelect(option, colIndex)}
    >
      <span>{option.label}</span>
      {hasChildren && <span className="pixel-cascader-caret">›</span>}
    </div>
  );
}, areEqual);

/**
 * Cascader 级联选择器。点击触发器展开多列下拉，逐列选中直至叶子节点提交路径，
 * 支持受控/非受控 value、外部点击关闭、占位文案国际化。
 */
export default function Cascader({
  options,
  value,
  defaultValue,
  onChange,
  disabled = false,
  open,
  onOpenChange,
  placeholder,
  className,
  style,
  size = "md",
  "aria-label": ariaLabel,
}: CascaderProps) {
  const { messages } = useLocale();
  const placeholderText = placeholder ?? t("cascader.placeholder", messages);

  // 受控/非受控展开状态
  const isOpenControlled = open !== undefined;
  const [internalOpen, setInternalOpen] = useState(false);
  const currentOpen = isOpenControlled ? open : internalOpen;

  // 受控/非受控选中路径
  const isValueControlled = value !== undefined;
  const [internalPath, setInternalPath] = useState<string[]>(defaultValue ?? []);
  const currentValue = isValueControlled ? value : internalPath;

  // useCallback 稳定引用：供 useEffect 与 selectNode 复用，避免闭包每次变化导致 memo 失效
  const emitOpenChange = useCallback((next: boolean) => {
    if (disabled) return;
    if (!isOpenControlled) setInternalOpen(next);
    onOpenChange?.(next);
  }, [disabled, isOpenControlled, onOpenChange]);

  const emitValueChange = useCallback(
    (nextPath: string[], nextLabels: string[]) => {
      if (!isValueControlled) setInternalPath(nextPath);
      onChange?.(nextPath, nextLabels);
    },
    [isValueControlled, onChange]
  );

  // 内部展开路径（与 currentValue 同步，用于构建多列）
  const [path, setPath] = useState<string[]>(currentValue);

  // 外部受控 value 变化时同步内部路径（渲染期间调整，React 官方推荐模式）
  const [prevValue, setPrevValue] = useState(currentValue);
  if (currentValue !== prevValue) {
    setPrevValue(currentValue);
    setPath(currentValue);
  }

  // 用 ref 持有最新 path，使 selectNode 不必把 path 列入依赖，从而保持引用稳定
  const pathRef = useRef(path);
  pathRef.current = path;

  const ref = useRef<HTMLDivElement>(null);
  // 键盘焦点单元格 {col, row}；为 null 表示尚未通过键盘导航定位
  const [activeCell, setActiveCell] = useState<{ col: number; row: number } | null>(null);
  const uid = useId();
  const listboxId = `pixel-cascader${uid}-listbox`;
  const optionId = (colIndex: number, i: number) =>
    `pixel-cascader${uid}-option-${colIndex}-${i}`;

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) emitOpenChange(false);
    };
    if (currentOpen) document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [currentOpen, emitOpenChange]);

  // 关闭下拉时清空键盘焦点，避免下次打开残留旧位置
  useEffect(() => {
    if (!currentOpen) setActiveCell(null);
  }, [currentOpen]);

  const columns = buildColumns(options, path);

  // aria-activedescendant 关联：键盘焦点优先；无键盘焦点时回退到当前展开路径最深一列的选中项
  let activeOptionId: string | undefined;
  if (activeCell) {
    activeOptionId = optionId(activeCell.col, activeCell.row);
  } else if (currentOpen && path.length > 0) {
    const c = path.length - 1;
    const col = columns[c];
    if (col) {
      const idx = col.findIndex((o) => o.value === path[c]);
      if (idx >= 0) activeOptionId = optionId(c, idx);
    }
  }

  // selectNode 引用稳定（仅依赖外部 props），传给 memo(CascaderOptionView) 不致每次失效
  const selectNode = useCallback(
    (node: CascaderOption, columnIndex: number) => {
      if (disabled) return;
      const nextPath = [...pathRef.current.slice(0, columnIndex), node.value];
      if (node.children && node.children.length > 0) {
        // 有子级：仅展开下一列，不提交
        setPath(nextPath);
      } else {
        // 叶子节点：提交完整路径
        const fullLabels = collectLabels(options, nextPath);
        emitValueChange(nextPath, fullLabels);
        setPath(nextPath);
        emitOpenChange(false);
      }
    },
    [disabled, options, emitValueChange, emitOpenChange]
  );

  // 键盘交互（ARIA APG combobox 模式）：
  // ArrowDown/Up 打开或当前列内移动；ArrowRight 展开子级并进入下一列；ArrowLeft 回到上一列；
  // Enter 选择当前高亮项；Escape 关闭下拉。
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;
    switch (e.key) {
      case "ArrowDown": {
        e.preventDefault();
        if (!currentOpen) {
          emitOpenChange(true);
          setActiveCell({ col: 0, row: 0 });
          return;
        }
        setActiveCell((prev) => {
          const col = prev?.col ?? Math.max(0, columns.length - 1);
          const colItems = columns[col] ?? [];
          if (colItems.length === 0) return prev;
          const row = prev ? Math.min(prev.row + 1, colItems.length - 1) : 0;
          return { col, row };
        });
        break;
      }
      case "ArrowUp": {
        e.preventDefault();
        if (!currentOpen) {
          emitOpenChange(true);
          const firstCol = columns[0] ?? [];
          setActiveCell({ col: 0, row: Math.max(0, firstCol.length - 1) });
          return;
        }
        setActiveCell((prev) => {
          const col = prev?.col ?? Math.max(0, columns.length - 1);
          const colItems = columns[col] ?? [];
          if (colItems.length === 0) return prev;
          const row = prev ? Math.max(prev.row - 1, 0) : colItems.length - 1;
          return { col, row };
        });
        break;
      }
      case "ArrowRight": {
        e.preventDefault();
        if (!activeCell) return;
        const colItems = columns[activeCell.col] ?? [];
        const node = colItems[activeCell.row];
        if (node?.children && node.children.length > 0) {
          selectNode(node, activeCell.col);
          setActiveCell({ col: activeCell.col + 1, row: 0 });
        }
        break;
      }
      case "ArrowLeft": {
        e.preventDefault();
        if (!activeCell || activeCell.col === 0) return;
        setActiveCell({ col: activeCell.col - 1, row: 0 });
        break;
      }
      case "Enter": {
        e.preventDefault();
        if (!currentOpen || !activeCell) return;
        const colItems = columns[activeCell.col] ?? [];
        const node = colItems[activeCell.row];
        if (node) selectNode(node, activeCell.col);
        break;
      }
      case "Escape": {
        e.preventDefault();
        emitOpenChange(false);
        break;
      }
    }
  };

  return (
    <div
      ref={ref}
      className={clsx(
        "pixel-cascader",
        `pixel-cascader--${size}`,
        disabled && "pixel-cascader--disabled",
        className
      )}
      style={style}
    >
      <div
        className="pixel-cascader-trigger"
        onClick={() => emitOpenChange(!currentOpen)}
        onKeyDown={handleKeyDown}
        tabIndex={disabled ? -1 : 0}
        role="combobox"
        aria-expanded={currentOpen}
        aria-haspopup="listbox"
        aria-controls={currentOpen ? listboxId : undefined}
        aria-activedescendant={activeOptionId}
        aria-label={ariaLabel}
        aria-disabled={disabled}
      >
        <span className={clsx(currentValue.length === 0 && "pixel-cascader-placeholder")}>
          {currentValue.length > 0 ? collectLabels(options, currentValue).join(" / ") : placeholderText}
        </span>
        <span className="pixel-cascader-arrow">{currentOpen ? "▴" : "▾"}</span>
      </div>
      {currentOpen && (
        <div id={listboxId} className="pixel-cascader-dropdown" role="listbox">
          {columns.map((col, colIndex) => (
            <div key={colIndex} className="pixel-cascader-column">
              {col.map((opt, i) => (
                <CascaderOptionView
                  key={opt.value}
                  option={opt}
                  colIndex={colIndex}
                  optionId={optionId(colIndex, i)}
                  activeValue={path[colIndex]}
                  onSelect={selectNode}
                />
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
