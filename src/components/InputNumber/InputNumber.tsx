import { type ChangeEvent, type CSSProperties, useState } from "react";
import clsx from "clsx";
import "./InputNumber.css";

export interface InputNumberProps {
  value?: number;
  defaultValue?: number;
  onChange?: (value: number | null) => void;
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  style?: CSSProperties;
}

export default function InputNumber({
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
}: InputNumberProps) {
  const isControlled = value !== undefined;
  const [internal, setInternal] = useState<number | null>(defaultValue ?? null);

  const current = isControlled ? value : internal;

  const clamp = (num: number) => {
    if (min !== undefined) num = Math.max(min, num);
    if (max !== undefined) num = Math.min(max, num);
    return num;
  };

  const emit = (next: number | null) => {
    if (!isControlled) setInternal(next);
    onChange?.(next);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (raw === "") {
      emit(null);
      return;
    }
    const num = Number(raw);
    if (isNaN(num)) return;
    emit(clamp(num));
  };

  const handleStep = (delta: number) => {
    const base = current ?? 0;
    emit(clamp(base + delta));
  };

  return (
    <span className="pixel-input-number-wrapper">
      <input
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
      />
      <span className="pixel-input-number-controls">
        <button
          type="button"
          tabIndex={-1}
          disabled={disabled}
          className="pixel-input-number-control pixel-input-number-up"
          onClick={() => handleStep(step)}
        >
          ▲
        </button>
        <button
          type="button"
          tabIndex={-1}
          disabled={disabled}
          className="pixel-input-number-control pixel-input-number-down"
          onClick={() => handleStep(-step)}
        >
          ▼
        </button>
      </span>
    </span>
  );
}
