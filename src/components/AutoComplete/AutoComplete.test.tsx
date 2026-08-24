import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import AutoComplete from "./AutoComplete";

describe("AutoComplete", () => {
  it("filters options based on typed input", () => {
    render(<AutoComplete options={["Apple", "Banana", "Avocado"]} />);
    fireEvent.focus(screen.getByRole("combobox"));
    fireEvent.change(screen.getByRole("combobox"), { target: { value: "Ap" } });
    expect(screen.getByText("Apple")).toBeInTheDocument();
    expect(screen.queryByText("Banana")).not.toBeInTheDocument();
    expect(screen.queryByText("Avocado")).not.toBeInTheDocument();
  });

  it("selects an option on click", () => {
    const onChange = vi.fn();
    render(<AutoComplete options={["Apple", "Banana"]} onChange={onChange} />);
    fireEvent.focus(screen.getByRole("combobox"));
    fireEvent.click(screen.getByText("Apple"));
    expect(onChange).toHaveBeenCalledWith("Apple");
  });

  it("syncs controlled value from outside", () => {
    const { rerender } = render(<AutoComplete options={["Apple"]} value="A" />);
    expect(screen.getByRole("combobox")).toHaveValue("A");
    rerender(<AutoComplete options={["Apple"]} value="Apple" />);
    expect(screen.getByRole("combobox")).toHaveValue("Apple");
  });
});
