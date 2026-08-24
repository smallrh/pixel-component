import { type CSSProperties, type KeyboardEvent, useId, useState, useRef, useEffect } from "react";
import clsx from "clsx";
import "./AutoComplete.css";

export interface AutoCompleteProps {
  /** 候选项字符串数组 */
  options: string[];
  /** 受控：当前输入值 */
  value?: string;
  /** 输入或选中项变化回调 */
  onChange?: (value: string) => void;
  /** 占位提示文本，默认 "Search..." */
  placeholder?: string;
  /** 是否展开（受控） */
  open?: boolean;
  /** 展开状态变化回调 */
  onOpenChange?: (open: boolean) => void;
  /** 自定义类名 */
  className?: string;
  /** 自定义内联样式 */
  style?: CSSProperties;
}

/**
 * AutoComplete 自动补全。根据输入内容过滤候选项并下拉展示，支持受控 value 同步。
 * 关键特性：大小写不敏感过滤；点击选项回填并关闭；外部 value 变化时自动同步内部输入；
 * 键盘箭头键高亮、Enter 选中、Esc 关闭。
 */
export default function AutoComplete({
  options,
  value = "",
  onChange,
  placeholder = "Search...",
  open,
  onOpenChange,
  className,
  style,
}: AutoCompleteProps) {
  const [input, setInput] = useState(value);
  const isControlled = open !== undefined;
  const [internalOpen, setInternalOpen] = useState(false);
  const currentOpen = isControlled ? open : internalOpen;
  const emitOpenChange = (next: boolean) => {
    if (!isControlled) setInternalOpen(next);
    onOpenChange?.(next);
  };
  const [highlighted, setHighlighted] = useState(-1);
  const ref = useRef<HTMLDivElement>(null);
  const uid = useId();
  const listboxId = `pixel-autocomplete${uid}-listbox`;
  const optionId = (i: number) => `pixel-autocomplete${uid}-option-${i}`;

  // 外部受控 value 变化时同步内部 input（渲染期间调整，React 官方推荐模式）
  const [prevValue, setPrevValue] = useState(value);
  if (prevValue !== value) {
    setPrevValue(value);
    setInput(value);
  }

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) emitOpenChange(false);
    };
    if (currentOpen) document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [currentOpen]);

  const filtered = options.filter((o) =>
    o.toLowerCase().includes(input.toLowerCase())
  );

  // 过滤结果变化时，把高亮项钳制到有效范围内（-1 表示无高亮）
  const safeHighlight = filtered.length === 0 ? -1 : Math.min(highlighted, filtered.length - 1);

  const pickOption = (opt: string) => {
    setInput(opt);
    onChange?.(opt);
    emitOpenChange(false);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!currentOpen && (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "Enter")) {
      emitOpenChange(true);
      setHighlighted(filtered.length > 0 ? 0 : -1);
      return;
    }
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        if (filtered.length > 0) {
          setHighlighted((h) => (h + 1) % filtered.length);
        }
        break;
      case "ArrowUp":
        e.preventDefault();
        if (filtered.length > 0) {
          setHighlighted((h) => (h - 1 + filtered.length) % filtered.length);
        }
        break;
      case "Enter":
        if (currentOpen && filtered[safeHighlight]) {
          e.preventDefault();
          pickOption(filtered[safeHighlight]);
        }
        break;
      case "Escape":
        e.preventDefault();
        emitOpenChange(false);
        break;
      case "Tab":
        emitOpenChange(false);
        break;
    }
  };

  return (
    <div ref={ref} className={clsx("pixel-autocomplete", className)} style={style}>
      <input
        className="pixel-autocomplete-input"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={currentOpen && filtered.length > 0}
        aria-controls={currentOpen && filtered.length > 0 ? listboxId : undefined}
        aria-activedescendant={currentOpen && filtered[safeHighlight] ? optionId(safeHighlight) : undefined}
        aria-autocomplete="list"
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
          setHighlighted(0);
          emitOpenChange(true);
          onChange?.(e.target.value);
        }}
        onFocus={() => {
          emitOpenChange(true);
          setHighlighted(filtered.length > 0 ? 0 : -1);
        }}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
      />
      {currentOpen && filtered.length > 0 && (
        <div id={listboxId} className="pixel-autocomplete-dropdown" role="listbox">
          {filtered.map((opt, i) => (
            <div
              key={opt}
              id={optionId(i)}
              role="option"
              aria-selected={opt === input}
              className={clsx(
                "pixel-autocomplete-option",
                i === safeHighlight && "pixel-autocomplete-option--highlighted"
              )}
              onMouseEnter={() => setHighlighted(i)}
              onClick={() => pickOption(opt)}
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
