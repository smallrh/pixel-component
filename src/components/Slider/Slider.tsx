import type { CSSProperties } from "react";
import clsx from "clsx";
import "./Slider.css";

export interface SliderProps {
  value?: number;
  onChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  className?: string;
  style?: CSSProperties;
}

export default function Slider({
  value = 0,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  disabled = false,
  className,
  style,
}: SliderProps) {
  const pct = ((value - min) / (max - min)) * 100;

  return (
    <div className={clsx("pixel-slider", disabled && "pixel-slider--disabled", className)} style={style}>
      <input
        type="range"
        className="pixel-slider-input"
        value={value}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        onChange={(e) => onChange?.(Number(e.target.value))}
      />
      <div className="pixel-slider-track">
        <div className="pixel-slider-fill" style={{ width: `${pct}%` }} />
        <div
          className="pixel-slider-thumb"
          style={{ left: `${pct}%` }}
        />
      </div>
    </div>
  );
}