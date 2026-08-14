import { useState } from "react";
import clsx from "clsx";
import "./Segmented.css";

interface SegmentedOption {
  label: React.ReactNode;
  value: string;
  disabled?: boolean;
  icon?: React.ReactNode;
}

interface SegmentedProps {
  options: SegmentedOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  block?: boolean;
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export default function Segmented({
  options,
  value,
  defaultValue,
  onChange,
  block = false,
  size = "md",
  disabled = false,
  className,
  style,
}: SegmentedProps) {
  const [innerValue, setInnerValue] = useState(defaultValue ?? options[0]?.value ?? "");
  const current = value ?? innerValue;

  const handleClick = (opt: SegmentedOption) => {
    if (opt.disabled || disabled || opt.value === current) return;
    if (value === undefined) setInnerValue(opt.value);
    onChange?.(opt.value);
  };

  return (
    <div
      className={clsx(
        "pixel-segmented",
        `pixel-segmented--${size}`,
        block && "pixel-segmented--block",
        disabled && "pixel-segmented--disabled",
        className
      )}
      style={style}
    >
      {options.map((opt) => (
        <div
          key={opt.value}
          className={clsx(
            "pixel-segmented-item",
            opt.value === current && "pixel-segmented-item--active",
            (opt.disabled || disabled) && "pixel-segmented-item--disabled"
          )}
          onClick={() => handleClick(opt)}
        >
          {opt.icon && <span className="pixel-segmented-item-icon">{opt.icon}</span>}
          <span className="pixel-segmented-item-label">{opt.label}</span>
        </div>
      ))}
    </div>
  );
}
