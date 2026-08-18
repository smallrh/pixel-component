import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Radio from "./Radio";

describe("Radio", () => {
  const options = [
    { label: "A", value: "a" },
    { label: "B", value: "b" },
  ];

  it("renders options", () => {
    render(<Radio options={options} />);
    expect(screen.getByLabelText("A")).toBeInTheDocument();
    expect(screen.getByLabelText("B")).toBeInTheDocument();
  });

  it("checks the selected value", () => {
    render(<Radio options={options} value="b" />);
    expect(screen.getByLabelText("B")).toBeChecked();
    expect(screen.getByLabelText("A")).not.toBeChecked();
  });

  it("fires onChange with option value", () => {
    const onChange = vi.fn();
    render(<Radio options={options} onChange={onChange} />);
    fireEvent.click(screen.getByLabelText("A"));
    expect(onChange).toHaveBeenCalledWith("a");
  });
});
