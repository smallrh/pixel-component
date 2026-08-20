import type { CSSProperties, ReactNode } from "react";
import clsx from "clsx";
import "./Table.css";
import { useLocale, t } from "../LocaleProvider";

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
  /** 加载状态（显示内置加载指示） */
  loading?: boolean;
  /** 空数据文案，默认取 locale（"No data"） */
  emptyText?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export default function Table({
  columns,
  dataSource,
  rowKey = "key",
  bordered = true,
  loading = false,
  emptyText,
  className,
  style,
}: TableProps) {
  const { messages } = useLocale();
  const empty = emptyText ?? t("table.empty", messages);
  const isEmpty = !loading && dataSource.length === 0;

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
      {loading && <div className="pixel-table-empty">Loading...</div>}
      {isEmpty && <div className="pixel-table-empty">{empty}</div>}
    </div>
  );
}
