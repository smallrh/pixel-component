import type { CSSProperties } from "react";
import clsx from "clsx";
import "./QRCode.css";

export interface QRCodeProps {
  value?: string;
  size?: number;
  className?: string;
  style?: CSSProperties;
}

// Simple visual QR-code-like grid (decorative pixel pattern)
export default function QRCode({
  value = "pixel-ui",
  size = 128,
  className,
  style,
}: QRCodeProps) {
  // Generate deterministic pattern from value
  const seed = value
    .split("")
    .reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const rows = 11;
  const cells: boolean[][] = [];

  for (let r = 0; r < rows; r++) {
    const row: boolean[] = [];
    for (let c = 0; c < rows; c++) {
      // Always border and corner markers
      if (
        r === 0 || r === rows - 1 || c === 0 || c === rows - 1 ||
        (r < 4 && c < 4) || (r < 4 && c > rows - 5) ||
        (r > rows - 5 && c < 4)
      ) {
        row.push(true);
      } else {
        row.push((seed + r * 7 + c * 13) % 3 !== 0);
      }
    }
    cells.push(row);
  }

  const cellSize = Math.floor(size / rows);

  return (
    <div
      className={clsx("pixel-qrcode", className)}
      style={{
        width: cellSize * rows,
        height: cellSize * rows,
        ...style,
      }}
    >
      <svg width={cellSize * rows} height={cellSize * rows} viewBox={`0 0 ${rows} ${rows}`}>
        {cells.map((row, ri) =>
          row.map((filled, ci) =>
            filled ? (
              <rect
                key={`${ri}-${ci}`}
                x={ci}
                y={ri}
                width={1}
                height={1}
                fill="#000"
              />
            ) : null
          )
        )}
      </svg>
    </div>
  );
}