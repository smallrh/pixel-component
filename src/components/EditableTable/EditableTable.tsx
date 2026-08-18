import { type CSSProperties, type ReactNode, useState } from "react";
import Table, { type TableColumn } from "../Table";
import Input from "../Input";
import Button from "../Button";
import "./EditableTable.css";

export interface EditableTableProps {
  columns: TableColumn[];
  dataSource: Record<string, unknown>[];
  onSave?: (data: Record<string, unknown>[]) => void;
  className?: string;
  style?: CSSProperties;
}

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