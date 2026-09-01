import { forwardRef, useCallback, type ChangeEvent, type CSSProperties, useState } from "react";
import clsx from "clsx";
import "./Radio.css";

interface RadioOption {
  label: string;
  value: string;
  /** 单项禁用 */
  disabled?: boolean;
}

export interface RadioProps {
  options: RadioOption[];
  /** 当前选中值（受控） */
  value?: string;
  /** 非受控：默认选中值 */
  defaultValue?: string;
  onChange?: (value: string) => void;
  direction?: "horizontal" | "vertical";
  /** 整体禁用（单项 disabled 优先级更高） */
  disabled?: boolean;
  className?: string;
  style?: CSSProperties;
}

const Radio = forwardRef<HTMLDivElement, RadioProps>(function Radio({
  options,
  value,
  defaultValue,
  onChange,
  direction = "horizontal",
  disabled = false,
  className,
  style,
}, ref) {
  // 受控/非受控
  const isControlled = value !== undefined;
  const [internal, setInternal] = useState<string>(defaultValue ?? "");
  const current = isControlled ? value : internal;

  const emit = useCallback(
    (next: string) => {
      if (!isControlled) setInternal(next);
      onChange?.(next);
    },
    [isControlled, onChange]
  );

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      emit(e.target.value);
    },
    [emit]
  );

  return (
    <div
      ref={ref}
      className={clsx(
        "pixel-radio-group",
        `pixel-radio-group--${direction}`,
        className
      )}
      style={style}
      role="radiogroup"
    >
      {options.map((opt) => {
        const itemDisabled = disabled || opt.disabled;
        return (
          <label
            key={opt.value}
            className={clsx("pixel-radio", itemDisabled && "pixel-radio--disabled")}
          >
            <input
              type="radio"
              value={opt.value}
              className="pixel-radio-input"
              checked={current === opt.value}
              disabled={itemDisabled}
              aria-disabled={itemDisabled}
              onChange={handleChange}
            />
            <span className="pixel-radio-inner">
              {current === opt.value && !itemDisabled && <span className="pixel-radio-dot" />}
            </span>
            <span className="pixel-radio-label">{opt.label}</span>
          </label>
        );
      })}
    </div>
  );
});

export default Radio;