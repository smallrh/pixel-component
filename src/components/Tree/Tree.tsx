import { type CSSProperties, memo, useCallback, useEffect, useRef, useState } from "react";
import clsx from "clsx";
import "./Tree.css";

export interface TreeNode {
  /** 节点显示文本 */
  title: string;
  /** 节点唯一标识 */
  key: string;
  /** 子节点（存在则显示展开箭头） */
  children?: TreeNode[];
  /** 是否禁用勾选（不影响选中） */
  disabled?: boolean;
}

export interface TreeProps {
  /** 树形数据 */
  treeData: TreeNode[];
  /** 非受控：默认展开所有可展开节点 */
  defaultExpandAll?: boolean;
  /** 非受控：默认选中的节点 key */
  defaultSelectedKeys?: string[];
  /** 是否显示 checkbox（开启后支持父子联动勾选） */
  checkable?: boolean;
  /** 非受控：默认勾选的节点 key */
  defaultCheckedKeys?: string[];
  /** 节点点击选中回调（selected 为 false 表示取消选中） */
  onSelect?: (key: string, selected: boolean) => void;
  /** 勾选变化回调，返回当前所有勾选的 key（含父子联动结果） */
  onCheck?: (checkedKeys: string[]) => void;
  /** 自定义类名 */
  className?: string;
  /** 自定义内联样式 */
  style?: CSSProperties;
}

function hasChildren(node: TreeNode): boolean {
  return !!(node.children && node.children.length > 0);
}

function getExpandableKeys(nodes: TreeNode[]): string[] {
  const keys: string[] = [];
  nodes.forEach((n) => {
    if (hasChildren(n)) {
      keys.push(n.key);
      if (n.children) keys.push(...getExpandableKeys(n.children));
    }
  });
  return keys;
}

/** 收集节点自身 + 全部后代 key */
function getSubtreeKeys(node: TreeNode): string[] {
  return [node.key, ...(node.children ? node.children.flatMap(getSubtreeKeys) : [])];
}

/** 构建 key -> 直接父节点 的映射 */
function buildParentMap(nodes: TreeNode[], parent?: TreeNode): Map<string, TreeNode> {
  const map = new Map<string, TreeNode>();
  nodes.forEach((n) => {
    if (parent) map.set(n.key, parent);
    if (n.children) {
      const childMap = buildParentMap(n.children, n);
      childMap.forEach((v, k) => map.set(k, v));
    }
  });
  return map;
}

/** 根据子树勾选情况计算节点的勾选状态 */
function getCheckState(node: TreeNode, checkedKeys: Set<string>): {
  checked: boolean;
  indeterminate: boolean;
} {
  if (!hasChildren(node)) {
    return { checked: checkedKeys.has(node.key), indeterminate: false };
  }
  const childKeys = (node.children ?? []).map((c) => c.key);
  const checkedChildren = childKeys.filter((k) => checkedKeys.has(k)).length;
  if (checkedChildren === childKeys.length && childKeys.length > 0) {
    return { checked: true, indeterminate: false };
  }
  if (checkedChildren > 0) {
    return { checked: false, indeterminate: true };
  }
  return { checked: false, indeterminate: false };
}

/**
 * 按 DFS（pre-order）顺序收集当前可见（已展开父链路上所有节点）的节点。
 * 用于键盘 ArrowUp/Down/Home/End 在可见节点间移动焦点。
 */
function getVisibleNodes(
  nodes: TreeNode[],
  expandedKeys: string[],
  parent: TreeNode | undefined,
  acc: { node: TreeNode; parent: TreeNode | undefined }[] = []
): { node: TreeNode; parent: TreeNode | undefined }[] {
  nodes.forEach((n) => {
    acc.push({ node: n, parent });
    if (hasChildren(n) && expandedKeys.includes(n.key)) {
      getVisibleNodes(n.children!, expandedKeys, n, acc);
    }
  });
  return acc;
}

