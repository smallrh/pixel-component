import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Select, { type SelectOption } from "./Select";

const options: SelectOption[] = [
  { label: "Apple", value: "apple" },
  { label: "Banana", value: "banana" },
  { label: "Cherry", value: "cherry" },
];

describe("Select", () => {
  it("shows placeholder when no value", () => {
    render(<Select options={options} placeholder="Pick one" />);
    expect(screen.getByText("Pick one")).toBeInTheDocument();
  });

  it("shows selected label", () => {
    render(<Select options={options} value="banana" />);
    expect(screen.getByText("Banana")).toBeInTheDocument();
  });

  it("opens dropdown on click and selects an option", () => {
    const onChange = vi.fn();
    render(<Select options={options} onChange={onChange} />);
    fireEvent.click(screen.getByRole("combobox"));
    expect(screen.getByText("Cherry")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Cherry"));
    expect(onChange).toHaveBeenCalledWith("cherry");
  });

  it("supports keyboard navigation and enter to select", () => {
    const onChange = vi.fn();
    render(<Select options={options} onChange={onChange} />);
    const trigger = screen.getByRole("combobox");
    // 打开
    fireEvent.keyDown(trigger, { key: "ArrowDown" });
    expect(screen.getByText("Apple")).toBeInTheDocument();
    // 下移到 Banana，回车选中
    fireEvent.keyDown(trigger, { key: "ArrowDown" });
    fireEvent.keyDown(trigger, { key: "Enter" });
    expect(onChange).toHaveBeenCalledWith("banana");
  });

  it("closes on Escape", () => {
    render(<Select options={options} />);
    const trigger = screen.getByRole("combobox");
    fireEvent.keyDown(trigger, { key: "ArrowDown" });
    expect(screen.getByText("Apple")).toBeInTheDocument();
    fireEvent.keyDown(trigger, { key: "Escape" });
    expect(screen.queryByText("Banana")).not.toBeInTheDocument();
  });

  it("respects disabled", () => {
    render(<Select options={options} disabled />);
    const trigger = screen.getByRole("combobox");
    expect(trigger).toHaveAttribute("aria-disabled", "true");
    fireEvent.click(trigger);
    expect(screen.queryByText("Apple")).not.toBeInTheDocument();
  });
});
