import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Checkbox from "./Checkbox";

describe("Checkbox", () => {
  it("renders checked state", () => {
    render(<Checkbox checked>Option</Checkbox>);
    const input = screen.getByRole("checkbox");
    expect(input).toBeChecked();
    expect(screen.getByText("Option")).toBeInTheDocument();
  });

  it("fires onChange with checked boolean", () => {
    const onChange = vi.fn();
    render(<Checkbox onChange={onChange}>Opt</Checkbox>);
    fireEvent.click(screen.getByRole("checkbox"));
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it("respects disabled", () => {
    render(<Checkbox disabled>Opt</Checkbox>);
    expect(screen.getByRole("checkbox")).toBeDisabled();
  });
});
