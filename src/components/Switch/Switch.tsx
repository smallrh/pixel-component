import clsx from "clsx";
import "./Switch.css";

interface SwitchProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export default function Switch({
  checked = false,
  onChange,
  disabled = false,
  className,
  style,
}: SwitchProps) {
  return (
    <button
      className={clsx(
        "pixel-switch",
        checked && "pixel-switch--checked",
        disabled && "pixel-switch--disabled",
        className
      )}
      style={style}
      disabled={disabled}
      onClick={() => onChange?.(!checked)}
      role="switch"
      aria-checked={checked}
    >
      <span className="pixel-switch-knob" />
    </button>
  );
}