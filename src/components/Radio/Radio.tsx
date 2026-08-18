import type { CSSProperties } from "react";
import clsx from "clsx";
import "./Radio.css";

interface RadioOption {
  label: string;
  value: string;
}

export interface RadioProps {
  options: RadioOption[];
  value?: string;
  onChange?: (value: string) => void;
  direction?: "horizontal" | "vertical";
  className?: string;
  style?: CSSProperties;
}

export default function Radio({
  options,
  value,
  onChange,
  direction = "horizontal",
  className,
  style,
}: RadioProps) {
  return (
    <div
      className={clsx(
        "pixel-radio-group",
        `pixel-radio-group--${direction}`,
        className
      )}
      style={style}
    >
      {options.map((opt) => (
        <label key={opt.value} className="pixel-radio">
          <input
            type="radio"
            className="pixel-radio-input"
            checked={value === opt.value}
            onChange={() => onChange?.(opt.value)}
          />
          <span className="pixel-radio-inner">
            {value === opt.value && <span className="pixel-radio-dot" />}
          </span>
          <span className="pixel-radio-label">{opt.label}</span>
        </label>
      ))}
    </div>
  );
}