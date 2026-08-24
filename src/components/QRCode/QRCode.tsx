import type { CSSProperties } from "react";
import clsx from "clsx";
import "./QRCode.css";
import { generateQRCodeMatrix } from "./qr";

export interface QRCodeProps {
  /** 编码内容（UTF-8，Version 1-10 容量上限内） */
  value?: string;
  /** 渲染尺寸（px） */
  size?: number;
  /** 前景色（暗模块） */
  color?: string;
  /** 背景色 */
  bgColor?: string;
  /** 纠错等级 */
  errorCorrectionLevel?: "L" | "M" | "Q" | "H";
  /** 附加的样式类名 */
  className?: string;
  /** 行内样式（会与渲染尺寸合并） */
  style?: CSSProperties;
}

/**
 * 二维码（真实 QR，可被任意扫码器识别）。
 * 编码由 qr.ts 实现（无第三方依赖，Version 1-10 / 字节模式 / RS 纠错 / 8 掩码优化）。
 */
export default function QRCode({
  value = "pixel-ui",
  size = 128,
  color = "#000",
  bgColor = "#fff",
  errorCorrectionLevel = "M",
  className,
  style,
}: QRCodeProps) {
  const cells = generateQRCodeMatrix(value, errorCorrectionLevel);
  const count = cells.length;
  const cellSize = Math.max(1, Math.floor(size / count));
  const renderSize = cellSize * count;

  return (
    <div
      className={clsx("pixel-qrcode", className)}
      style={{
        width: renderSize,
        height: renderSize,
        ...style,
      }}
    >
      <svg
        width={renderSize}
        height={renderSize}
        viewBox={`0 0 ${count} ${count}`}
        role="img"
        aria-label={`QR code: ${value}`}
      >
        <rect width={count} height={count} fill={bgColor} />
        {cells.map((row, ri) =>
          row.map((filled, ci) =>
            filled ? (
              <rect key={`${ri}-${ci}`} x={ci} y={ri} width={1} height={1} fill={color} />
            ) : null
          )
        )}
      </svg>
    </div>
  );
}
