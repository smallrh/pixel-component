import { type KeyboardEvent, useCallback, type CSSProperties, forwardRef, useState } from "react";
import clsx from "clsx";
import "./Rate.css";

export interface RateProps {
  /** 当前评分（受控；未传则走非受控） */
  value?: number;
  /** 非受控默认值，默认 0 */
  defaultValue?: number;
  /** 星星总数，默认 5 */
  count?: number;
  /** 是否允许半星，默认 false */
  allowHalf?: boolean;
  /** 是否允许再次点击当前值清零，默认 true */
  allowClear?: boolean;
  /** 是否禁用，默认 false */
  disabled?: boolean;
  /** 评分变化回调 */
  onChange?: (value: number) => void;
  /** 附加的样式类名 */
  className?: string;
  /** 行内样式 */
  style?: CSSProperties;
}

function StarGlyph({ filled }: { filled: boolean }) {
  return (
    <span className={clsx("pixel-rate-glyph", filled && "pixel-rate-glyph--filled")}>
      ★
    </span>
  );
}

/**
 * Rate 评分组件。通过星星图标采集评分，支持半星、清零、禁用，
 * 点击星星左半部分可触发半星选择，受控/非受控通用。
 */
const Rate = forwardRef<HTMLDivElement, RateProps>(function Rate({
  value,
  defaultValue = 0,
  count = 5,
  allowHalf = false,
  allowClear = true,
  disabled = false,
  onChange,
  className,
  style,
}, ref) {
  const isControlled = value !== undefined;
  const [internal, setInternal] = useState(defaultValue);
  const current = isControlled ? value : internal;

  const emit = useCallback(
    (next: number) => {
      if (!isControlled) setInternal(next);
      onChange?.(next);
    },
    [isControlled, onChange]
  );

  const handleClick = useCallback(
    (i: number, half: boolean) => {
      if (disabled) return;
      let next = i + 1;
      if (half) next -= 0.5;
      if (allowClear && current === next) next = 0;
      emit(next);
    },
    [disabled, allowClear, current, emit]
  );

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
      ref={ref}
      className={clsx("pixel-rate", className)}
      style={style}
      role="slider"
      aria-label="rating"
      tabIndex={disabled ? -1 : 0}
      aria-valuenow={current}
      aria-valuemin={0}
      aria-valuemax={count}
      aria-disabled={disabled ? true : undefined}
      onKeyDown={(e: KeyboardEvent<HTMLDivElement>) => {
        if (disabled) return;
        const step = allowHalf ? 0.5 : 1;
        if (e.key === "ArrowLeft") {
          e.preventDefault();
          const next = Math.max(0, current - step);
          if (next !== current) emit(next);
        } else if (e.key === "ArrowRight") {
          e.preventDefault();
          const next = Math.min(count, current + step);
          if (next !== current) emit(next);
        }
      }}
    >
      {stars}
      <span className="pixel-rate-value">{current || ""}</span>
    </div>
  );
});

export default Rate;
