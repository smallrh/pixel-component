import { createContext, useContext } from "react";

/** Sider 向后代组件下发的上下文，目前仅携带收起状态。 */
export interface SiderContextValue {
  /** 侧边栏是否收起 */
  collapsed: boolean;
}

/**
 * Sider 折叠上下文。
 * Menu 等后代组件可借此自动跟随 Sider 的 collapsed，无需逐层透传 props。
 */
export const SiderContext = createContext<SiderContextValue | null>(null);

/** 读取最近 Sider 的折叠状态；不在 Sider 内时返回 null。 */
export function useSider(): SiderContextValue | null {
  return useContext(SiderContext);
}
