import { useEffect, useState } from "react";
import clsx from "clsx";
import "./Message.css";

interface MessageConfig {
  content: string;
  type?: "info" | "success" | "error" | "warning";
  duration?: number;
}

let messageQueue: MessageConfig[] = [];
let listeners: Array<() => void> = [];

function emit() {
  listeners.forEach((fn) => fn());
}

export function message(config: MessageConfig) {
  messageQueue.push(config);
  emit();
}

// Singleton render hook
export  function useMessage() {
  const [items, setItems] = useState<
    (MessageConfig & { id: number; visible: boolean })[]
  >([]);

  useEffect(() => {
    const fn = () => {
      const copy = [...messageQueue];
      messageQueue = [];
      if (copy.length > 0) {
        setItems((prev) => [
          ...prev,
          ...copy.map((c, i) => ({
            ...c,
            id: Date.now() + i,
            visible: true,
          })),
        ]);
      }
    };
    listeners.push(fn);
    return () => {
      listeners = listeners.filter((l) => l !== fn);
    };
  }, []);

  const remove = (id: number) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  return { items, remove };
}

interface MessageContainerProps {
  items: (MessageConfig & { id: number; visible: boolean })[];
  onRemove: (id: number) => void;
}

export function MessageContainer({ items, onRemove }: MessageContainerProps) {
  return (
    <div className="pixel-message-container">
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