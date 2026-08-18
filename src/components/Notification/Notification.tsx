import { useEffect, useState } from "react";
import clsx from "clsx";

export interface NotificationConfig {
  message: string;
  description?: string;
  type?: "info" | "success" | "error" | "warning";
  duration?: number;
}

export interface NotificationItem extends NotificationConfig {
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

export function notification(config: NotificationConfig) {
  push(config);
}

/* ===== Hook：订阅同一份全局状态 ===== */

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
  items: NotificationItem[];
  onRemove: (id: number) => void;
}

export function NotificationContainer({
  items,
  onRemove,
}: NotificationContainerProps) {
  return (
    <div className="pixel-notification-container" role="status" aria-live="polite">
      {items.map((item) => (
        <NotificationItem
          key={item.id}
          {...item}
          onClose={() => onRemove(item.id)}
        />
      ))}
    </div>
  );
}

function NotificationItem({
  message,
  description,
  type = "info",
  duration,
  onClose,
}: NotificationConfig & { onClose: () => void }) {
  useEffect(() => {
    if (duration) {
      const timer = setTimeout(onClose, duration * 1000);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  return (
    <div className={clsx("pixel-notification", `pixel-notification--${type}`)}>
      <div className="pixel-notification-header">
        <span className="pixel-notification-title">{message}</span>
        <button
          type="button"
          className="pixel-notification-close"
          onClick={onClose}
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
