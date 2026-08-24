import { useCallback, type ChangeEvent, forwardRef, useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import clsx from "clsx";
import { mergeRefs } from "../../utils/mergeRefs";
import "./Checkbox.css";

export interface CheckboxProps {
  /** 是否选中（受控） */
  checked?: boolean;
  /** 半选状态（用于"全选/部分选中"场景；选中态优先于半选态） */
  indeterminate?: boolean;
  /** 勾选状态变化回调，参数为最新的选中状态 */
  onChange?: (checked: boolean) => void;
  /** 标签内容 */
  children?: ReactNode;
  /** 是否禁用 */
  disabled?: boolean;
  /** 自定义类名 */
  className?: string;
  /** 自定义内联样式 */
  style?: CSSProperties;
}

/**
 * 复选框。支持受控 checked 与半选 indeterminate（用于"全选/部分选中"场景）。
 * onChange 直接传 boolean（非 Event），便于与 Form 配合。
 *
 * ```tsx
 * <Checkbox checked={v} onChange={setV}>同意条款</Checkbox>
 * ```
 */
const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox({
  checked = false,
  indeterminate = false,
  onChange,
  children,
  disabled = false,
  className,
  style,
}, ref) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => onChange?.(e.target.checked),
    [onChange]
  );

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
        ref={mergeRefs(ref, inputRef)}
        type="checkbox"
        className="pixel-checkbox-input"
        checked={checked}
        onChange={handleChange}
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
});

// 标记为「可勾选控件」，供 Form 的 cloneControl 识别。
// 原生 input 通过 props.type === "checkbox" 识别；自定义组件无 type prop，
// 若无此标记，FormItem 会注入 value 而非 checked，导致选中状态与表单值脱节。
(Checkbox as typeof Checkbox & { __PIXEL_CHECKABLE__?: boolean }).__PIXEL_CHECKABLE__ = true;

export default Checkbox;
