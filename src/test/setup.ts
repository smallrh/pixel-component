import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";

// jsdom 缺少 matchMedia（某些组件/库会用到），补一个 mock
if (typeof window !== "undefined" && !window.matchMedia) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
  });
}

// jsdom 未实现 scrollTo，补一个 no-op
if (typeof window !== "undefined" && !window.scrollTo) {
  window.scrollTo = () => {};
}

// 用 cleanup() 真正卸载 React 树（触发 useEffect 清理，清除 setTimeout/setInterval），
// 避免直接 innerHTML="" 导致定时器泄漏、进程挂起。
afterEach(() => {
  cleanup();
});
