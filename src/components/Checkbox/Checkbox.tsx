import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import clsx from "clsx";
import "./Checkbox.css";

export interface CheckboxProps {
  checked?: boolean;
  /** 半选状态（用于"全选/部分选中"场景；选中态优先于半选态） */
  indeterminate?: boolean;
  onChange?: (checked: boolean) => void;
  children?: ReactNode;
  disabled?: boolean;
  className?: string;
  style?: CSSProperties;
}

export default function Checkbox({
  checked = false,
  indeterminate = false,
  onChange,
  children,
  disabled = false,
  className,
  style,
}: CheckboxProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  // React 不直接支持 indeterminate prop，需通过 DOM 设置
  useEffect(() => {
    if (inputRef.current) inputRef.current.indeterminate = indeterminate && !checked;
  }, [indeterminate, checked]);

  return (
    <label
      className={clsx(
        "pixel-checkbox",
        disabled && "pixel-checkbox--disabled",
        className
      )}
      style={style}
    >
      <input
        ref={inputRef}
        type="checkbox"
        className="pixel-checkbox-input"
        checked={checked}
        onChange={(e) => onChange?.(e.target.checked)}
        disabled={disabled}
      />
      <span
        className={clsx(
          "pixel-checkbox-inner",
          checked && "pixel-checkbox-inner--checked",
          indeterminate && !checked && "pixel-checkbox-inner--indeterminate"
        )}
      >
        {checked && <span className="pixel-checkbox-mark">✓</span>}
        {indeterminate && !checked && <span className="pixel-checkbox-mark">–</span>}
      </span>
      {children && <span className="pixel-checkbox-label">{children}</span>}
    </label>
  );
}

// 标记为「可勾选控件」，供 Form 的 cloneControl 识别。
// 原生 input 通过 props.type === "checkbox" 识别；自定义组件无 type prop，
// 若无此标记，FormItem 会注入 value 而非 checked，导致选中状态与表单值脱节。
(Checkbox as CheckboxProps & { __PIXEL_CHECKABLE__?: boolean }).__PIXEL_CHECKABLE__ = true;