interface TreeNodeItemProps {
  node: TreeNode;
  level: number;
  checkable: boolean;
  expandedKeys: string[];
  onToggle: (key: string) => void;
  selectedKey?: string;
  onSelect: (key: string) => void;
  checkedKeys: Set<string>;
  onCheckNode: (node: TreeNode, checked: boolean) => void;
  focusedKey?: string;
  onFocusKey: (key: string) => void;
  onKeyDown: (e: React.KeyboardEvent, node: TreeNode) => void;
  registerNodeRef: (key: string, el: HTMLDivElement | null) => void;
}

/**
 * memo 比较函数：返回 true 表示 props 相等（跳过重渲染）。
 * expandedKeys（数组）与 checkedKeys（Set）每次 state 变化都是新引用，
 * 因此按内容比较——子节点只关心自身 key 是否在 expandedKeys 中、
 * 自身及子树的勾选状态是否变化，而非整个数组/Set 的引用。
 */
function areEqual(prev: TreeNodeItemProps, next: TreeNodeItemProps): boolean {
  if (prev.node !== next.node) return false;
  if (prev.level !== next.level) return false;
  if (prev.checkable !== next.checkable) return false;
  if (prev.selectedKey !== next.selectedKey) return false;
  if (prev.focusedKey !== next.focusedKey) return false;
  if (prev.onToggle !== next.onToggle) return false;
  if (prev.onSelect !== next.onSelect) return false;
  if (prev.onCheckNode !== next.onCheckNode) return false;
  if (prev.onFocusKey !== next.onFocusKey) return false;
  if (prev.onKeyDown !== next.onKeyDown) return false;
  if (prev.registerNodeRef !== next.registerNodeRef) return false;
  // 本节点展开状态是否变化
  const prevExpanded = prev.expandedKeys.includes(prev.node.key);
  const nextExpanded = next.expandedKeys.includes(next.node.key);
  if (prevExpanded !== nextExpanded) return false;
  // 本节点勾选状态是否变化（checked + indeterminate）
  const prevCheck = getCheckState(prev.node, prev.checkedKeys);
  const nextCheck = getCheckState(next.node, next.checkedKeys);
  if (prevCheck.checked !== nextCheck.checked) return false;
  if (prevCheck.indeterminate !== nextCheck.indeterminate) return false;
  return true;
}

const TreeNodeItem = memo(function TreeNodeItem({
  node,
  level,
  checkable,
  expandedKeys,
  onToggle,
  selectedKey,
  onSelect,
  checkedKeys,
  onCheckNode,
  focusedKey,
  onFocusKey,
  onKeyDown,
  registerNodeRef,
}: TreeNodeItemProps) {
  const hasCh = hasChildren(node);
  const expanded = expandedKeys.includes(node.key);
  const { checked, indeterminate } = getCheckState(node, checkedKeys);
  const isFocused = focusedKey === node.key;

  return (
    <div>
      <div
        ref={(el) => registerNodeRef(node.key, el)}
        className={clsx(
          "pixel-tree-node",
          selectedKey === node.key && "pixel-tree-node--selected",
          isFocused && "pixel-tree-node--focused"
        )}
        style={{ paddingLeft: level * 20 }}
        onClick={() => onSelect(node.key)}
        onFocus={() => onFocusKey(node.key)}
        onKeyDown={(e) => onKeyDown(e, node)}
        role="treeitem"
        aria-selected={selectedKey === node.key}
        aria-expanded={hasCh ? expanded : undefined}
        aria-level={level + 1}
        aria-checked={checkable ? (indeterminate ? "mixed" : checked) : undefined}
        tabIndex={isFocused ? 0 : -1}
      >
        {hasCh ? (
          <span
            className="pixel-tree-switcher"
            onClick={(e) => {
              e.stopPropagation();
              onToggle(node.key);
            }}
          >
            {expanded ? "▾" : "▸"}
          </span>
        ) : (
          <span className="pixel-tree-switcher pixel-tree-switcher--empty" />
        )}
        {checkable && (
          <span
            className={clsx(
              "pixel-tree-checkbox",
              checked && "pixel-tree-checkbox--checked",
              indeterminate && "pixel-tree-checkbox--indeterminate"
            )}
            onClick={(e) => {
              e.stopPropagation();
              if (!node.disabled) onCheckNode(node, !checked);
            }}
            role="checkbox"
            aria-checked={indeterminate ? "mixed" : checked}
          >
            <span className="pixel-tree-checkbox-inner" />
          </span>
        )}
        <span
          className={clsx(
            "pixel-tree-title",
            node.disabled && "pixel-tree-title--disabled"
          )}
        >
          {node.title}
        </span>
      </div>
      {hasCh && expanded && (
        <div role="group">
          {node.children!.map((child) => (
            <TreeNodeItem
              key={child.key}
              node={child}
              level={level + 1}
              checkable={checkable}
              expandedKeys={expandedKeys}
              onToggle={onToggle}
              selectedKey={selectedKey}
              onSelect={onSelect}
              checkedKeys={checkedKeys}
              onCheckNode={onCheckNode}
              focusedKey={focusedKey}
              onFocusKey={onFocusKey}
              onKeyDown={onKeyDown}
              registerNodeRef={registerNodeRef}
            />
          ))}
        </div>
      )}
    </div>
  );
}, areEqual);

