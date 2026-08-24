import { type CSSProperties, type ReactNode, useState } from "react";
import Table, { type TableColumn } from "../Table";
import Input from "../Input";
import Button from "../Button";
import "./EditableTable.css";

export interface EditableTableProps {
  /** 列定义（透传给内部 Table） */
  columns: TableColumn[];
  /** 行数据数组 */
  dataSource: Record<string, unknown>[];
  /** 保存某行编辑结果回调，参数为更新后的全量数据 */
  onSave?: (data: Record<string, unknown>[]) => void;
  /** 自定义类名 */
  className?: string;
  /** 自定义内联样式 */
  style?: CSSProperties;
}

/**
 * EditableTable 可编辑表格。基于 Table 封装，按行进入编辑态并以 Input 替换单元格。
 * 关键特性：每行独立编辑；附加 Action 列提供编辑/保存/取消操作。
 */
export default function EditableTable({
  columns,
  dataSource,
  onSave,
  className,
  style,
}: EditableTableProps) {
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editData, setEditData] = useState<Record<string, unknown>>({});

  const startEdit = (record: Record<string, unknown>) => {
    setEditingKey(record.key as string);
    setEditData({ ...record });
  };

  const cancelEdit = () => {
    setEditingKey(null);
    setEditData({});
  };

  const saveEdit = () => {
    onSave?.(
      dataSource.map((row) =>
        row.key === editingKey ? { ...row, ...editData } : row
      )
    );
    setEditingKey(null);
    setEditData({});
  };

  const editableColumns: TableColumn[] = [
    ...columns.map((col) => ({
      ...col,
      render: (val: unknown, record: Record<string, unknown>) => {
        if (editingKey !== record.key) return val as ReactNode;
        return (
          <Input
            value={(editData[col.dataIndex as string] as string) ?? ""}
            onChange={(e) =>
              setEditData((prev) => ({ ...prev, [col.dataIndex as string]: e.target.value }))
            }
          />
        );
      },
    })),
    {
      key: "action",
      title: "Action",
      dataIndex: "action",
      render: (_: unknown, record: Record<string, unknown>) => {
        if (editingKey === record.key) {
          return (
            <div className="pixel-editable-table-actions">
              <Button size="sm" onClick={saveEdit}>
                Save
              </Button>
              <Button size="sm" variant="secondary" onClick={cancelEdit}>
                Cancel
              </Button>
            </div>
          );
        }
        return (
          <Button size="sm" onClick={() => startEdit(record)}>
            Edit
          </Button>
        );
      },
    },
  ];

  return (
    <div className={className} style={style}>
      <Table columns={editableColumns} dataSource={dataSource} />
    </div>
  );
}