import { useCallback, type ChangeEvent, type CSSProperties, forwardRef, useState } from "react";
import clsx from "clsx";
import "./InputNumber.css";

export interface InputNumberProps {
  /** 当前值（受控；未传则走非受控） */
  value?: number;
  /** 非受控默认值，默认 null */
  defaultValue?: number;
  /** 值变化回调，清空时回传 null */
  onChange?: (value: number | null) => void;
  /** 最小值，超出会被夹取到此值 */
  min?: number;
  /** 最大值，超出会被夹取到此值 */
  max?: number;
  /** 步长，默认 1，控制上下调节按钮与点击增量 */
  step?: number;
  /** 占位文本 */
  placeholder?: string;
  /** 是否禁用，默认 false */
  disabled?: boolean;
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
 * InputNumber 数字输入框。在原生 number input 基础上提供上下步进按钮，
 * 支持 min/max 夹取、受控/非受控模式，清空时回传 null。
 */
const InputNumber = forwardRef<HTMLInputElement, InputNumberProps>(function InputNumber({
  value,
  defaultValue,
  onChange,
  min,
  max,
  step = 1,
  placeholder,
  disabled = false,
  className,
  style,
  size = "md",
  "aria-label": ariaLabel,
}, ref) {
  const isControlled = value !== undefined;
  const [internal, setInternal] = useState<number | null>(defaultValue ?? null);

  const current = isControlled ? value : internal;

  const clamp = useCallback(
    (num: number) => {
      if (min !== undefined) num = Math.max(min, num);
      if (max !== undefined) num = Math.min(max, num);
      return num;
    },
    [min, max]
  );

  const emit = useCallback(
    (next: number | null) => {
      if (!isControlled) setInternal(next);
      onChange?.(next);
    },
    [isControlled, onChange]
  );

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value;
      if (raw === "") {
        emit(null);
        return;
      }
      const num = Number(raw);
      if (isNaN(num)) return;
      emit(clamp(num));
    },
    [emit, clamp]
  );

  const handleInc = useCallback(() => {
    const base = current ?? 0;
    emit(clamp(base + step));
  }, [current, emit, clamp, step]);

  const handleDec = useCallback(() => {
    const base = current ?? 0;
    emit(clamp(base - step));
  }, [current, emit, clamp, step]);

  return (
    <span className={clsx("pixel-input-number-wrapper", `pixel-input-number--${size}`)}>
      <input
        ref={ref}
        type="number"
        value={current ?? ""}
        onChange={handleChange}
        min={min}
        max={max}
        step={step}
        placeholder={placeholder}
        disabled={disabled}
        className={clsx("pixel-input-number", className)}
        style={style}
        aria-label={ariaLabel}
      />
      <span className="pixel-input-number-controls">
        <button
          type="button"
          tabIndex={-1}
          disabled={disabled}
          className="pixel-input-number-control pixel-input-number-up"
          onClick={handleInc}
        >
          ▲
        </button>
        <button
          type="button"
          tabIndex={-1}
          disabled={disabled}
          className="pixel-input-number-control pixel-input-number-down"
          onClick={handleDec}
        >
          ▼
        </button>
      </span>
    </span>
  );
});

export default InputNumber;
