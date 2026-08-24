import { type CSSProperties, type KeyboardEvent, useState, useRef, useEffect, useCallback, forwardRef } from "react";
import clsx from "clsx";
import "./DatePicker.css";
import { usePopupPosition, popupStyle, renderPopup } from "../../utils/popup";
import { mergeRefs } from "../../utils/mergeRefs";

export interface DatePickerProps {
  /** 当前值（受控，YYYY-MM-DD 格式） */
  value?: string;
  /** 非受控：默认值 */
  defaultValue?: string;
  /** 值变化回调，回传 YYYY-MM-DD 字符串 */
  onChange?: (value: string) => void;
  /** 占位文本，默认 "YYYY-MM-DD" */
  placeholder?: string;
  /** 是否禁用，默认 false；禁用时自动关闭弹层 */
  disabled?: boolean;
  /** 是否展开（受控） */
  open?: boolean;
  /** 展开状态变化回调 */
  onOpenChange?: (open: boolean) => void;
  /** 附加的样式类名 */
  className?: string;
  /** 行内样式 */
  style?: CSSProperties;
  /** 尺寸，默认 "md" */
  size?: "sm" | "md" | "lg";
}

/** 解析 YYYY-MM-DD 字符串，非法返回 null */
function parseDate(str: string): Date | null {
  const m = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(str.trim());
  if (!m) return null;
  const year = Number(m[1]);
  const month = Number(m[2]) - 1;
  const day = Number(m[3]);
  const d = new Date(year, month, day);
  if (d.getFullYear() !== year || d.getMonth() !== month || d.getDate() !== day) {
    return null;
  }
  return d;
}

/**
 * DatePicker 日期选择器。可手动输入或从月历面板选择 YYYY-MM-DD 日期，
 * 支持受控/非受控、外部点击关闭、Escape 关闭、Enter 提交，非法输入会标记无效态。
 */
const DatePicker = forwardRef<HTMLDivElement, DatePickerProps>(function DatePicker({
  value,
  defaultValue,
  onChange,
  placeholder = "YYYY-MM-DD",
  disabled = false,
  open,
  onOpenChange,
  className,
  style,
  size = "md",
}, ref) {
  // 受控/非受控
  const isValueControlled = value !== undefined;
  const [internal, setInternal] = useState<string>(defaultValue ?? "");
  const currentValue = isValueControlled ? value : internal;

  const emitValue = (next: string) => {
    if (!isValueControlled) setInternal(next);
    onChange?.(next);
  };

  const isControlled = open !== undefined;
  const [internalOpen, setInternalOpen] = useState(false);
  const currentOpen = isControlled ? open : internalOpen;
  const emitOpenChange = (next: boolean) => {
    if (!isControlled) setInternalOpen(next);
    onOpenChange?.(next);
  };

  const [input, setInput] = useState(currentValue);
  const [valid, setValid] = useState(true);
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const pos = usePopupPosition(inputRef, popupRef, currentOpen, "bottomLeft");

  // disabled 时自动关闭弹层
  useEffect(() => {
    if (disabled) emitOpenChange(false);
  }, [disabled]);

  // 外部 value（或非受控 internal）变化时同步 input
  const [prevValue, setPrevValue] = useState(currentValue);
  if (prevValue !== currentValue) {
    setPrevValue(currentValue);
    setInput(currentValue);
  }

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      // 弹层已 portal 到 body，点击弹层内部（如月份切换按钮）不应关闭
      const target = e.target as Node;
      const insideTrigger = rootRef.current?.contains(target);
      const insidePopup = popupRef.current?.contains(target);
      if (!insideTrigger && !insidePopup) emitOpenChange(false);
    };
    if (currentOpen) document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [currentOpen]);

  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  const days: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(d);

  const selectDay = useCallback(
    (d: number) => {
      const str = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      setInput(str);
      setValid(true);
      emitValue(str);
      emitOpenChange(false);
    },
    [year, month, emitValue]
  );

  const handleInputChange = (v: string) => {
    setInput(v);
    if (v.trim() === "") {
      setValid(true);
      return;
    }
    const parsed = parseDate(v);
    if (parsed) {
      setValid(true);
      setYear(parsed.getFullYear());
      setMonth(parsed.getMonth());
      emitValue(v);
    } else {
      setValid(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") emitOpenChange(false);
    if (e.key === "Enter") {
      const parsed = parseDate(input);
      if (parsed) {
        setValid(true);
        emitValue(input);
        emitOpenChange(false);
      }
    }
  };

  return (
    <div
      ref={mergeRefs(ref, rootRef)}
      className={clsx(
        "pixel-datepicker",
        `pixel-datepicker--${size}`,
        !valid && "pixel-datepicker--invalid",
        disabled && "pixel-datepicker--disabled",
        className
      )}
      style={style}
    >
      <input
        ref={inputRef}
        className="pixel-datepicker-input"
        value={input}
        placeholder={placeholder}
        onChange={(e) => handleInputChange(e.target.value)}
        onFocus={() => !disabled && emitOpenChange(true)}
        onClick={() => !disabled && emitOpenChange(!currentOpen)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        role="combobox"
        aria-expanded={currentOpen}
        aria-invalid={!valid}
      />
      {currentOpen &&
        renderPopup(
          <div
            ref={popupRef}
            className="pixel-datepicker-popup"
            role="dialog"
            aria-label="Date picker"
            style={popupStyle(pos)}
          >
            <div className="pixel-datepicker-header">
              <button type="button" onClick={() => setMonth((m) => (m === 0 ? (setYear((y) => y - 1), 11) : m - 1))} aria-label="Previous month">◀</button>
              <span>{year}-{String(month + 1).padStart(2, "0")}</span>
              <button type="button" onClick={() => setMonth((m) => (m === 11 ? (setYear((y) => y + 1), 0) : m + 1))} aria-label="Next month">▶</button>
            </div>
            <div className="pixel-datepicker-grid" role="grid">
              {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
                <div key={d} className="pixel-datepicker-weekday">{d}</div>
              ))}
              {days.map((d, i) =>
                d ? (
                  <div
                    key={i}
                    className="pixel-datepicker-day"
                    onClick={() => selectDay(d)}
                    role="gridcell"
                  >
                    {d}
                  </div>
                ) : (
                  <div key={i} />
                )
              )}
            </div>
          </div>
        )}
    </div>
  );
});

export default DatePicker;
