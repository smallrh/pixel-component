import { type CSSProperties, type ReactNode, type Ref, memo, useMemo } from "react";
import clsx from "clsx";
import "./Table.css";
import { useLocale, t } from "../LocaleProvider";

/** 记录类型约束：行数据必须是对象（用于 rowKey 取值与 render 回调） */
export type TableRecord = Record<string, unknown>;

export interface TableColumn<T extends TableRecord = TableRecord> {
  /** 列唯一 key */
  key: string;
  /** 表头标题 */
  title: string;
  /** 对应数据字段名（强类型 keyof T） */
  dataIndex: keyof T & string;
  /** 自定义单元格渲染，接收字段值、整行记录、行索引 */
  render?: (value: T[keyof T], record: T, index: number) => ReactNode;
}

export interface TableProps<T extends TableRecord = TableRecord> {
  /** 列定义 */
  columns: TableColumn<T>[];
  /** 数据源（泛型 T，自动推断行类型） */
  dataSource: T[];
  /** 行唯一标识字段名，默认 "key" */
  rowKey?: keyof T & string;
  /** 是否显示边框，默认 true */
  bordered?: boolean;
  /** 加载状态（显示内置加载指示） */
  loading?: boolean;
  /** 空数据文案，默认取 locale（"No data"） */
  emptyText?: ReactNode;
  /** 自定义类名 */
  className?: string;
  /** 自定义内联样式 */
  style?: CSSProperties;
  /** React 19 ref-as-prop：指向最外层 div（便于外部 measure/scroll） */
  ref?: Ref<HTMLDivElement>;
}

interface TableRowProps<T extends TableRecord = TableRecord> {
  record: T;
  rowIndex: number;
  columns: TableColumn<T>[];
}

/**
 * memo 比较函数：返回 true 表示 props 相等（跳过重渲染）。
 * 列定义 columns 在父组件每次 render 时可能为新数组引用，但列结构通常稳定，
 * 因此只比较 record 引用与 rowIndex——record 引用不变即认为行内容未变。
 */
function rowAreEqual(prev: TableRowProps, next: TableRowProps): boolean {
  return prev.record === next.record && prev.rowIndex === next.rowIndex;
}

function TableRowInner<T extends TableRecord>({
  record,
  rowIndex,
  columns,
}: TableRowProps<T>) {
  return (
    <tr className="pixel-table-tr">
      {columns.map((col) => {
        const value = record[col.dataIndex];
        return (
          <td key={col.key} className="pixel-table-td">
            {col.render ? col.render(value, record, rowIndex) : (value as ReactNode)}
          </td>
        );
      })}
    </tr>
  );
}

const TableRow = memo(TableRowInner, rowAreEqual) as typeof TableRowInner;

/**
 * 表格组件。泛型 T 推断示例：
 * ```ts
 * const data = [{ id: 1, name: "Alice" }];
 * <Table dataSource={data} rowKey="id" columns={[{ key: "name", title: "姓名", dataIndex: "name" }]} />
 * // render 回调的 value/record 已是 { id: number; name: string }
 * ```
 */
function Table<T extends TableRecord>({
  columns,
  dataSource,
  rowKey,
  bordered = true,
  loading = false,
  emptyText,
  className,
  style,
  ref,
}: TableProps<T>) {
  const { messages } = useLocale();
  const empty = useMemo(
    () => emptyText ?? t("table.empty", messages),
    [emptyText, messages]
  );
  const loadingText = useMemo(() => t("table.loading", messages), [messages]);
  const isEmpty = !loading && dataSource.length === 0;
  const keyField = rowKey ?? "key";

  return (
    <div ref={ref} className={clsx("pixel-table-wrapper", className)} style={style}>
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
            <TableRow
              key={record[keyField] != null ? String(record[keyField]) : rowIndex}
              record={record}
              rowIndex={rowIndex}
              columns={columns}
            />
          ))}
        </tbody>
      </table>
      {loading && <div className="pixel-table-empty">{loadingText}</div>}
      {isEmpty && <div className="pixel-table-empty">{empty}</div>}
    </div>
  );
}

export default Table;
