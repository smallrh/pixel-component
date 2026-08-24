import { createContext, useContext, type ReactNode, useCallback } from "react";

interface AppContextValue {
  message: (content: string, type?: "info" | "success" | "error" | "warning") => void;
  notification: (config: { message: string; description?: string; type?: "info" | "success" | "error" | "warning" }) => void;
}

const AppContext = createContext<AppContextValue>({
  message: () => {},
  notification: () => {},
});

export interface AppProps {
  /** 应用子节点 */
  children: ReactNode;
  /** 自定义的全局消息触发函数，由 Context 暴露给子组件 */
  message?: (content: string, type?: "info" | "success" | "error" | "warning") => void;
  /** 自定义的全局通知触发函数，由 Context 暴露给子组件 */
  notification?: (config: { message: string; description?: string; type?: "info" | "success" | "error" | "warning" }) => void;
}

/**
 * App 应用容器。
 * 通过 Context 向子组件下发全局消息与通知的触发方法，便于深层组件统一调用。
 */
export default function App({ children, message, notification }: AppProps) {
  const msg = useCallback(
    (content: string, type?: "info" | "success" | "error" | "warning") => {
      message?.(content, type);
    },
    [message]
  );

  const notif = useCallback(
    (config: { message: string; description?: string; type?: "info" | "success" | "error" | "warning" }) => {
      notification?.(config);
    },
    [notification]
  );

  return (
    <AppContext.Provider value={{ message: msg, notification: notif }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}