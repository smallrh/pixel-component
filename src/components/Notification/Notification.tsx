import { useEffect, useState } from "react";
import clsx from "clsx";
import "./Notification.css";

/** 退出过渡时长（毫秒），与全局 --pixel-transition-slow 同步 */
const CLOSE_ANIM_MS = 240;

export interface NotificationConfig {
  /** 通知标题 */
  message: string;
  /** 通知描述内容 */
  description?: string;
  /** 通知类型，默认 "info" */
  type?: "info" | "success" | "error" | "warning";
  /** 自动关闭时长（秒），不传则不自动关闭；传 0 也视为不自动关闭 */
  duration?: number;
}

/** 单条通知项：在 NotificationConfig 基础上附带运行时唯一 id */
export interface NotificationItem extends NotificationConfig {
  /** 运行时生成的唯一标识，用于列表渲染与移除 */
  id: number;
}

/* ===== 模块级单例 store：任意位置调用 notification() 都安全 ===== */

let nextId = 1;
let items: NotificationItem[] = [];
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((fn) => fn());
}

function push(config: NotificationConfig) {
  items = [...items, { ...config, id: nextId++ }];
  notify();
}

function remove(id: number) {
  items = items.filter((i) => i.id !== id);
  notify();
}

/**
 * notification 通知。命令式调用：向全局单例 store 推入一条通知，由挂载的容器渲染。
 * 关键特性：模块级单例，任意位置调用安全；支持自动关闭与手动移除。
 */
export function notification(config: NotificationConfig) {
  push(config);
}

/* ===== Hook：订阅同一份全局状态 ===== */

/**
 * useNotification Hook。订阅全局通知 store，返回当前通知列表与 push/remove 操作。
 * 关键特性：组件卸载时自动取消订阅，避免内存泄漏。
 */
export function useNotification() {
  const [snapshot, setSnapshot] = useState<NotificationItem[]>(items);

  useEffect(() => {
    const fn = () => setSnapshot(items);
    listeners.add(fn);
    return () => {
      listeners.delete(fn);
    };
  }, []);

  return {
    items: snapshot,
    remove,
    push,
  };
}

export interface NotificationContainerProps {
  /** 当前展示的通知列表 */
  items: NotificationItem[];
  /** 移除某条通知的回调，参数为通知 id */
  onRemove: (id: number) => void;
}

/**
 * NotificationContainer 通知容器。渲染通知列表，aria-live 保证可访问性。
 * 关键特性：每条通知按 duration 先进入 closing 淡出再移除。
 */
export function NotificationContainer({
  items,
  onRemove,
}: NotificationContainerProps) {
  return (
    <div className="pixel-notification-container" role="status" aria-live="polite">
      {items.map((item) => (
        <NotificationInner
          key={item.id}
          {...item}
          onClose={() => onRemove(item.id)}
        />
      ))}
    </div>
  );
}

/** 单条通知：关闭按钮 / duration 到期 → 进入 closing 淡出 → 真正从列表移除 */
function NotificationInner({
  message,
  description,
  type = "info",
  duration,
  onClose,
}: NotificationConfig & { onClose: () => void }) {
  const [closing, setClosing] = useState(false);

  // 自动关闭：仅当 duration > 0 时生效（保持"不传则不自动关闭"的原语义）
  useEffect(() => {
    if (typeof duration === "number" && duration > 0) {
      const timer = setTimeout(() => setClosing(true), duration * 1000);
      return () => clearTimeout(timer);
    }
  }, [duration]);

  // closing 阶段结束后真正通知外层移除
  useEffect(() => {
    if (closing) {
      const timer = setTimeout(onClose, CLOSE_ANIM_MS);
      return () => clearTimeout(timer);
    }
  }, [closing, onClose]);

  const handleManualClose = () => {
    if (!closing) setClosing(true);
  };

  return (
    <div
      className={clsx(
        "pixel-notification",
        `pixel-notification--${type}`,
        closing && "pixel-notification--closing"
      )}
    >
      <div className="pixel-notification-header">
        <span className="pixel-notification-title">{message}</span>
        <button
          type="button"
          className="pixel-notification-close"
          onClick={handleManualClose}
          aria-label="Close"
        >
          ✕
        </button>
      </div>
      {description && (
        <div className="pixel-notification-desc">{description}</div>
      )}
    </div>
  );
}
