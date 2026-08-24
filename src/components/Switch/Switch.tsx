import { useCallback, type CSSProperties, forwardRef, useState } from "react";
import clsx from "clsx";
import "./Switch.css";

export interface SwitchProps {
  /** 当前是否选中（受控） */
  checked?: boolean;
  /** 初始是否选中（非受控），默认 false */
  defaultChecked?: boolean;
  /** 切换回调，返回最新状态 */
  onChange?: (checked: boolean) => void;
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
 * Switch。开关组件，支持受控/非受控语义，禁用时不可切换。
 */
const Switch = forwardRef<HTMLButtonElement, SwitchProps>(function Switch({
  checked,
  defaultChecked = false,
  onChange,
  disabled = false,
  className,
  style,
  "aria-label": ariaLabel,
}, ref) {
  const [internal, setInternal] = useState(defaultChecked);
  const isControlled = checked !== undefined;
  const isChecked = isControlled ? checked : internal;

  const toggle = useCallback(() => {
    const next = !isChecked;
    if (!isControlled) setInternal(next);
    onChange?.(next);
  }, [isChecked, isControlled, onChange]);

  return (
    <button
      ref={ref}
      type="button"
      className={clsx(
        "pixel-switch",
        isChecked && "pixel-switch--checked",
        disabled && "pixel-switch--disabled",
        className
      )}
      style={style}
      disabled={disabled}
      onClick={toggle}
      role="switch"
      aria-checked={isChecked}
      aria-label={ariaLabel}
    >
      <span className="pixel-switch-knob" />
    </button>
  );
});

export default Switch;
