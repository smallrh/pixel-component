import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Tree from "./Tree";

const treeData = [
  {
    title: "Parent",
    key: "p",
    children: [
      { title: "Child A", key: "a" },
      { title: "Child B", key: "b" },
    ],
  },
  { title: "Solo", key: "s" },
];

describe("Tree", () => {
  it("renders nodes", () => {
    render(<Tree treeData={treeData} defaultExpandAll />);
    expect(screen.getByText("Parent")).toBeInTheDocument();
    expect(screen.getByText("Solo")).toBeInTheDocument();
  });

  it("selects a node on click", () => {
    const onSelect = vi.fn();
    render(<Tree treeData={treeData} onSelect={onSelect} />);
    fireEvent.click(screen.getByText("Solo"));
    expect(onSelect).toHaveBeenCalledWith("s", true);
  });

  it("checks all children when parent checked", () => {
    const onCheck = vi.fn();
    render(<Tree treeData={treeData} checkable defaultExpandAll onCheck={onCheck} />);
    // 勾选 Parent checkbox（父节点）
    fireEvent.click(screen.getAllByRole("checkbox")[0]);
    expect(onCheck).toHaveBeenCalledTimes(1);
    const keys = onCheck.mock.calls[0][0] as string[];
    expect(keys).toContain("p");
    expect(keys).toContain("a");
    expect(keys).toContain("b");
  });

  it("checks parent when all children checked (upward cascade)", () => {
    const onCheck = vi.fn();
    render(<Tree treeData={treeData} checkable defaultExpandAll onCheck={onCheck} />);
    const boxes = screen.getAllByRole("checkbox");
    // 勾选 Child A 和 Child B
    fireEvent.click(boxes[1]);
    fireEvent.click(boxes[2]);
    expect(onCheck).toHaveBeenCalledTimes(2);
    const keys = onCheck.mock.calls[1][0] as string[];
    // 子节点全部勾选后，父节点也应被勾选
    expect(keys).toContain("a");
    expect(keys).toContain("b");
    expect(keys).toContain("p");
  });
});
