import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Table, { type TableColumn } from "./Table";

const columns: TableColumn[] = [
  { key: "name", title: "Name", dataIndex: "name" },
  {
    key: "age",
    title: "Age",
    dataIndex: "age",
    render: (value) => `${value} 岁`,
  },
];

const data = [
  { key: "1", name: "Alice", age: 28 },
  { key: "2", name: "Bob", age: 34 },
];

describe("Table", () => {
  it("renders headers and rows", () => {
    render(<Table columns={columns} dataSource={data} />);
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
  });

  it("uses custom render function", () => {
    render(<Table columns={columns} dataSource={data} />);
    expect(screen.getByText("28 岁")).toBeInTheDocument();
    expect(screen.getByText("34 岁")).toBeInTheDocument();
  });

  it("shows empty state when no data", () => {
    render(<Table columns={columns} dataSource={[]} />);
    expect(screen.getByText("No data")).toBeInTheDocument();
  });
});
