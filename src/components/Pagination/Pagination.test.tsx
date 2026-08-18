import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Pagination from "./Pagination";

describe("Pagination", () => {
  it("renders page numbers", () => {
    render(<Pagination current={1} total={50} />);
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("fires onChange on next", () => {
    const onChange = vi.fn();
    render(<Pagination current={2} total={50} onChange={onChange} />);
    fireEvent.click(screen.getByLabelText("Next page"));
    expect(onChange).toHaveBeenCalledWith(3);
  });

  it("disables prev on first page", () => {
    render(<Pagination current={1} total={50} />);
    expect(screen.getByLabelText("Previous page")).toBeDisabled();
  });

  it("shows total when showTotal", () => {
    render(<Pagination current={1} total={50} showTotal />);
    expect(screen.getByText(/Total 50 items/)).toBeInTheDocument();
  });
});
