import { useEffect, useState } from "react";
import clsx from "clsx";
import "./Message.css";

/** 退出过渡时长（毫秒），与全局 --pixel-transition-slow 同步（240ms steps(6)） */
const CLOSE_ANIM_MS = 240;

export interface MessageConfig {
  /** 文案内容 */
  content: string;
  /** 消息类型，默认 "info" */
  type?: "info" | "success" | "error" | "warning";
  /** 展示时长（秒），默认 5；传 0 则不自动关闭 */
  duration?: number;
}

export interface MessageItem extends MessageConfig {
  /** 唯一标识 */
  id: number;
  /** 是否可见（保留兼容字段） */
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

/**
 * message。向全局消息队列推入一条消息，可在任意位置命令式调用。
 */
export function message(config: MessageConfig) {
  push(config);
}

/* ===== Hook：订阅同一份全局状态 ===== */

/**
 * useMessage。订阅全局消息状态，返回当前消息列表与 push/remove 操作。
 */
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
  /** 待展示的消息列表 */
  items: MessageItem[];
  /** 移除指定 id 消息的回调 */
  onRemove: (id: number) => void;
}

/**
 * MessageContainer。消息容器，渲染全局消息列表，每条消息到时后先淡出再移除。
 */
export function MessageContainer({ items, onRemove }: MessageContainerProps) {
  return (
    <div className="pixel-message-container" role="status" aria-live="polite">
      {items.map((item) => (
        <MessageInner
          key={item.id}
          {...item}
          onDone={() => onRemove(item.id)}
        />
      ))}
    </div>
  );
}

/** 单条消息：先 visible → closing（淡出动画）→ onDone 从列表移除 */
function MessageInner({
  content,
  type = "info",
  duration = 5,
  onDone,
}: MessageConfig & { onDone: () => void }) {
  const [closing, setClosing] = useState(false);

  // 自动关闭：duration 秒后进入 closing 阶段
  useEffect(() => {
    if (duration > 0) {
      const showMs = duration * 1000;
      const timer = setTimeout(() => setClosing(true), showMs);
      return () => clearTimeout(timer);
    }
  }, [duration]);

  // closing 阶段走完 CLOSE_ANIM_MS 后通知外层真正移除
  useEffect(() => {
    if (closing) {
      const timer = setTimeout(onDone, CLOSE_ANIM_MS);
      return () => clearTimeout(timer);
    }
  }, [closing, onDone]);

  return (
    <div
      className={clsx(
        "pixel-message",
        `pixel-message--${type}`,
        closing && "pixel-message--closing"
      )}
    >
      {content}
    </div>
  );
}
