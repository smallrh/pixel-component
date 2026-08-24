import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { useState } from "react";
import ErrorBoundary from "./ErrorBoundary";

// React 在捕获渲染错误时会向 console.error 输出大量噪音，
// 测试期间用 spy 静音并在每个用例后恢复。
let errorSpy: ReturnType<typeof vi.spyOn>;

beforeEach(() => {
  errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  errorSpy.mockRestore();
});

/** 主动抛错的子组件：errorProp 为真时在渲染阶段抛出 */
function Bomb({ shouldThrow }: { shouldThrow: boolean }) {
  if (shouldThrow) throw new Error("BOOM");
  return <div data-testid="safe">SAFE</div>;
}

describe("ErrorBoundary", () => {
  it("renders children when no error", () => {
    render(
      <ErrorBoundary>
        <Bomb shouldThrow={false} />
      </ErrorBoundary>
    );
    expect(screen.getByTestId("safe")).toHaveTextContent("SAFE");
    // 未进入错误态时不渲染崩溃屏
    expect(screen.queryByText("SOMETHING WENT WRONG")).not.toBeInTheDocument();
  });

  it("catches render error and shows built-in fallback", () => {
    render(
      <ErrorBoundary>
        <Bomb shouldThrow={true} />
      </ErrorBoundary>
    );
    expect(screen.getByText("SOMETHING WENT WRONG")).toBeInTheDocument();
    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByText("BOOM")).toBeInTheDocument();
    // 安全内容不应出现
    expect(screen.queryByTestId("safe")).not.toBeInTheDocument();
  });

  it("renders static fallback node when provided", () => {
    render(
      <ErrorBoundary fallback={<div data-testid="custom">CUSTOM</div>}>
        <Bomb shouldThrow={true} />
      </ErrorBoundary>
    );
    expect(screen.getByTestId("custom")).toHaveTextContent("CUSTOM");
    expect(screen.queryByText("SOMETHING WENT WRONG")).not.toBeInTheDocument();
  });

  it("renders fallback render-prop with error and reset", () => {
    render(
      <ErrorBoundary
        fallback={(error, reset) => (
          <div>
            <span data-testid="msg">{error.message}</span>
            <button data-testid="recover" onClick={reset}>
              RECOVER
            </button>
          </div>
        )}
      >
        <Bomb shouldThrow={true} />
      </ErrorBoundary>
    );
    expect(screen.getByTestId("msg")).toHaveTextContent("BOOM");
    // 点击 reset 后错误态清除，但因 Bomb 仍 shouldThrow 会再次报错
    // —— 这里只验证 reset 被调用后重新渲染 children 的行为
    fireEvent.click(screen.getByTestId("recover"));
    // Bomb 仍抛错，应再次进入 fallback（render-prop 重新执行）
    expect(screen.getByTestId("msg")).toHaveTextContent("BOOM");
  });

  it("calls onError with error and error info", () => {
    const onError = vi.fn();
    render(
      <ErrorBoundary onError={onError}>
        <Bomb shouldThrow={true} />
      </ErrorBoundary>
    );
    expect(onError).toHaveBeenCalledTimes(1);
    const [error, info] = onError.mock.calls[0];
    expect(error).toBeInstanceOf(Error);
    expect(error.message).toBe("BOOM");
    // ErrorInfo 至少包含 componentStack（React 保证）
    expect(info).toHaveProperty("componentStack");
    expect(typeof info.componentStack).toBe("string");
  });

  it("recovers automatically when resetKeys change", () => {
    // 场景：路由切换等外部变化导致 resetKeys 变化 → 自动清除错误态
    // 初始 shouldThrow=true → 崩溃；rerender 改 resetKeys + shouldThrow=false → 恢复
    const { rerender } = render(
      <ErrorBoundary resetKeys={["page-a"]}>
        <Bomb shouldThrow={true} />
      </ErrorBoundary>
    );
    expect(screen.getByText("SOMETHING WENT WRONG")).toBeInTheDocument();

    // 模拟外部条件变化：resetKeys 改变 + Bomb 不再抛错
    rerender(
      <ErrorBoundary resetKeys={["page-b"]}>
        <Bomb shouldThrow={false} />
      </ErrorBoundary>
    );
    // componentDidUpdate 检测到 resetKeys 变化 → reset → 清 error → 渲染 SAFE
    expect(screen.getByTestId("safe")).toHaveTextContent("SAFE");
    expect(screen.queryByText("SOMETHING WENT WRONG")).not.toBeInTheDocument();
  });

  it("recovers via RETRY button and calls onReset", () => {
    const onReset = vi.fn();
    function Harness() {
      const [shouldThrow, setShouldThrow] = useState(true);
      return (
        <ErrorBoundary
          onReset={() => {
            onReset();
            setShouldThrow(false);
          }}
        >
          <Bomb shouldThrow={shouldThrow} />
        </ErrorBoundary>
      );
    }
    render(<Harness />);

    expect(screen.getByText("SOMETHING WENT WRONG")).toBeInTheDocument();
    fireEvent.click(screen.getByText("RETRY"));
    expect(onReset).toHaveBeenCalledTimes(1);
    // onReset 把 shouldThrow 设为 false → 恢复后渲染 SAFE
    expect(screen.getByTestId("safe")).toHaveTextContent("SAFE");
  });

  it("applies custom className to built-in fallback", () => {
    render(
      <ErrorBoundary className="my-boundary">
        <Bomb shouldThrow={true} />
      </ErrorBoundary>
    );
    const alert = screen.getByRole("alert");
    expect(alert).toHaveClass("pixel-error-boundary", "my-boundary");
  });
});
