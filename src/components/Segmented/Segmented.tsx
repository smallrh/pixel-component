import clsx from "clsx";
import "./Segmented.css";

interface SegmentedOption {
  label: React.ReactNode;
  value: string;
}

interface SegmentedProps {
  options: SegmentedOption[];
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  style?: React.CSSProperties;
}

export default function Segmented({
  options,
  value,
  onChange,
  className,
  style,
}: SegmentedProps) {
  return (
    <div className={clsx("pixel-segmented", className)} style={style}>
      {options.map((opt) => (
        <div
          key={opt.value}
          className={clsx(
            "pixel-segmented-item",
            opt.value === value && "pixel-segmented-item--active"
          )}
          onClick={() => onChange?.(opt.value)}
        >
          {opt.label}
        </div>
      ))}
    </div>
  );
}