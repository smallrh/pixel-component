import { useEffect, useState } from "react";
import clsx from "clsx";

export interface MessageConfig {
  content: string;
  type?: "info" | "success" | "error" | "warning";
  duration?: number;
}

export interface MessageItem extends MessageConfig {
  id: number;
  visible: boolean;
}

/* ===== 模块级单例 store：任意位置调用 message() 都安全 ===== */

let nextId = 1;
let items: MessageItem[] = [];
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((fn) => fn());
}

function push(config: MessageConfig) {
  items = [...items, { ...config, id: nextId++, visible: true }];
  notify();
}

function remove(id: number) {
  items = items.filter((i) => i.id !== id);
  notify();
}

export function message(config: MessageConfig) {
  push(config);
}

/* ===== Hook：订阅同一份全局状态 ===== */

export function useMessage() {
  const [snapshot, setSnapshot] = useState<MessageItem[]>(items);

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
    // 便捷方法：useMessage().push(...) 等价于 message(...)
    push,
  };
}

export interface MessageContainerProps {
  items: MessageItem[];
  onRemove: (id: number) => void;
}

export function MessageContainer({ items, onRemove }: MessageContainerProps) {
  return (
    <div className="pixel-message-container" role="status" aria-live="polite">
      {items.map((item) => (
        <MessageItem key={item.id} {...item} onDone={() => onRemove(item.id)} />
      ))}
    </div>
  );
}

function MessageItem({
  content,
  type = "info",
  duration = 3,
  onDone,
}: MessageConfig & { onDone: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onDone, duration * 1000);
    return () => clearTimeout(timer);
  }, [duration, onDone]);

  return (
    <div className={clsx("pixel-message", `pixel-message--${type}`)}>
      {content}
    </div>
  );
}
