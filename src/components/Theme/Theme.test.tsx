import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { render } from "@testing-library/react";
import ConfigProvider from "../ConfigProvider";
import Theme from "./Theme";

describe("Theme / ConfigProvider 主题系统", () => {
  it("writes theme tokens as CSS variables on ConfigProvider", () => {
    const { container } = render(
      <ConfigProvider theme={{ primaryColor: "#ff0000", fontFamily: "monospace" }}>
        <div />
      </ConfigProvider>
    );
    const el = container.firstElementChild as HTMLElement;
    expect(el.style.getPropertyValue("--pixel-color-primary")).toBe("#ff0000");
    expect(el.style.getPropertyValue("--pixel-font-family")).toBe("monospace");
    expect(el.style.getPropertyValue("--pixel-border-radius")).toBe("0px");
  });

  it("Theme inherits ConfigProvider tokens and applies local overrides", () => {
    const { container } = render(
      <ConfigProvider theme={{ primaryColor: "#ff0000" }}>
        <Theme tokens={{ colorText: "#123456" }}>
          <button className="pixel-btn" />
        </Theme>
      </ConfigProvider>
    );
    const el = container.firstElementChild?.firstElementChild as HTMLElement;
    expect(el.style.getPropertyValue("--pixel-color-primary")).toBe("#ff0000");
    expect(el.style.getPropertyValue("--pixel-color-text")).toBe("#123456");
  });

  it("global.css declares default values for all theme variables", () => {
    const css = readFileSync(join(__dirname, "../../styles/global.css"), "utf8");
    for (const v of [
      "--pixel-color-primary",
      "--pixel-color-bg",
      "--pixel-color-text",
      "--pixel-border-radius",
      "--pixel-font-family",
      "--pixel-spacing",
      "--pixel-font",
    ]) {
      expect(css).toContain(v);
    }
  });
});
