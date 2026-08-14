import { createContext, useContext, type ReactNode, useCallback } from "react";

interface AppContextValue {
  message: (content: string, type?: "info" | "success" | "error" | "warning") => void;
  notification: (config: { message: string; description?: string; type?: "info" | "success" | "error" | "warning" }) => void;
}

const AppContext = createContext<AppContextValue>({
  message: () => {},
  notification: () => {},
});

interface AppProps {
  children: ReactNode;
  message?: (content: string, type?: "info" | "success" | "error" | "warning") => void;
  notification?: (config: { message: string; description?: string; type?: "info" | "success" | "error" | "warning" }) => void;
}

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