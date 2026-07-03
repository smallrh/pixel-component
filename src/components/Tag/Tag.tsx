import clsx from "clsx";
import "./Tag.css";

interface TagProps {
  children: React.ReactNode;
  closable?: boolean;
  onClose?: () => void;
  color?: "default" | "red" | "green" | "blue" | "yellow";
  className?: string;
  style?: React.CSSProperties;
}

const colorMap: Record<string, { bg: string; text: string }> = {
  default: { bg: "#fff", text: "#000" },
  red: { bg: "#000", text: "#fff" },
  green: { bg: "#fff", text: "#000" },
  blue: { bg: "#000", text: "#fff" },
  yellow: { bg: "#fff", text: "#000" },
};

export default function Tag({
  children,
  closable = false,
  onClose,
  color = "default",
  className,
  style,
}: TagProps) {
  const colors = colorMap[color] ?? colorMap.default;

  return (
    <span
      className={clsx("pixel-tag", `pixel-tag--${color}`, className)}
      style={{
        background: colors.bg,
        color: colors.text,
        borderColor: colors.text,
        ...style,
      }}
    >
      {children}
      {closable && (
        <button
          className="pixel-tag-close"
          onClick={(e) => {
            e.stopPropagation();
            onClose?.();
          }}
          aria-label="close"
        >
          ✕
        </button>
      )}
    </span>
  );
}