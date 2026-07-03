import clsx from "clsx";
import "./Checkbox.css";

interface CheckboxProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  children?: React.ReactNode;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export default function Checkbox({
  checked = false,
  onChange,
  children,
  disabled = false,
  className,
  style,
}: CheckboxProps) {
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
        type="checkbox"
        className="pixel-checkbox-input"
        checked={checked}
        onChange={(e) => onChange?.(e.target.checked)}
        disabled={disabled}
      />
      <span className={clsx("pixel-checkbox-inner", checked && "pixel-checkbox-inner--checked")}>
        {checked && <span className="pixel-checkbox-mark">✓</span>}
      </span>
      {children && <span className="pixel-checkbox-label">{children}</span>}
    </label>
  );
}