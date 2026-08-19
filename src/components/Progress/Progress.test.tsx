import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Progress from "./Progress";

describe("Progress", () => {
  it("renders percent text", () => {
    render(<Progress percent={50} />);
    expect(screen.getByText("50%")).toBeInTheDocument();
  });

  it("clamps percent to 0-100", () => {
    render(<Progress percent={150} />);
    expect(screen.getByText("100%")).toBeInTheDocument();
    expect(screen.getByText("0%")).toBeInTheDocument();
  });
});
