import clsx from "clsx";
import "./InputNumber.css";

interface InputNumberProps {
  value?: number;
  onChange?: (value: number | null) => void;
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export default function InputNumber({
  value,
  onChange,
  min,
  max,
  step = 1,
  placeholder,
  disabled = false,
  className,
  style,
}: InputNumberProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (raw === "") {
      onChange?.(null);
      return;
    }
    let num = Number(raw);
    if (isNaN(num)) return;
    if (min !== undefined) num = Math.max(min, num);
    if (max !== undefined) num = Math.min(max, num);
    onChange?.(num);
  };

  return (
    <input
      type="number"
      value={value ?? ""}
      onChange={handleChange}
      min={min}
      max={max}
      step={step}
      placeholder={placeholder}
      disabled={disabled}
      className={clsx("pixel-input-number", className)}
      style={style}
    />
  );
}