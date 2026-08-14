import { useState } from "react";
import clsx from "clsx";
import "./Tree.css";

interface TreeNode {
  title: string;
  key: string;
  children?: TreeNode[];
  disabled?: boolean;
}

interface TreeProps {
  treeData: TreeNode[];
  defaultExpandAll?: boolean;
  defaultSelectedKeys?: string[];
  checkable?: boolean;
  defaultCheckedKeys?: string[];
  onSelect?: (key: string, selected: boolean) => void;
  onCheck?: (checkedKeys: string[]) => void;
  className?: string;
  style?: React.CSSProperties;
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

function getChildKeys(node: TreeNode): string[] {
  if (!node.children) return [];
  return node.children.flatMap((c) => [c.key, ...getChildKeys(c)]);
}

/** 根据当前已勾选集合计算某节点的勾选状态 */
function getCheckState(node: TreeNode, checkedKeys: string[]): {
  checked: boolean;
  indeterminate: boolean;
} {
  if (!hasChildren(node)) {
    return { checked: checkedKeys.includes(node.key), indeterminate: false };
  }
  const childKeys = getChildKeys(node);
  const checkedChildren = childKeys.filter((k) => checkedKeys.includes(k)).length;
  if (checkedChildren === childKeys.length) {
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
  checkedKeys: string[];
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
  const [checkedKeys, setCheckedKeys] = useState<string[]>(defaultCheckedKeys);

  const handleSelect = (key: string) => {
    const next = key === selectedKey ? undefined : key;
    setSelectedKey(next);
    onSelect?.(key, next !== undefined);
  };

  const handleCheckNode = (node: TreeNode, checked: boolean) => {
    const affected = [node.key, ...getChildKeys(node)];
    const next = new Set(checkedKeys);
    if (checked) {
      affected.forEach((k) => next.add(k));
    } else {
      affected.forEach((k) => next.delete(k));
    }
    setCheckedKeys([...next]);
    onCheck?.([...next]);
  };

  return (
    <div className={clsx("pixel-tree", className)} style={style}>
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
