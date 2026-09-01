import { type CSSProperties, type ReactNode, memo, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import clsx from "clsx";
import "./Menu.css";
import { SiderContext } from "../Layout/SiderContext";

export interface MenuItem {
  /** 菜单项唯一标识 */
  key: string;
  /** 菜单项显示内容 */
  label: ReactNode;
  /** 菜单项前缀图标 */
  icon?: ReactNode;
  /** 是否禁用 */
  disabled?: boolean;
  /** 子菜单项，存在时点击展开/收起而非选中 */
  children?: MenuItem[];
}

export interface MenuProps {
  /** 菜单项列表 */
  items: MenuItem[];
  /** 展示方向，默认 "horizontal" */
  mode?: "horizontal" | "vertical";
  /** 非受控：默认选中项 */
  defaultSelectedKey?: string;
  /** 受控：当前选中项（传入后由外部管理） */
  selectedKey?: string;
  /**
   * 内联折叠（图标模式）。未显式传入时自动跟随外层 Sider 的 collapsed 状态。
   * 折叠后菜单仅显示图标、隐藏文字，子菜单改为悬浮弹出。
   */
  inlineCollapsed?: boolean;
  /** 自定义类名 */
  className?: string;
  /** 自定义内联样式 */
  style?: CSSProperties;
  /** 选中菜单项回调，参数为该项的 key */
  onSelect?: (key: string) => void;
}

interface MenuNodeInfo {
  item: MenuItem;
  parentKey: string | null;
  siblings: MenuItem[];
}

/** 构建 key -> { item, parentKey, siblings } 的扁平索引，用于键盘导航 */
function buildMenuIndex(items: MenuItem[]): {
  byKey: Map<string, MenuNodeInfo>;
  topLevel: MenuItem[];
} {
  const byKey = new Map<string, MenuNodeInfo>();
  const recurse = (list: MenuItem[], parentKey: string | null) => {
    list.forEach((item) => {
      byKey.set(item.key, { item, parentKey, siblings: list });
      if (item.children) recurse(item.children, item.key);
    });
  };
  recurse(items, null);
  return { byKey, topLevel: items };
}

/** 取列表中第一个非禁用项的 key */
function firstEnabledKey(items: MenuItem[]): string | undefined {
  return items.find((i) => !i.disabled)?.key;
}

/** 取列表中最后一个非禁用项的 key */
function lastEnabledKey(items: MenuItem[]): string | undefined {
  return [...items].reverse().find((i) => !i.disabled)?.key;
}

interface MenuItemViewProps {
  item: MenuItem;
  isSub: boolean;
  selectedKey: string;
  openKeys: string[];
  onSelect: (key: string) => void;
  onToggle: (key: string) => void;
  focusedKey?: string;
  onKeyDown: (e: React.KeyboardEvent, item: MenuItem, isSub: boolean) => void;
  registerButtonRef: (key: string, el: HTMLButtonElement | null) => void;
  /** 是否处于折叠（图标）模式 */
  collapsed: boolean;
}

/**
 * memo 比较函数：selectedKey 与 openKeys 每次 state 变化都是新引用，
 * 因此按内容比较——菜单项只关心自身是否被选中、自身子菜单是否展开。
 */
function areEqual(prev: MenuItemViewProps, next: MenuItemViewProps): boolean {
  if (prev.item !== next.item) return false;
  if (prev.isSub !== next.isSub) return false;
  if (prev.onSelect !== next.onSelect) return false;
  if (prev.onToggle !== next.onToggle) return false;
  if (prev.focusedKey !== next.focusedKey) return false;
  if (prev.onKeyDown !== next.onKeyDown) return false;
  if (prev.registerButtonRef !== next.registerButtonRef) return false;
  if (prev.collapsed !== next.collapsed) return false;
  // 是否有子菜单（决定选中态是否生效）
  const prevHasChildren = !!(prev.item.children && prev.item.children.length > 0);
  const nextHasChildren = !!(next.item.children && next.item.children.length > 0);
  if (prevHasChildren !== nextHasChildren) return false;
  // 当前项是否选中（仅叶子项可选中）
  const prevSelected = !prevHasChildren && prev.selectedKey === prev.item.key;
  const nextSelected = !nextHasChildren && next.selectedKey === next.item.key;
  if (prevSelected !== nextSelected) return false;
  // 当前子菜单是否展开
  const prevOpen = prevHasChildren && prev.openKeys.includes(prev.item.key);
  const nextOpen = nextHasChildren && next.openKeys.includes(next.item.key);
  if (prevOpen !== nextOpen) return false;
  // 当前项是否持有 roving tabindex 焦点
  const prevFocused = prev.focusedKey === prev.item.key;
  const nextFocused = next.focusedKey === next.item.key;
  if (prevFocused !== nextFocused) return false;
  return true;
}

const MenuItemView = memo(function MenuItemView({
  item,
  isSub,
  selectedKey,
  openKeys,
  onSelect,
  onToggle,
  focusedKey,
  onKeyDown,
  registerButtonRef,
  collapsed,
}: MenuItemViewProps) {
  const hasChildren = !!(item.children && item.children.length > 0);
  const isOpen = openKeys.includes(item.key);
  const isFocused = focusedKey === item.key;
  // 折叠模式下子菜单改为悬浮弹出，因此始终渲染（由 CSS 控制显隐）
  const showSubmenu = hasChildren && (collapsed || isOpen);

  return (
    <li
      className={clsx(
        "pixel-menu-item",
        selectedKey === item.key && !hasChildren && "pixel-menu-item--selected",
        item.disabled && "pixel-menu-item--disabled",
        isSub && "pixel-menu-item--sub"
      )}
    >
      <button
        ref={(el) => registerButtonRef(item.key, el)}
        type="button"
        className="pixel-menu-item-btn"
        disabled={item.disabled}
        role="menuitem"
        aria-selected={!hasChildren ? selectedKey === item.key : undefined}
        onClick={() => {
          if (hasChildren) {
            onToggle(item.key);
          } else {
            onSelect(item.key);
          }
        }}
        onKeyDown={(e) => onKeyDown(e, item, isSub)}
        tabIndex={isFocused ? 0 : -1}
        aria-haspopup={hasChildren ? "menu" : undefined}
        aria-expanded={hasChildren ? isOpen : undefined}
        aria-disabled={item.disabled}
        title={collapsed && typeof item.label === "string" ? item.label : undefined}
      >
        {item.icon && <span className="pixel-menu-item-icon">{item.icon}</span>}
        <span className="pixel-menu-item-label">{item.label}</span>
        {hasChildren && !collapsed && (
          <span className={clsx("pixel-menu-arrow", isOpen && "pixel-menu-arrow--open")}>
            ▸
          </span>
        )}
      </button>
      {showSubmenu && (
        <ul className="pixel-menu-submenu" role="menu">
          {item.children!.map((child) => (
            <MenuItemView
              key={child.key}
              item={child}
              isSub={true}
              selectedKey={selectedKey}
              openKeys={openKeys}
              onSelect={onSelect}
              onToggle={onToggle}
              focusedKey={focusedKey}
              onKeyDown={onKeyDown}
              registerButtonRef={registerButtonRef}
              collapsed={collapsed}
            />
          ))}
        </ul>
      )}
    </li>
  );
}, areEqual);

/**
 * Menu 菜单。支持水平/垂直两种布局，可嵌套子菜单，选中项支持受控与非受控两种模式。
 * 关键特性：子菜单点击展开/收起；disabled 项不触发选中；受控时由外部管理选中态。
 * 键盘交互（按 ARIA APG menu pattern）：
 *   - horizontal：ArrowLeft/Right 在顶层菜单项间移动焦点，ArrowDown 打开子菜单并聚焦首个子项
 *   - vertical：ArrowUp/Down 在当前层级菜单项间移动焦点，ArrowRight 打开子菜单并聚焦首个子项
 *   - 任意层级：ArrowLeft（在子菜单中）关闭当前子菜单并聚焦父项
 *   - Home/End：聚焦当前层级首个/末个菜单项
 *   - Enter/Space：原生 button 触发，叶子项选中、父项展开/收起
 */
export default function Menu({
  items,
  mode = "horizontal",
  defaultSelectedKey,
  selectedKey: selectedKeyProp,
  inlineCollapsed,
  className,
  style,
  onSelect,
}: MenuProps) {
  const [innerSelectedKey, setInnerSelectedKey] = useState(defaultSelectedKey ?? "");
  const isControlled = selectedKeyProp !== undefined;
  const selectedKey = isControlled ? (selectedKeyProp as string) : innerSelectedKey;
  // 自动跟随外层 Sider 的折叠状态；显式传入 inlineCollapsed 时以它为准
  const sider = useContext(SiderContext);
  const collapsed = inlineCollapsed ?? sider?.collapsed ?? false;
  // 折叠态下菜单强制为垂直内联模式
  const effectiveMode = collapsed ? "vertical" : mode;
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  // roving tabindex：当前持有 tabIndex=0 的菜单项 key
  const [focusedKey, setFocusedKey] = useState<string>(
    defaultSelectedKey ?? firstEnabledKey(items) ?? ""
  );
  const buttonRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const pendingFocusRef = useRef<string | null>(null);

  const menuIndex = useMemo(() => buildMenuIndex(items), [items]);

  // useCallback 稳定引用：传给 memo(MenuItemView)，避免每次 render 新函数导致 memo 失效
  const handleSelect = useCallback(
    (key: string) => {
      if (!isControlled) setInnerSelectedKey(key);
      onSelect?.(key);
    },
    [isControlled, onSelect]
  );

  const toggleSubmenu = useCallback((key: string) => {
    setOpenKeys((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  }, []);

  const openSubmenu = useCallback((key: string) => {
    setOpenKeys((prev) => (prev.includes(key) ? prev : [...prev, key]));
  }, []);

  const closeSubmenu = useCallback((key: string) => {
    setOpenKeys((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : prev));
  }, []);

  const registerButtonRef = useCallback((key: string, el: HTMLButtonElement | null) => {
    if (el) buttonRefs.current.set(key, el);
    else buttonRefs.current.delete(key);
  }, []);

  const focusItem = useCallback((key: string) => {
    pendingFocusRef.current = key;
    setFocusedKey(key);
  }, []);

  // render 完成后真正 focus 目标菜单项按钮
  useEffect(() => {
    if (pendingFocusRef.current === null) return;
    const key = pendingFocusRef.current;
    pendingFocusRef.current = null;
    buttonRefs.current.get(key)?.focus();
  });

  // 在同级间移动焦点：dir = +1 (next) / -1 (prev)，循环
  const moveWithinSiblings = useCallback((siblings: MenuItem[], currentKey: string, dir: 1 | -1) => {
    const enabled = siblings.filter((s) => !s.disabled);
    if (enabled.length === 0) return;
    const idx = enabled.findIndex((s) => s.key === currentKey);
    if (idx === -1) {
      focusItem(enabled[0].key);
      return;
    }
    const nextIdx = (idx + dir + enabled.length) % enabled.length;
    focusItem(enabled[nextIdx].key);
  }, [focusItem]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent, item: MenuItem, isSub: boolean) => {
    const info = menuIndex.byKey.get(item.key);
    if (!info) return;
    const hasChildren = !!(item.children && item.children.length > 0);
    const isHorizontalTopLevel = effectiveMode === "horizontal" && !isSub;

    switch (e.key) {
      case "ArrowRight": {
        if (isHorizontalTopLevel) {
          // 水平菜单顶层：移动到下一个顶层项；有子菜单则打开并聚焦首个子项
          if (hasChildren) {
            e.preventDefault();
            openSubmenu(item.key);
            const firstChild = firstEnabledKey(item.children!);
            if (firstChild) focusItem(firstChild);
          } else {
            e.preventDefault();
            moveWithinSiblings(info.siblings, item.key, 1);
          }
        } else if (hasChildren) {
          // 垂直菜单 / 子菜单：打开子菜单并聚焦首个子项
          e.preventDefault();
          openSubmenu(item.key);
          const firstChild = firstEnabledKey(item.children!);
          if (firstChild) focusItem(firstChild);
        }
        break;
      }
      case "ArrowLeft": {
        if (isHorizontalTopLevel) {
          // 水平菜单顶层：移动到上一个顶层项
          e.preventDefault();
          moveWithinSiblings(info.siblings, item.key, -1);
        } else if (info.parentKey !== null) {
          // 子菜单中：关闭当前子菜单并聚焦父项
          e.preventDefault();
          closeSubmenu(info.parentKey);
          focusItem(info.parentKey);
        }
        break;
      }
      case "ArrowDown": {
        if (isHorizontalTopLevel) {
          // 水平菜单顶层：打开子菜单并聚焦首个子项
          if (hasChildren) {
            e.preventDefault();
            openSubmenu(item.key);
            const firstChild = firstEnabledKey(item.children!);
            if (firstChild) focusItem(firstChild);
          }
        } else {
          // 垂直菜单 / 子菜单：在同级间向下移动
          e.preventDefault();
          moveWithinSiblings(info.siblings, item.key, 1);
        }
        break;
      }
      case "ArrowUp": {
        if (!isHorizontalTopLevel) {
          // 垂直菜单 / 子菜单：在同级间向上移动
          e.preventDefault();
          moveWithinSiblings(info.siblings, item.key, -1);
        }
        break;
      }
      case "Home": {
        e.preventDefault();
        const first = firstEnabledKey(info.siblings);
        if (first) focusItem(first);
        break;
      }
      case "End": {
        e.preventDefault();
        const last = lastEnabledKey(info.siblings);
        if (last) focusItem(last);
        break;
      }
      default:
        break;
    }
  }, [menuIndex, effectiveMode, openSubmenu, closeSubmenu, focusItem, moveWithinSiblings]);

  return (
    <nav
      className={clsx(
        "pixel-menu",
        `pixel-menu--${effectiveMode}`,
        collapsed && "pixel-menu--collapsed",
        className
      )}
      style={style}
    >
      <ul className="pixel-menu-list" role={effectiveMode === "horizontal" ? "menubar" : "menu"}>
        {items.map((item) => (
          <MenuItemView
            key={item.key}
            item={item}
            isSub={false}
            selectedKey={selectedKey}
            openKeys={openKeys}
            onSelect={handleSelect}
            onToggle={toggleSubmenu}
            focusedKey={focusedKey}
            onKeyDown={handleKeyDown}
            registerButtonRef={registerButtonRef}
            collapsed={collapsed}
          />
        ))}
      </ul>
    </nav>
  );
}
