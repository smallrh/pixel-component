import type { CSSProperties, ReactNode } from "react";
import clsx from "clsx";
import "./Table.css";

export interface TableColumn {
  key: string;
  title: string;
  dataIndex: string;
  render?: (value: unknown, record: Record<string, unknown>, index: number) => ReactNode;
}

export interface TableProps {
  columns: TableColumn[];
  dataSource: Record<string, unknown>[];
  rowKey?: string;
  bordered?: boolean;
  className?: string;
  style?: CSSProperties;
}

export default function Table({
  columns,
  dataSource,
  rowKey = "key",
  bordered = true,
  className,
  style,
}: TableProps) {
  return (
    <div className={clsx("pixel-table-wrapper", className)} style={style}>
      <table className={clsx("pixel-table", bordered && "pixel-table--bordered")}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key} className="pixel-table-th">
                {col.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {dataSource.map((record, rowIndex) => (
            <tr key={record[rowKey] != null ? `${String(record[rowKey])}-${rowIndex}` : rowIndex} className="pixel-table-tr">
              {columns.map((col) => (
                <td key={col.key} className="pixel-table-td">
                  {col.render
                    ? col.render(record[col.dataIndex], record, rowIndex)
                    : (record[col.dataIndex] as ReactNode)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {dataSource.length === 0 && (
        <div className="pixel-table-empty">No data</div>
      )}
    </div>
  );
}