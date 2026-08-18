import type { CSSProperties, ReactNode } from "react";
import clsx from "clsx";
import "./Descriptions.css";

interface DescriptionsItem {
  label: string;
  children: ReactNode;
  span?: number;
}

export interface DescriptionsProps {
  items: DescriptionsItem[];
  bordered?: boolean;
  column?: number;
  title?: string;
  className?: string;
  style?: CSSProperties;
}

export default function Descriptions({
  items,
  bordered = true,
  title,
  className,
  style,
}: DescriptionsProps) {
  // Simple layout: render one item per row for simplicity
  return (
    <div className={clsx("pixel-descriptions", className)} style={style}>
      {title && <div className="pixel-descriptions-title">{title}</div>}
      <table className={clsx("pixel-descriptions-table", bordered && "pixel-descriptions-table--bordered")}>
        <tbody>
          {items.map((item, idx) => (
            <tr key={idx} className="pixel-descriptions-row">
              <td className="pixel-descriptions-label">{item.label}</td>
              <td
                className="pixel-descriptions-value"
                colSpan={item.span ?? 1}
              >
                {item.children}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}