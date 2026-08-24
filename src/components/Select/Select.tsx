import { type CSSProperties, type KeyboardEvent, type Ref, useId, useState, useRef, useEffect, useCallback } from "react";
import clsx from "clsx";
import "./Select.css";
import { usePopupPosition, popupStyle, renderPopup } from "../../utils/popup";
import { mergeRefs } from "../../utils/mergeRefs";
import { useLocale, t } from "../LocaleProvider";

export interface SelectOption<T = string> {
  /** 选项显示文本 */
  label: string;
  /** 选项值（泛型 T，默认 string） */
  value: T;
}

export interface SelectProps<T = string> {
  /** 选项列表 */
  options: SelectOption<T>[];
  /** 当前选中值（受控） */
  value?: T;
  /** 非受控：默认选中值 */
  defaultValue?: T;
  /** 选中变化回调，参数为最新的选中值 */
  onChange?: (value: T) => void;
  /** 是否展开（受控） */
  open?: boolean;
  /** 展开状态变化回调 */
  onOpenChange?: (open: boolean) => void;
  /** 占位提示文案 */
  placeholder?: string;
  /** 是否禁用 */
  disabled?: boolean;
  /** 显示清除按钮 */
  allowClear?: boolean;
  /** 自定义类名 */
  className?: string;
  /** 自定义内联样式 */
  style?: CSSProperties;
  /** 尺寸，默认 "md" */
  size?: "sm" | "md" | "lg";
  /** 无障碍标签（用于屏幕阅读器关联 label） */
  "aria-label"?: string;
  /** React 19 ref-as-prop：指向最外层 div */
  ref?: Ref<HTMLDivElement>;
}

/**
 * 选择器。泛型 T 默认 string，可指定为 number 等：
 * ```ts
 * <Select<number> options={[{ label: "A", value: 1 }]} onChange={(v) => v.toFixed()} />
 * ```
 */
function Select<T = string>({
  options,
  value,
  defaultValue,
  onChange,
  open,
  onOpenChange,
  placeholder,
  disabled = false,
  allowClear = false,
  className,
  style,
  size = "md",
  "aria-label": ariaLabel,
  ref,
}: SelectProps<T>) {
  const openControlled = open !== undefined;
  const [internalOpen, setInternalOpen] = useState(false);
  const currentOpen = openControlled ? open : internalOpen;
  const emitOpenChange = (next: boolean) => {
    if (!openControlled) setInternalOpen(next);
    onOpenChange?.(next);
  };
  const [highlighted, setHighlighted] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const pos = usePopupPosition(triggerRef, popupRef, currentOpen, "bottomLeft");
  const { messages } = useLocale();
  const placeholderText = placeholder ?? t("select.placeholder", messages);
  const uid = useId();
  const listboxId = `pixel-select${uid}-listbox`;
  const optionId = (i: number) => `pixel-select${uid}-option-${i}`;

  // 受控/非受控
  const isControlled = value !== undefined;
  const [internal, setInternal] = useState<T | undefined>(defaultValue);
  const current = isControlled ? value : internal;

  const emit = (next: T | undefined) => {
    if (!isControlled) setInternal(next);
    onChange?.(next as T);
  };

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        emitOpenChange(false);
      }
    };
    if (currentOpen) document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [currentOpen]);

  const close = useCallback(() => emitOpenChange(false), []);

  const openDropdown = useCallback(() => {
    const idx = options.findIndex((o) => o.value === current);
    setHighlighted(idx >= 0 ? idx : 0);
    emitOpenChange(true);
  }, [options, current]);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (disabled) return;
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        if (!currentOpen) {
          openDropdown();
        } else {
          setHighlighted((h) => (h + 1) % options.length);
        }
        break;
      case "ArrowUp":
        e.preventDefault();
        if (currentOpen) {
          setHighlighted((h) => (h - 1 + options.length) % options.length);
        }
        break;
      case "Enter":
        e.preventDefault();
        if (currentOpen && options[highlighted]) {
          emit(options[highlighted].value);
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
      case "Home":
        if (currentOpen) {
          e.preventDefault();
          setHighlighted(0);
        }
        break;
      case "End":
        if (currentOpen) {
          e.preventDefault();
          setHighlighted(options.length - 1);
        }
        break;
    }
  };

  const selected = options.find((o) => o.value === current);
  const triggerWidth = triggerRef.current?.getBoundingClientRect().width;

  const clear = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    emit(undefined);
    emitOpenChange(false);
  };

  return (
    <div
      ref={mergeRefs(ref, containerRef)}
      className={clsx("pixel-select", `pixel-select--${size}`, disabled && "pixel-select--disabled", className)}
      style={style}
    >
      <div
        ref={triggerRef}
        className="pixel-select-trigger"
        role="combobox"
        aria-expanded={currentOpen}
        aria-haspopup="listbox"
        aria-controls={currentOpen ? listboxId : undefined}
        aria-activedescendant={currentOpen && options[highlighted] ? optionId(highlighted) : undefined}
        aria-disabled={disabled}
        aria-label={ariaLabel}
        tabIndex={disabled ? -1 : 0}
        onClick={() => !disabled && (currentOpen ? close() : openDropdown())}
        onKeyDown={handleKeyDown}
      >
        <span className={clsx(!selected && "pixel-select-placeholder")}>
          {selected ? selected.label : placeholderText}
        </span>
        {allowClear && selected && !disabled && (
          <span
            role="button"
            aria-label="Clear"
            className="pixel-select-clear"
            onClick={clear}
          >
            ✕
          </span>
        )}
        <span className="pixel-select-arrow">{currentOpen ? "▴" : "▾"}</span>
      </div>
      {currentOpen &&
        renderPopup(
          <div
            ref={popupRef}
            id={listboxId}
            role="listbox"
            className="pixel-select-dropdown"
            style={{
              ...popupStyle(pos),
              minWidth: triggerWidth ? Math.max(triggerWidth, 140) : 140,
            }}
          >
            {options.map((opt, i) => (
              <div
                key={String(opt.value)}
                id={optionId(i)}
                role="option"
                aria-selected={opt.value === current}
                className={clsx(
                  "pixel-select-option",
                  opt.value === current && "pixel-select-option--selected",
                  i === highlighted && "pixel-select-option--highlighted"
                )}
                onMouseEnter={() => setHighlighted(i)}
                onClick={() => {
                  emit(opt.value);
                  emitOpenChange(false);
                }}
              >
                {opt.label}
              </div>
            ))}
          </div>
        )}
    </div>
  );
}

export default Select;