export default function Tree({
  treeData,
  defaultExpandAll = false,
  defaultSelectedKeys = [],
  checkable = false,
  defaultCheckedKeys = [],
  onSelect,
  onCheck,
  className,
  style,
}: TreeProps) {
  const [expandedKeys, setExpandedKeys] = useState<string[]>(
    defaultExpandAll ? getExpandableKeys(treeData) : []
  );
  const [selectedKey, setSelectedKey] = useState<string | undefined>(
    defaultSelectedKeys[0]
  );
  const [checkedKeys, setCheckedKeys] = useState<Set<string>>(
    new Set(defaultCheckedKeys)
  );
  // roving tabindex：当前持有 tabIndex=0 的节点 key
  const [focusedKey, setFocusedKey] = useState<string | undefined>(
    defaultSelectedKeys[0] ?? treeData[0]?.key
  );
  const nodeRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  // 在 useEffect 中等待 render 完成、再 focus 真实 DOM，
  // 避免 render 期间 focus 引发副作用告警
  const pendingFocusRef = useRef<string | null>(null);

  // useCallback 稳定引用：传给 memo(TreeNodeItem)，避免每次 render 新函数导致 memo 失效
  const handleToggle = useCallback((key: string) => {
    setExpandedKeys((prev) =>
      prev.includes(key)
        ? prev.filter((k) => k !== key)
        : [...prev, key]
    );
  }, []);

  const handleSelect = useCallback((key: string) => {
    setSelectedKey((prev) => {
      const next = key === prev ? undefined : key;
      onSelect?.(key, next !== undefined);
      return next;
    });
  }, [onSelect]);

  const handleCheckNode = useCallback((node: TreeNode, checked: boolean) => {
    // 函数式更新：读最新 checkedKeys，避免把它加入依赖导致引用变化
    setCheckedKeys((prevChecked) => {
      const parentMap = buildParentMap(treeData);
      const next = new Set(prevChecked);

      // 1. 勾选/取消自身 + 全部子树
      const subtree = getSubtreeKeys(node);
      if (checked) {
        subtree.forEach((k) => next.add(k));
      } else {
        subtree.forEach((k) => next.delete(k));
      }

      // 2. 向上联动祖先：子节点全部勾选 -> 父勾选；否则父取消
      let current: TreeNode | undefined = node;
      let parent = parentMap.get(current.key);
      while (parent) {
        const siblings = parent.children ?? [];
        const allChecked = siblings.every((s) => next.has(s.key));
        const anyChecked = siblings.some((s) => next.has(s.key));
        if (allChecked) {
          next.add(parent.key);
        } else if (anyChecked) {
          next.delete(parent.key);
        } else {
          next.delete(parent.key);
        }
        current = parent;
        parent = parentMap.get(current.key);
      }

      onCheck?.([...next]);
      return next;
    });
  }, [treeData, onCheck]);

  const registerNodeRef = useCallback((key: string, el: HTMLDivElement | null) => {
    if (el) nodeRefs.current.set(key, el);
    else nodeRefs.current.delete(key);
  }, []);

  const handleFocusKey = useCallback((key: string) => {
    setFocusedKey(key);
  }, []);

  // 计算当前可见节点顺序，供 ArrowUp/Down/Home/End 使用
  const visibleNodes = getVisibleNodes(treeData, expandedKeys, undefined);

  const focusNode = useCallback((key: string) => {
    pendingFocusRef.current = key;
    setFocusedKey(key);
  }, []);

  // render 完成后把焦点交给 pendingFocusRef 指向的节点
  useEffect(() => {
    if (pendingFocusRef.current === null) return;
    const key = pendingFocusRef.current;
    pendingFocusRef.current = null;
    nodeRefs.current.get(key)?.focus();
  });

  const handleKeyDown = useCallback((e: React.KeyboardEvent, node: TreeNode) => {
    const hasCh = hasChildren(node);
    const expanded = expandedKeys.includes(node.key);
    const idx = visibleNodes.findIndex((v) => v.node.key === node.key);

    switch (e.key) {
      case "ArrowUp": {
        if (idx > 0) {
          e.preventDefault();
          const prev = visibleNodes[idx - 1].node.key;
          focusNode(prev);
        }
        break;
      }
      case "ArrowDown": {
        if (idx >= 0 && idx < visibleNodes.length - 1) {
          e.preventDefault();
          const next = visibleNodes[idx + 1].node.key;
          focusNode(next);
        }
        break;
      }
      case "ArrowRight": {
        e.preventDefault();
        if (hasCh && !expanded) {
          // 折叠态：展开当前节点（不移动焦点）
          handleToggle(node.key);
        } else if (hasCh && expanded) {
          // 已展开：聚焦第一个子节点
          const firstChild = node.children?.find((c) => !c.disabled);
          if (firstChild) focusNode(firstChild.key);
        }
        break;
      }
      case "ArrowLeft": {
        e.preventDefault();
        if (hasCh && expanded) {
          // 展开态：折叠当前节点
          handleToggle(node.key);
        } else {
          // 折叠态：聚焦父节点
          const parent = visibleNodes[idx]?.parent;
          if (parent) focusNode(parent.key);
        }
        break;
      }
      case "Enter": {
        e.preventDefault();
        handleSelect(node.key);
        break;
      }
      case " ": {
        if (checkable && !node.disabled) {
          e.preventDefault();
          const { checked } = getCheckState(node, checkedKeys);
          handleCheckNode(node, !checked);
        }
        break;
      }
      case "Home": {
        if (visibleNodes.length > 0) {
          e.preventDefault();
          focusNode(visibleNodes[0].node.key);
        }
        break;
      }
      case "End": {
        if (visibleNodes.length > 0) {
          e.preventDefault();
          focusNode(visibleNodes[visibleNodes.length - 1].node.key);
        }
        break;
      }
      default:
        break;
    }
  }, [expandedKeys, visibleNodes, checkable, checkedKeys, handleToggle, handleSelect, handleCheckNode, focusNode]);

  return (
    <div className={clsx("pixel-tree", className)} style={style} role="tree">
      {treeData.map((node) => (
        <TreeNodeItem
          key={node.key}
          node={node}
          level={0}
          checkable={checkable}
          expandedKeys={expandedKeys}
          onToggle={handleToggle}
          selectedKey={selectedKey}
          onSelect={handleSelect}
          checkedKeys={checkedKeys}
          onCheckNode={handleCheckNode}
          focusedKey={focusedKey}
          onFocusKey={handleFocusKey}
          onKeyDown={handleKeyDown}
          registerNodeRef={registerNodeRef}
        />
      ))}
    </div>
  );
}
