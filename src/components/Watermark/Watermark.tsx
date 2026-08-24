import type { CSSProperties, ReactNode } from "react";
import clsx from "clsx";
import "./Watermark.css";

export interface WatermarkProps {
  /** 水印文本，默认 "Pixel UI" */
  text?: string;
  /** 被覆盖水印的内容 */
  children: ReactNode;
  /** 自定义附加类名 */
  className?: string;
  /** 自定义内联样式 */
  style?: CSSProperties;
}

/**
 * Watermark 水印。
 * 在内容上层叠加重复平铺的文本水印，用于版权标识或防伪展示。
 */
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