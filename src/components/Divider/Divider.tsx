import clsx from "clsx";
import "./Divider.css";

interface DividerProps {
  text?: string;
  orientation?: "left" | "center" | "right";
  className?: string;
  style?: React.CSSProperties;
}

export default function Divider({
  text,
  orientation = "center",
  className,
  style,
}: DividerProps) {
  return (
    <div
      className={clsx(
        "pixel-divider",
        text && `pixel-divider--with-text pixel-divider--text-${orientation}`,
        className
      )}
      style={style}
    >
      {text && <span className="pixel-divider-text">{text}</span>}
    </div>
  );
}