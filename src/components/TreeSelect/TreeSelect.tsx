import { useState, useRef, useEffect } from "react";
import clsx from "clsx";
import "./TreeSelect.css";

interface TreeNode {
  title: string;
  value: string;
  children?: TreeNode[];
}

interface TreeSelectProps {
  treeData: TreeNode[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  style?: React.CSSProperties;
}

interface FlatNode {
  title: string;
  value: string;
  level: number;
}

function flattenTree(nodes: TreeNode[], level = 0): FlatNode[] {
  const result: FlatNode[] = [];
  nodes.forEach((n) => {
    result.push({ title: n.title, value: n.value, level });
    if (n.children) result.push(...flattenTree(n.children, level + 1));
  });
  return result;
}

export default function TreeSelect({
  treeData,
  value,
  onChange,
  placeholder = "Select...",
  className,
  style,
}: TreeSelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    if (open) document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [open]);

  const flat = flattenTree(treeData);
  const selected = flat.find((f) => f.value === value);

  return (
    <div ref={ref} className={clsx("pixel-treeselect", className)} style={style}>
      <div className="pixel-treeselect-trigger" onClick={() => setOpen((v) => !v)}>
        <span className={clsx(!selected && "pixel-treeselect-placeholder")}>
          {selected?.title ?? placeholder}
        </span>
        <span className="pixel-treeselect-arrow">{open ? "▴" : "▾"}</span>
      </div>
      {open && (
        <div className="pixel-treeselect-dropdown">
          {flat.map((opt) => (
            <div
              key={opt.value}
              className={clsx(
                "pixel-treeselect-option",
                opt.value === value && "pixel-treeselect-option--selected"
              )}
              style={{ paddingLeft: 10 + opt.level * 16 }}
              onClick={() => {
                onChange?.(opt.value);
                setOpen(false);
              }}
            >
              {opt.level > 0 && <span className="pixel-treeselect-indent">└ </span>}
              {opt.title}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}