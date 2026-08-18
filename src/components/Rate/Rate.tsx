import { type CSSProperties, useState } from "react";
import clsx from "clsx";
import "./Rate.css";

export interface RateProps {
  value?: number;
  defaultValue?: number;
  count?: number;
  allowHalf?: boolean;
  allowClear?: boolean;
  disabled?: boolean;
  onChange?: (value: number) => void;
  className?: string;
  style?: CSSProperties;
}

function StarGlyph({ filled }: { filled: boolean }) {
  return (
    <span className={clsx("pixel-rate-glyph", filled && "pixel-rate-glyph--filled")}>
      ★
    </span>
  );
}

export default function Rate({
  value,
  defaultValue = 0,
  count = 5,
  allowHalf = false,
  allowClear = true,
  disabled = false,
  onChange,
  className,
  style,
}: RateProps) {
  const isControlled = value !== undefined;
  const [internal, setInternal] = useState(defaultValue);
  const current = isControlled ? value : internal;

  const emit = (next: number) => {
    if (!isControlled) setInternal(next);
    onChange?.(next);
  };

  const handleClick = (i: number, half: boolean) => {
    if (disabled) return;
    let next = i + 1;
    if (half) next -= 0.5;
    if (allowClear && current === next) next = 0;
    emit(next);
  };

  const stars = Array.from({ length: count }, (_, i) => {
    const pos = i + 1;
    const full = current >= pos;
    const half = allowHalf && current >= pos - 0.5 && current < pos;
    return (
      <span
        key={i}
        className={clsx("pixel-rate-star", disabled && "pixel-rate-star--disabled")}
        onClick={(e) => {
          const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
          const half = allowHalf && e.clientX - rect.left < rect.width / 2;
          handleClick(i, half);
        }}
      >
        <StarGlyph filled={full} />
        {half && <span className="pixel-rate-half"><StarGlyph filled /></span>}
      </span>
    );
  });

  return (
    <div
      className={clsx("pixel-rate", className)}
      style={style}
      role="radiogroup"
      aria-label="rating"
    >
      {stars}
      <span className="pixel-rate-value">{current || ""}</span>
    </div>
  );
}
