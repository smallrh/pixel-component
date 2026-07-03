import clsx from "clsx";
import "./Watermark.css";

interface WatermarkProps {
  text?: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export default function Watermark({
  text = "Pixel UI",
  children,
  className,
  style,
}: WatermarkProps) {
  return (
    <div className={clsx("pixel-watermark", className)} style={style}>
      {children}
      <div className="pixel-watermark-overlay" aria-hidden="true">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="pixel-watermark-text">
            {text}
          </div>
        ))}
      </div>
    </div>
  );
}