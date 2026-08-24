import { describe, it, expect, vi } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { message, useMessage, MessageContainer } from "./Message";

describe("Message singleton", () => {
  it("displays a message pushed before mount (no message loss)", () => {
    // 挂载前调用
    message({ content: "early", duration: 999 });

    const Harness = () => {
      const { items, remove } = useMessage();
      return <MessageContainer items={items} onRemove={remove} />;
    };
    render(<Harness />);
    expect(screen.getByText("early")).toBeInTheDocument();
  });

  it("supports multiple messages from multiple subscribers without loss", () => {
    const Harness = () => {
      const { items, remove } = useMessage();
      return <MessageContainer items={items} onRemove={remove} />;
    };
    render(<Harness />);
    act(() => {
      message({ content: "one", duration: 999 });
      message({ content: "two", duration: 999 });
    });
    expect(screen.getByText("one")).toBeInTheDocument();
    expect(screen.getByText("two")).toBeInTheDocument();
  });

  it("auto-removes after duration", () => {
    vi.useFakeTimers();
    const Harness = () => {
      const { items, remove } = useMessage();
      return <MessageContainer items={items} onRemove={remove} />;
    };
    render(<Harness />);
    act(() => {
      message({ content: "temp", duration: 1 });
    });
    expect(screen.getByText("temp")).toBeInTheDocument();
    // 第一步：推进 1s 展示时间 → 触发 setClosing(true)，注册第二个淡出定时器
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    // 第二步：推进 > 240ms closing 淡出阶段 → 真正 remove
    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(screen.queryByText("temp")).not.toBeInTheDocument();
    vi.useRealTimers();
  });

  it("applies type class", () => {
    const Harness = () => {
      const { items, remove } = useMessage();
      return <MessageContainer items={items} onRemove={remove} />;
    };
    render(<Harness />);
    act(() => {
      message({ content: "err", type: "error", duration: 999 });
    });
    expect(screen.getByText("err")).toHaveClass("pixel-message--error");
  });
});
