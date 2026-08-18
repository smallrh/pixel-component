import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Rate from "./Rate";

describe("Rate", () => {
  it("renders `count` stars (default 5)", () => {
    const { container } = render(<Rate />);
    expect(container.querySelectorAll(".pixel-rate-star")).toHaveLength(5);
  });

  it("reflects defaultValue in the value display", () => {
    render(<Rate defaultValue={2} />);
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("calls onChange with star index + 1 on click and updates uncontrolled value", () => {
    const onChange = vi.fn();
    const { container } = render(<Rate onChange={onChange} />);
    const stars = container.querySelectorAll(".pixel-rate-star");
    fireEvent.click(stars[2]); // 第 3 颗星
    expect(onChange).toHaveBeenCalledWith(3);
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("allows clearing by clicking the same star again when allowClear is on", () => {
    const onChange = vi.fn();
    const { container } = render(<Rate defaultValue={3} onChange={onChange} />);
    const stars = container.querySelectorAll(".pixel-rate-star");
    fireEvent.click(stars[2]);
    expect(onChange).toHaveBeenCalledWith(0);
  });

  it("does not change when disabled", () => {
    const onChange = vi.fn();
    const { container } = render(<Rate disabled onChange={onChange} />);
    const stars = container.querySelectorAll(".pixel-rate-star");
    fireEvent.click(stars[1]);
    expect(onChange).not.toHaveBeenCalled();
  });

  it("respects controlled value (internal state frozen)", () => {
    const onChange = vi.fn();
    const { container } = render(<Rate value={4} onChange={onChange} />);
    expect(screen.getByText("4")).toBeInTheDocument();
    const stars = container.querySelectorAll(".pixel-rate-star");
    fireEvent.click(stars[0]);
    expect(onChange).toHaveBeenCalledWith(1);
    // 受控模式下内部值不变，仍显示 4
    expect(screen.getByText("4")).toBeInTheDocument();
  });
});
