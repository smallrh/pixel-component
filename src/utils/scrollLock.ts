/**
 * 全局 body 滚动锁（单一计数器）。
 *
 * 修复：Modal 与 Drawer 此前各自维护独立的 openOverlays/openDrawers 计数器，
 * 当两者同时打开、其中一个关闭时，会提前将 body overflow 恢复为空，
 * 导致仍在显示的浮层背后的页面可以滚动。
 */

let lockCount = 0;

/** 锁定 body 滚动（可被多次调用，需与 unlockBodyScroll 成对） */
export function lockBodyScroll(): void {
  lockCount += 1;
  document.body.style.overflow = "hidden";
}

/** 解锁 body 滚动（仅当所有调用方都已解锁时恢复） */
export function unlockBodyScroll(): void {
  lockCount = Math.max(0, lockCount - 1);
  if (lockCount === 0) document.body.style.overflow = "";
}

/** 供测试断言使用 */
export function getScrollLockCount(): number {
  return lockCount;
}
