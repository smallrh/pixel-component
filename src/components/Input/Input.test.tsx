import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import LocaleProvider from "../LocaleProvider";
import Input from "./Input";

describe("Input", () => {
  it("renders a text input", () => {
    render(<Input placeholder="Type here" />);
    const input = screen.getByPlaceholderText("Type here");
    expect(input).toHaveClass("pixel-input");
  });

  it("applies variant/size classes", () => {
    render(<Input variant="filled" size="lg" />);
    expect(screen.getByRole("textbox")).toHaveClass(
      "pixel-input",
      "pixel-input--filled",
      "pixel-input--lg"
    );
  });

  it("fires onChange with the new value", () => {
    const onChange = vi.fn();
    render(<Input onChange={onChange} />);
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "hello" } });
    const event = onChange.mock.calls[0][0];
    expect(event.target.value).toBe("hello");
  });

  describe("Input.TextArea", () => {
    it("renders a textarea", () => {
      render(<Input.TextArea placeholder="Desc" />);
      expect(screen.getByPlaceholderText("Desc").tagName).toBe("TEXTAREA");
    });
  });

  describe("Input.Password", () => {
    it("toggles password visibility", () => {
      render(
        <LocaleProvider>
          <Input.Password placeholder="pass" />
        </LocaleProvider>
      );
      const input = screen.getByPlaceholderText("pass");
      expect(input).toHaveAttribute("type", "password");
      fireEvent.click(screen.getByRole("button"));
      expect(input).toHaveAttribute("type", "text");
    });
  });

  describe("Input.Search", () => {
    it("fires onSearch with current value", async () => {
      const onSearch = vi.fn();
      render(
        <LocaleProvider>
          <Input.Search placeholder="search" onSearch={onSearch} />
        </LocaleProvider>
      );
      const input = screen.getByPlaceholderText("search");
      fireEvent.change(input, { target: { value: "pixel" } });
      fireEvent.click(screen.getByRole("button"));
      expect(onSearch).toHaveBeenCalledWith("pixel");
    });
  });
});
