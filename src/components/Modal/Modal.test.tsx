import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Modal from "./Modal";
import Button from "../Button";

describe("Modal", () => {
  it("renders nothing when closed", () => {
    render(
      <Modal open={false} onClose={() => {}} title="Hello">
        Body
      </Modal>
    );
    expect(screen.queryByText("Body")).not.toBeInTheDocument();
  });

  it("renders content and title when open", () => {
    render(
      <Modal open onClose={() => {}} title="Hello">
        Modal Body
      </Modal>
    );
    expect(screen.getByText("Hello")).toBeInTheDocument();
    expect(screen.getByText("Modal Body")).toBeInTheDocument();
  });

  it("calls onClose when clicking close button", () => {
    const onClose = vi.fn();
    render(
      <Modal open onClose={onClose} title="T">
        Body
      </Modal>
    );
    fireEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose on Escape key", () => {
    const onClose = vi.fn();
    render(
      <Modal open onClose={onClose}>
        Body
      </Modal>
    );
    fireEvent.keyDown(window, { key: "Escape" });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("renders into document.body via portal", () => {
    render(
      <Modal open onClose={() => {}}>
        Portaled
      </Modal>
    );
    expect(document.body).toContainElement(screen.getByText("Portaled"));
  });
});
