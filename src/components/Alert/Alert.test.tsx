import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Alert from "./Alert";

describe("Alert", () => {
  it("renders message", () => {
    render(<Alert message="Network error" />);
    expect(screen.getByText("Network error")).toBeInTheDocument();
  });

  it("renders description", () => {
    render(<Alert message="Oops" description="Something went wrong" />);
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
  });

  it("applies type class", () => {
    render(<Alert message="Hi" type="success" />);
    expect(screen.getByText("Hi").parentElement?.parentElement).toHaveClass(
      "pixel-alert--success"
    );
  });

  it("disappears when closed", () => {
    render(<Alert message="Temporary" closable />);
    fireEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(screen.queryByText("Temporary")).not.toBeInTheDocument();
  });

  it("hides close button when not closable", () => {
    render(<Alert message="Fixed" />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});
