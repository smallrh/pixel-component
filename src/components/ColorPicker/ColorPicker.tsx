import { type CSSProperties, useState, useRef, useEffect, forwardRef, useCallback } from "react";
import clsx from "clsx";
import "./ColorPicker.css";
import { mergeRefs } from "../../utils/mergeRefs";

export interface ColorPickerProps {
  /** 当前色值（受控），默认 "#000000" */
  value?: string;
  /** 选色回调，返回所选颜色字符串 */
  onChange?: (color: string) => void;
  /** 自定义类名 */
  className?: string;
  /** 自定义内联样式 */
  style?: CSSProperties;
  /** 无障碍标签（用于屏幕阅读器关联 label） */
  "aria-label"?: string;
}

const DEFAULT_COLORS = [
  "#000000", "#ffffff", "#ff0000", "#00ff00", "#0000ff",
  "#ffff00", "#ff00ff", "#00ffff", "#c0c0c0", "#808080",
  "#800000", "#808000", "#008000", "#800080", "#008080",
  "#000080",
];

/**
 * ColorPicker。颜色选择器，点击色块弹出预设调色板，点击外部自动收起。
 *
 * 说明：当前实现并非任务描述所设想的「原生 input[type=color]」，
 * 而是基于自定义色块 + 预设调色板。原生 input[type=color] 已自带完整键盘可访问性
 * （Enter/Space 唤起系统取色器、Arrow 无意义、Tab 焦点切换）。
 * 由于本实现不走原生控件，需要手动补全以下交互：
 *   - 触发色块（swatch）：role=button + tabIndex=0，Enter/Space/ArrowDown 唤起调色板
 *   - 调色板容器：role=listbox
 *   - 预设色：role=option + roving tabindex，ArrowUp/Down/Left/Right/Home/End 移动焦点，Enter/Space 选定
 *   - Escape：关闭调色板并把焦点交回触发色块
 */
const ColorPicker = forwardRef<HTMLDivElement, ColorPickerProps>(function ColorPicker({
  value = "#000000",
  onChange,
  className,
  style,
  "aria-label": ariaLabel,
}, ref) {
  const [open, setOpen] = useState(false);
  // 调色板内当前焦点色块的索引（roving tabindex）
  const [focusedIndex, setFocusedIndex] = useState<number>(() => {
    const i = DEFAULT_COLORS.indexOf(value);
    return i === -1 ? 0 : i;
  });
  const rootRef = useRef<HTMLDivElement>(null);
  const swatchRef = useRef<HTMLDivElement>(null);
  const colorRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  // render 后真正 focus 目标色块，避免 render 期间 focus 副作用
  const pendingFocusRef = useRef<number | "swatch" | null>(null);

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    if (open) document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [open]);

  useEffect(() => {
    if (pendingFocusRef.current === null) return;
    const target = pendingFocusRef.current;
    pendingFocusRef.current = null;
    if (target === "swatch") {
      swatchRef.current?.focus();
    } else {
      colorRefs.current.get(target)?.focus();
    }
  });

  const focusSwatch = useCallback(() => {
    pendingFocusRef.current = "swatch";
  }, []);

  const focusColor = useCallback((index: number) => {
    pendingFocusRef.current = index;
    setFocusedIndex(index);
  }, []);

  const handleSwatchKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case "Enter":
      case " ":
      case "ArrowDown":
      case "ArrowRight":
        e.preventDefault();
        setOpen(true);
        // 焦点交到当前选中色块（或第一块）
        focusColor(focusedIndex);
        break;
      default:
        break;
    }
  };

  const handleColorKeyDown = (e: React.KeyboardEvent, index: number) => {
    const last = DEFAULT_COLORS.length - 1;
    switch (e.key) {
      case "ArrowRight":
      case "ArrowDown":
        e.preventDefault();
        focusColor(index === last ? 0 : index + 1);
        break;
      case "ArrowLeft":
      case "ArrowUp":
        e.preventDefault();
        focusColor(index === 0 ? last : index - 1);
        break;
      case "Home":
        e.preventDefault();
        focusColor(0);
        break;
      case "End":
        e.preventDefault();
        focusColor(last);
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        onChange?.(DEFAULT_COLORS[index]);
        setOpen(false);
        focusSwatch();
        break;
      case "Escape":
        e.preventDefault();
        setOpen(false);
        focusSwatch();
        break;
      default:
        break;
    }
  };

  return (
    <div ref={mergeRefs(ref, rootRef)} className={clsx("pixel-colorpicker", className)} style={style}>
      <div
        ref={swatchRef}
        className="pixel-colorpicker-swatch"
        style={{ background: value }}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={handleSwatchKeyDown}
        role="button"
        tabIndex={0}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel ?? `Selected color ${value}. Activate to open color palette.`}
      />
      {open && (
        <div className="pixel-colorpicker-popup" role="listbox" aria-label="Color palette">
          {DEFAULT_COLORS.map((c, i) => (
            <div
              key={c}
              ref={(el) => {
                if (el) colorRefs.current.set(i, el);
                else colorRefs.current.delete(i);
              }}
              className={clsx(
                "pixel-colorpicker-color",
                c === value && "pixel-colorpicker-color--selected"
              )}
              style={{ background: c }}
              onClick={() => {
                onChange?.(c);
                setOpen(false);
                focusSwatch();
              }}
              onKeyDown={(e) => handleColorKeyDown(e, i)}
              role="option"
              tabIndex={i === focusedIndex ? 0 : -1}
              aria-selected={c === value}
              aria-label={`Color ${c}`}
            />
          ))}
        </div>
      )}
    </div>
  );
});

export default ColorPicker;
