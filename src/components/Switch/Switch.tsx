import { useState } from "react";
import clsx from "clsx";
import "./Switch.css";

interface SwitchProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export default function Switch({
  checked,
  defaultChecked = false,
  onChange,
  disabled = false,
  className,
  style,
}: SwitchProps) {
  const [internal, setInternal] = useState(defaultChecked);
  const isControlled = checked !== undefined;
  const isChecked = isControlled ? checked : internal;

  return (
    <button
      className={clsx(
        "pixel-switch",
        isChecked && "pixel-switch--checked",
        disabled && "pixel-switch--disabled",
        className
      )}
      style={style}
      disabled={disabled}
      onClick={() => {
        const next = !isChecked;
        if (!isControlled) setInternal(next);
        onChange?.(next);
      }}
      role="switch"
      aria-checked={isChecked}
    >
      <span className="pixel-switch-knob" />
    </button>
  );
}
