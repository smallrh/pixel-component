import { type CSSProperties, useState, useRef, useEffect, forwardRef } from "react";
import clsx from "clsx";
import "./TimePicker.css";
import { usePopupPosition, popupStyle, renderPopup } from "../../utils/popup";
import { mergeRefs } from "../../utils/mergeRefs";
import { useLocale, t } from "../LocaleProvider";

export interface TimePickerProps {
  /** 当前值（受控，HH:MM 格式） */
  value?: string;
  /** 非受控：默认值 */
  defaultValue?: string;
  /** 值变化回调，回传 HH:MM 字符串 */
  onChange?: (value: string) => void;
  /** 占位文本，默认 "HH:MM" */
  placeholder?: string;
  /** 是否禁用，默认 false */
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
  /** 无障碍标签（用于屏幕阅读器关联 label） */
  "aria-label"?: string;
}

/**
 * TimePicker 时间选择器。点击触发只读输入框弹出 hour/minute 两列选择面板，
 * 支持受控/非受控、外部点击关闭，打开时根据当前值同步高亮。
 */
const TimePicker = forwardRef<HTMLDivElement, TimePickerProps>(function TimePicker({
  value,
  defaultValue,
  onChange,
  placeholder = "HH:MM",
  disabled = false,
  open,
  onOpenChange,
  className,
  style,
  size = "md",
  "aria-label": ariaLabel,
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

  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const pos = usePopupPosition(inputRef, popupRef, currentOpen, "bottomLeft");

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) emitOpenChange(false);
    };
    if (currentOpen) document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [currentOpen]);

  const [hour, setHour] = useState(12);
  const [minute, setMinute] = useState(0);
  const { messages } = useLocale();

  // 打开时从 currentValue（受控 value 或非受控 internal）解析 HH:MM 同步到 hour/minute
  // 避免打开后高亮列与当前值脱节
  useEffect(() => {
    if (!currentOpen) return;
    const m = /^(\d{1,2}):(\d{1,2})$/.exec(currentValue.trim());
    if (m) {
      setHour(Number(m[1]));
      setMinute(Number(m[2]));
    }
  }, [currentOpen, currentValue]);

  const select = () => {
    const str = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
    emitValue(str);
    emitOpenChange(false);
  };

  const toggle = () => {
    if (!disabled) emitOpenChange(!currentOpen);
  };

  return (
    <div ref={mergeRefs(ref, rootRef)} className={clsx("pixel-timepicker", `pixel-timepicker--${size}`, disabled && "pixel-timepicker--disabled", className)} style={style}>
      <input
        ref={inputRef}
        className="pixel-timepicker-input"
        value={currentValue}
        placeholder={placeholder}
        readOnly
        disabled={disabled}
        onClick={toggle}
        aria-label={ariaLabel}
      />
      {currentOpen &&
        renderPopup(
          <div ref={popupRef} className="pixel-timepicker-popup" style={popupStyle(pos)}>
            <div className="pixel-timepicker-selectors">
              <div className="pixel-timepicker-col">
                {Array.from({ length: 24 }).map((_, h) => (
                  <div
                    key={h}
                    className={clsx("pixel-timepicker-opt", hour === h && "pixel-timepicker-opt--sel")}
                    onClick={() => setHour(h)}
                  >
                    {String(h).padStart(2, "0")}
                  </div>
                ))}
              </div>
              <div className="pixel-timepicker-col">
                {Array.from({ length: 60 }).map((_, m) => (
                  <div
                    key={m}
                    className={clsx("pixel-timepicker-opt", minute === m && "pixel-timepicker-opt--sel")}
                    onClick={() => setMinute(m)}
                  >
                    {String(m).padStart(2, "0")}
                  </div>
                ))}
              </div>
            </div>
            <button type="button" className="pixel-timepicker-ok" onClick={select}>
              {t("timepicker.ok", messages)}
            </button>
          </div>
        )}
    </div>
  );
});

export default TimePicker;
