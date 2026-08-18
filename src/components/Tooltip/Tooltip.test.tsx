import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import Tooltip from "./Tooltip";

describe("Tooltip", () => {
  it("renders its children", () => {
    render(
      <Tooltip title="Hi">
        <button>Hover me</button>
      </Tooltip>
    );
    expect(screen.getByText("Hover me")).toBeInTheDocument();
  });

  it("shows tooltip content on mouse enter", () => {
    const { container } = render(
      <Tooltip title="Tip text">
        <span>Trigger</span>
      </Tooltip>
    );
    const wrap = container.querySelector(".pixel-tooltip") as HTMLElement;
    fireEvent.mouseOver(wrap);
    expect(screen.getByRole("tooltip")).toHaveTextContent("Tip text");
  });

  it("shows tooltip content on focus", () => {
    const { container } = render(
      <Tooltip title="Focus tip">
        <button>Focus me</button>
      </Tooltip>
    );
    const wrap = container.querySelector(".pixel-tooltip") as HTMLElement;
    fireEvent.focus(wrap);
    expect(screen.getByRole("tooltip")).toHaveTextContent("Focus tip");
  });

  it("applies the placement class", () => {
    const { container } = render(
      <Tooltip title="T" placement="bottom">
        <span>x</span>
      </Tooltip>
    );
    const wrap = container.querySelector(".pixel-tooltip") as HTMLElement;
    fireEvent.mouseOver(wrap);
    expect(screen.getByRole("tooltip")).toHaveClass("pixel-tooltip--bottom");
  });

  it("hides after mouse leave (debounced 100ms)", () => {
    vi.useFakeTimers();
    const { container } = render(
      <Tooltip title="T">
        <span>x</span>
      </Tooltip>
    );
    const wrap = container.querySelector(".pixel-tooltip") as HTMLElement;
    fireEvent.mouseOver(wrap);
    expect(screen.getByRole("tooltip")).toBeInTheDocument();
    fireEvent.mouseOut(wrap);
    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    vi.useRealTimers();
  });
});
