import { type CSSProperties, useState } from "react";
import clsx from "clsx";
import "./Tree.css";

export interface TreeNode {
  title: string;
  key: string;
  children?: TreeNode[];
  disabled?: boolean;
}

export interface TreeProps {
  treeData: TreeNode[];
  defaultExpandAll?: boolean;
  defaultSelectedKeys?: string[];
  checkable?: boolean;
  defaultCheckedKeys?: string[];
  onSelect?: (key: string, selected: boolean) => void;
  onCheck?: (checkedKeys: string[]) => void;
  className?: string;
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

function TreeNodeItem({
  node,
  level,
  checkable,
  expandedKeys,
  onToggle,
  selectedKey,
  onSelect,
  checkedKeys,
  onCheckNode,
}: {
  node: TreeNode;
  level: number;
  checkable: boolean;
  expandedKeys: string[];
  onToggle: (key: string) => void;
  selectedKey?: string;
  onSelect: (key: string) => void;
  checkedKeys: Set<string>;
  onCheckNode: (node: TreeNode, checked: boolean) => void;
}) {
  const hasCh = hasChildren(node);
  const expanded = expandedKeys.includes(node.key);
  const { checked, indeterminate } = getCheckState(node, checkedKeys);

  return (
    <div>
      <div
        className={clsx(
          "pixel-tree-node",
          selectedKey === node.key && "pixel-tree-node--selected"
        )}
        style={{ paddingLeft: level * 20 }}
        onClick={() => onSelect(node.key)}
        role="treeitem"
        aria-selected={selectedKey === node.key}
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
        <div>
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
            />
          ))}
        </div>
      )}
    </div>
  );
}

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

  const handleSelect = (key: string) => {
    const next = key === selectedKey ? undefined : key;
    setSelectedKey(next);
    onSelect?.(key, next !== undefined);
  };

  const handleCheckNode = (node: TreeNode, checked: boolean) => {
    const parentMap = buildParentMap(treeData);
    const next = new Set(checkedKeys);

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

    setCheckedKeys(next);
    onCheck?.([...next]);
  };

  return (
    <div className={clsx("pixel-tree", className)} style={style} role="tree">
      {treeData.map((node) => (
        <TreeNodeItem
          key={node.key}
          node={node}
          level={0}
          checkable={checkable}
          expandedKeys={expandedKeys}
          onToggle={(key) =>
            setExpandedKeys((prev) =>
              prev.includes(key)
                ? prev.filter((k) => k !== key)
                : [...prev, key]
            )
          }
          selectedKey={selectedKey}
          onSelect={handleSelect}
          checkedKeys={checkedKeys}
          onCheckNode={handleCheckNode}
        />
      ))}
    </div>
  );
}
