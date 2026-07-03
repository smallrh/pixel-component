import { useEffect, useState } from "react";
import clsx from "clsx";
import "./Notification.css";

interface NotificationConfig {
  message: string;
  description?: string;
  type?: "info" | "success" | "error" | "warning";
  duration?: number;
}

let notifQueue: NotificationConfig[] = [];
let notifListeners: Array<() => void> = [];

function emit() {
  notifListeners.forEach((fn) => fn());
}

export function notification(config: NotificationConfig) {
  notifQueue.push(config);
  emit();
}

export function useNotification() {
  const [items, setItems] = useState<
    (NotificationConfig & { id: number })[]
  >([]);

  useEffect(() => {
    const fn = () => {
      const copy = [...notifQueue];
      notifQueue = [];
      if (copy.length > 0) {
        setItems((prev) => [
          ...prev,
          ...copy.map((c, i) => ({ ...c, id: Date.now() + i })),
        ]);
      }
    };
    notifListeners.push(fn);
    return () => {
      notifListeners = notifListeners.filter((l) => l !== fn);
    };
  }, []);

  const remove = (id: number) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  return { items, remove };
}

interface NotificationContainerProps {
  items: (NotificationConfig & { id: number })[];
  onRemove: (id: number) => void;
}

export function NotificationContainer({
  items,
  onRemove,
}: NotificationContainerProps) {
  return (
    <div className="pixel-notification-container">
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
        <button className="pixel-notification-close" onClick={onClose}>
          ✕
        </button>
      </div>
      {description && (
        <div className="pixel-notification-desc">{description}</div>
      )}
    </div>
  );
}