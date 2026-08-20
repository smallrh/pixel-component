import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import QRCode from "./QRCode";
import { generateQRCodeMatrix } from "./qr";

describe("QRCode", () => {
  it("renders an svg with aria-label", () => {
    render(<QRCode value="hello" />);
    expect(screen.getByRole("img", { name: "QR code: hello" })).toBeInTheDocument();
  });

  it("produces different patterns for different values", () => {
    const a = generateQRCodeMatrix("hello");
    const b = generateQRCodeMatrix("world");
    // 两个不同输入不应产生完全相同的矩阵（若相同则存在碰撞）
    const flatA = a.flat().join("");
    const flatB = b.flat().join("");
    expect(flatA).not.toBe(flatB);
  });

  it("produces identical patterns for identical values (deterministic)", () => {
    const a = generateQRCodeMatrix("deterministic-test");
    const b = generateQRCodeMatrix("deterministic-test");
    expect(a).toEqual(b);
  });

  it("has a valid QR structure: finder patterns at the three corners", () => {
    const cells = generateQRCodeMatrix("pixel-ui");
    const size = cells.length;
    expect(size).toBeGreaterThanOrEqual(21);
    // 左上 finder：7×7 实心外框（角点应为暗模块）
    expect(cells[0][0]).toBe(true);
    expect(cells[0][6]).toBe(true);
    expect(cells[6][0]).toBe(true);
    // 右上 / 左下 finder 角点
    expect(cells[0][size - 7]).toBe(true);
    expect(cells[size - 7][0]).toBe(true);
  });

  it("supports custom size and colors", () => {
    const { container } = render(<QRCode value="x" size={128} color="#ff0000" />);
    const svg = container.querySelector("svg");
    expect(svg).not.toBeNull();
    expect(svg?.getAttribute("width")).toBe("126"); // 128 向下取整到模块整数倍
  });
});
