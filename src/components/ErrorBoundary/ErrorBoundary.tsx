import { Component, type CSSProperties, type ErrorInfo, type ReactNode } from "react";
import clsx from "clsx";
import "./ErrorBoundary.css";

export interface ErrorBoundaryProps {
  /** 被捕获错误的子树 */
  children: ReactNode;
  /** 发生错误时的渲染内容；未传则渲染内置像素风崩溃屏 */
  fallback?: ReactNode | ((error: Error, reset: () => void) => ReactNode);
  /** 错误回调（用于日志上报 / Sentry 等） */
  onError?: (error: Error, info: ErrorInfo) => void;
  /** 重置回调（点击重试时额外触发） */
  onReset?: () => void;
  /**
   * 重置依赖数组：任意元素引用变化时自动清除错误态。
   * 用于"切换路由/数据后自动恢复"，参考 react-error-boundary。
   */
  resetKeys?: unknown[];
  /** 内置崩溃屏的附加样式类名 */
  className?: string;
  /** 内置崩溃屏的附加行内样式 */
  style?: CSSProperties;
}

interface State {
  error: Error | null;
}

/**
 * 错误边界：捕获子树渲染期间的 JS 错误，降级为 fallback UI，避免整页白屏。
 *
 * ```tsx
 * <ErrorBoundary onError={(e) => Sentry.captureException(e)}>
 *   <RiskyWidget />
 * </ErrorBoundary>
 * ```
 */
class ErrorBoundary extends Component<ErrorBoundaryProps, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    this.props.onError?.(error, info);
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps) {
    // resetKeys 任一元素变化 → 清除错误态（参考 react-error-boundary）
    if (this.state.error && prevProps.resetKeys) {
      const changed = prevProps.resetKeys?.some(
        (k, i) => k !== this.props.resetKeys?.[i]
      );
      if (changed) this.reset();
    }
  }

  reset = () => {
    this.props.onReset?.();
    this.setState({ error: null });
  };

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;

    const { fallback, className, style } = this.props;
    if (fallback !== undefined) {
      return typeof fallback === "function" ? fallback(error, this.reset) : fallback;
    }

    // 内置像素风崩溃屏
    return (
      <div className={clsx("pixel-error-boundary", className)} style={style} role="alert">
        <div className="pixel-error-boundary-icon">✕</div>
        <div className="pixel-error-boundary-title">SOMETHING WENT WRONG</div>
        <details className="pixel-error-boundary-details">
          <summary>ERROR DETAILS</summary>
          <pre className="pixel-error-boundary-stack">{error.message}</pre>
        </details>
        <button
          type="button"
          className="pixel-error-boundary-retry"
          onClick={this.reset}
        >
          RETRY
        </button>
      </div>
    );
  }
}

export default ErrorBoundary;
