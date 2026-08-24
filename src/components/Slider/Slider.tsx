import { useCallback, type ChangeEvent, type CSSProperties, forwardRef, useState } from "react";
import clsx from "clsx";
import "./Slider.css";

export interface SliderProps {
  /** 当前值（受控） */
  value?: number;
  /** 非受控：默认值 */
  defaultValue?: number;
  /** 数值变化回调 */
  onChange?: (value: number) => void;
  /** 最小值，默认 0 */
  min?: number;
  /** 最大值，默认 100 */
  max?: number;
  /** 步长，默认 1 */
  step?: number;
  /** 是否禁用 */
  disabled?: boolean;
  /** 自定义类名 */
  className?: string;
  /** 自定义内联样式 */
  style?: CSSProperties;
  /** 无障碍标签（用于屏幕阅读器关联 label） */
  "aria-label"?: string;
}

/**
 * Slider。滑块输入，基于原生 range 封装，支持受控/非受控与自定义刻度范围。
 */
const Slider = forwardRef<HTMLDivElement, SliderProps>(function Slider({
  value,
  defaultValue = 0,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  disabled = false,
  className,
  style,
  "aria-label": ariaLabel,
}, ref) {
  // 受控/非受控
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

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      emit(Number(e.target.value));
    },
    [emit]
  );

  const pct = ((current - min) / (max - min)) * 100;

  return (
    <div ref={ref} className={clsx("pixel-slider", disabled && "pixel-slider--disabled", className)} style={style}>
      {/* 原生 input[type=range] 自带 role="slider" 并已支持
          ArrowUp/Down/Left/Right 调整值、Home/End 跳到极值、PageUp/Down 大步进。
          这里仅显式补 ARIA 值属性与无障碍标签，键盘逻辑交给原生。 */}
      <input
        type="range"
        className="pixel-slider-input"
        value={current}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        onChange={handleChange}
        aria-label={ariaLabel ?? "slider"}
        aria-valuenow={current}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-disabled={disabled}
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
});

export default Slider;