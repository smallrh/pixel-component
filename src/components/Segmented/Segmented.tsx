import { type CSSProperties, type ReactNode, useState } from "react";
import clsx from "clsx";
import "./Segmented.css";

interface SegmentedOption {
  /** 选项标签 */
  label: ReactNode;
  /** 选项值 */
  value: string;
  /** 是否禁用 */
  disabled?: boolean;
  /** 前置图标 */
  icon?: ReactNode;
}

export interface SegmentedProps {
  /** 选项列表 */
  options: SegmentedOption[];
  /** 当前值（受控） */
  value?: string;
  /** 初始值（非受控），默认取首项 */
  defaultValue?: string;
  /** 选中值变化回调 */
  onChange?: (value: string) => void;
  /** 是否撑满容器宽度，默认 false */
  block?: boolean;
  /** 尺寸，默认 "md" */
  size?: "sm" | "md" | "lg";
  /** 是否整体禁用 */
  disabled?: boolean;
  /** 自定义类名 */
  className?: string;
  /** 自定义内联样式 */
  style?: CSSProperties;
}

/**
 * Segmented。分段控制器，按 options 渲染选项并支持受控/非受控选择与禁用。
 */
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
