import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { useState } from "react";
import type { ReactElement } from "react";
import Tabs from "./Tabs";

const items = [
  { key: "tab1", label: "Tab One", children: "Content One" },
  { key: "tab2", label: "Tab Two", children: "Content Two" },
  { key: "tab3", label: "Tab Three", disabled: true, children: "Content Three" },
];

describe("Tabs", () => {
  it("shows first tab content by default", () => {
    render(<Tabs items={items} />);
    expect(screen.getByText("Content One")).toBeInTheDocument();
  });

  it("switches content on tab click (uncontrolled)", () => {
    const onChange = vi.fn();
    render(<Tabs items={items} onChange={onChange} />);
    fireEvent.click(screen.getByRole("tab", { name: "Tab Two" }));
    expect(screen.getByText("Content Two")).toBeInTheDocument();
    expect(onChange).toHaveBeenCalledWith("tab2");
  });

  it("marks active tab via defaultActiveKey", () => {
    render(<Tabs items={items} defaultActiveKey="tab2" />);
    expect(screen.getByRole("tab", { name: "Tab Two" })).toHaveAttribute(
      "aria-selected",
      "true"
    );
  });

  // ── 受控模式验证：activeKey + onChange 双向同步 ──
  it("controlled: respects external activeKey and does not switch on its own", () => {
    // 外部始终把 activeKey 设为 tab1，点击 tab2 不应显示 Content Two
    const onChange = vi.fn();
    render(<Tabs items={items} activeKey="tab1" onChange={onChange} />);
    fireEvent.click(screen.getByRole("tab", { name: "Tab Two" }));
    // 受控模式：内容仍为 tab1（外部未回写）
    expect(screen.getByText("Content One")).toBeInTheDocument();
    // 但 onChange 回调应触发，通知外部更新
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith("tab2");
  });

  it("controlled: skips onChange when clicking already-active key", () => {
    const onChange = vi.fn();
    render(<Tabs items={items} activeKey="tab1" onChange={onChange} />);
    fireEvent.click(screen.getByRole("tab", { name: "Tab One" }));
    // same-value，不应触发 onChange（避免状态回写震荡，经验 732077）
    expect(onChange).not.toHaveBeenCalled();
  });

  it("controlled: skips onChange for disabled tab", () => {
    const onChange = vi.fn();
    render(<Tabs items={items} activeKey="tab1" onChange={onChange} />);
    fireEvent.click(screen.getByRole("tab", { name: "Tab Three" }));
    expect(onChange).not.toHaveBeenCalled();
    expect(screen.getByText("Content One")).toBeInTheDocument();
  });

  it("controlled: two-way sync pattern (external useState)", () => {
    // 模拟真实场景：外部 useState + activeKey + onChange 同步
    function Host(): ReactElement {
      const [active, setActive] = useState("tab1");
      return (
        <Tabs
          items={items}
          activeKey={active}
          onChange={(k) => setActive(k)}
        />
      );
    }
    render(<Host />);
    expect(screen.getByText("Content One")).toBeInTheDocument();
    // 点击 Tab Two → 外部 setActive → 重新渲染 → 显示 Content Two
    fireEvent.click(screen.getByRole("tab", { name: "Tab Two" }));
    expect(screen.getByText("Content Two")).toBeInTheDocument();
    // 再点回 Tab One
    fireEvent.click(screen.getByRole("tab", { name: "Tab One" }));
    expect(screen.getByText("Content One")).toBeInTheDocument();
    // 反复切换不应报错或不更新（检测状态震荡/卡死）
    fireEvent.click(screen.getByRole("tab", { name: "Tab Two" }));
    fireEvent.click(screen.getByRole("tab", { name: "Tab One" }));
    fireEvent.click(screen.getByRole("tab", { name: "Tab Two" }));
    expect(screen.getByText("Content Two")).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Tab Two" })).toHaveAttribute("aria-selected", "true");
  });
});
