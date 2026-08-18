import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Tabs from "./Tabs";

const items = [
  { key: "tab1", label: "Tab One", children: "Content One" },
  { key: "tab2", label: "Tab Two", children: "Content Two" },
];

describe("Tabs", () => {
  it("shows first tab content by default", () => {
    render(<Tabs items={items} />);
    expect(screen.getByText("Content One")).toBeInTheDocument();
  });

  it("switches content on tab click", () => {
    const onChange = vi.fn();
    render(<Tabs items={items} onChange={onChange} />);
    fireEvent.click(screen.getByRole("tab", { name: "Tab Two" }));
    expect(screen.getByText("Content Two")).toBeInTheDocument();
    expect(onChange).toHaveBeenCalledWith("tab2");
  });

  it("marks active tab", () => {
    render(<Tabs items={items} defaultActiveKey="tab2" />);
    expect(screen.getByRole("tab", { name: "Tab Two" })).toHaveAttribute(
      "aria-selected",
      "true"
    );
  });
});
