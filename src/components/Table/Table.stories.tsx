import type { Meta, StoryObj } from "@storybook/react";
import Table, { type TableProps, type TableRecord } from ".";
import Tag from "../Tag";

interface UserRow extends TableRecord {
  id: number;
  name: string;
  age: number;
  role: string;
  status: "active" | "inactive" | "banned";
}

const dataSource: UserRow[] = [
  { id: 1, name: "Alice",   age: 28, role: "Admin",  status: "active" },
  { id: 2, name: "Bob",     age: 34, role: "Editor", status: "active" },
  { id: 3, name: "Charlie", age: 22, role: "Viewer", status: "inactive" },
  { id: 4, name: "Diana",   age: 41, role: "Editor", status: "banned" },
  { id: 5, name: "Evan",    age: 30, role: "Viewer", status: "active" },
];

const columns = [
  { key: "id",    title: "ID",   dataIndex: "id" },
  { key: "name",  title: "Name", dataIndex: "name" },
  { key: "age",   title: "Age",  dataIndex: "age" },
  { key: "role",  title: "Role", dataIndex: "role" },
  {
    key: "status",
    title: "Status",
    dataIndex: "status",
    render: (v: UserRow["status"]) => {
      const map: Record<UserRow["status"], Tag["color"]> = {
        active:   "green",
        inactive: "blue",
        banned:   "red",
      };
      return <Tag color={map[v]}>{v.toUpperCase()}</Tag>;
    },
  },
];

const meta: Meta<TableProps<UserRow>> = {
  title: "Components/Data Display/Table",
  component: Table,
  tags: ["autodocs"],
  argTypes: {
    bordered: { control: "boolean", table: { defaultValue: { summary: "true" } } },
    loading: { control: "boolean" },
  },
  args: {
    columns,
    dataSource,
    rowKey: "id",
    bordered: true,
  },
} satisfies Meta<TableProps<UserRow>>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 基础表格（有边框、自定义 render 列） */
export const Basic: Story = {};

/** 无边框样式 */
export const Borderless: Story = {
  args: { bordered: false },
};

/** 加载中状态 */
export const Loading: Story = {
  args: { loading: true },
};

/** 空数据（显示 empty 占位） */
export const Empty: Story = {
  args: { dataSource: [] },
};

/** 强类型泛型：record 的 TS 类型推断正确 */
export const StrongTyped: Story = {
  render: (props) => (
    <Table<UserRow>
      {...props}
      rowKey="id"
      dataSource={dataSource.slice(0, 3)}
      columns={[
        { key: "name",  title: "姓名", dataIndex: "name" },
        {
          key: "greet",
          title: "问候",
          dataIndex: "name",
          // 这里的 value/record 类型都是强类型推导
          render: (_v, record) => `Hi, I'm ${record.name} (${record.age}yo)`,
        },
      ]}
    />
  ),
};
