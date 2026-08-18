import { type CSSProperties, useState, useRef, useEffect, useCallback } from "react";
import clsx from "clsx";
import "./Cascader.css";

export interface CascaderOption {
  label: string;
  value: string;
  children?: CascaderOption[];
}

export interface CascaderProps {
  options: CascaderOption[];
  value?: string[];
  onChange?: (value: string[], labels: string[]) => void;
  placeholder?: string;
  className?: string;
  style?: CSSProperties;
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

export default function Cascader({
  options,
  value,
  onChange,
  placeholder = "Select...",
  className,
  style,
}: CascaderProps) {
  const [open, setOpen] = useState(false);
  const [path, setPath] = useState<string[]>(value ?? []); // 当前展开路径（每列选中项）
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    if (open) document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [open]);

  // 外部受控 value 变化时同步内部路径（渲染期间调整，React 官方推荐模式）
  // 注意：value 通常由父组件受控传入；此处用引用比较，undefined 稳定为 []
  const [prevValue, setPrevValue] = useState(value);
  if (value !== prevValue) {
    setPrevValue(value);
    setPath(value ?? []);
  }

  const columns = buildColumns(options, path);

  const selectNode = useCallback(
    (node: CascaderOption, columnIndex: number) => {
      const nextPath = [...path.slice(0, columnIndex), node.value];
      if (node.children && node.children.length > 0) {
        // 有子级：仅展开下一列，不提交
        setPath(nextPath);
      } else {
        // 叶子节点：提交完整路径
        const fullLabels = collectLabels(options, nextPath);
        onChange?.(nextPath, fullLabels);
        setPath(nextPath);
        setOpen(false);
      }
    },
    [path, options, onChange]
  );

  return (
    <div ref={ref} className={clsx("pixel-cascader", className)} style={style}>
      <div
        className="pixel-cascader-trigger"
        onClick={() => setOpen((v) => !v)}
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <span className={clsx((value?.length ?? 0) === 0 && "pixel-cascader-placeholder")}>
          {value && value.length > 0 ? collectLabels(options, value).join(" / ") : placeholder}
        </span>
        <span className="pixel-cascader-arrow">{open ? "▴" : "▾"}</span>
      </div>
      {open && (
        <div className="pixel-cascader-dropdown" role="listbox">
          {columns.map((col, colIndex) => (
            <div key={colIndex} className="pixel-cascader-column">
              {col.map((opt) => {
                const isActive = path[colIndex] === opt.value;
                const hasChildren = !!opt.children && opt.children.length > 0;
                return (
                  <div
                    key={opt.value}
                    role="option"
                    aria-selected={isActive}
                    className={clsx(
                      "pixel-cascader-option",
                      isActive && "pixel-cascader-option--active"
                    )}
                    onClick={() => selectNode(opt, colIndex)}
                  >
                    <span>{opt.label}</span>
                    {hasChildren && <span className="pixel-cascader-caret">›</span>}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
