import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Drawer from "./Drawer";

describe("Drawer", () => {
  it("renders nothing when closed", () => {
    render(<Drawer open={false} onClose={() => {}}>Body</Drawer>);
    expect(screen.queryByText("Body")).not.toBeInTheDocument();
  });

  it("renders content when open", () => {
    render(<Drawer open onClose={() => {}} title="Drawer Title">Content</Drawer>);
    expect(screen.getByText("Drawer Title")).toBeInTheDocument();
    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  it("applies placement class", () => {
    render(<Drawer open onClose={() => {}} placement="left">L</Drawer>);
    expect(screen.getByText("L").parentElement).toHaveClass("pixel-drawer--left");
  });

  it("calls onClose on close button", () => {
    const onClose = vi.fn();
    render(<Drawer open onClose={onClose}>Content</Drawer>);
    fireEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("renders into body via portal", () => {
    render(<Drawer open onClose={() => {}}>Portaled</Drawer>);
    expect(document.body).toContainElement(screen.getByText("Portaled"));
  });
});
