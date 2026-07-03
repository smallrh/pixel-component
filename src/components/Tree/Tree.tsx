import { useState } from "react";
import clsx from "clsx";
import "./Tree.css";

interface TreeNode {
  title: string;
  key: string;
  children?: TreeNode[];
}

interface TreeProps {
  treeData: TreeNode[];
  defaultExpandAll?: boolean;
  onSelect?: (key: string) => void;
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

function TreeNodeItem({
  node,
  level,
  expandedKeys,
  onToggle,
  selectedKey,
  onSelect,
}: {
  node: TreeNode;
  level: number;
  expandedKeys: string[];
  onToggle: (key: string) => void;
  selectedKey?: string;
  onSelect?: (key: string) => void;
}) {
  const hasCh = hasChildren(node);
  const expanded = expandedKeys.includes(node.key);

  return (
    <div>
      <div
        className={clsx(
          "pixel-tree-node",
          selectedKey === node.key && "pixel-tree-node--selected"
        )}
        style={{ paddingLeft: level * 20 }}
        onClick={() => onSelect?.(node.key)}
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
        <span className="pixel-tree-title">{node.title}</span>
      </div>
      {hasCh && expanded && (
        <div>
          {node.children!.map((child) => (
            <TreeNodeItem
              key={child.key}
              node={child}
              level={level + 1}
              expandedKeys={expandedKeys}
              onToggle={onToggle}
              selectedKey={selectedKey}
              onSelect={onSelect}
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
  onSelect,
  className,
  style,
}: TreeProps) {
  const [expandedKeys, setExpandedKeys] = useState<string[]>(
    defaultExpandAll ? getExpandableKeys(treeData) : []
  );
  const [selectedKey, setSelectedKey] = useState<string>();

  const handleSelect = (key: string) => {
    setSelectedKey(key);
    onSelect?.(key);
  };

  return (
    <div className={clsx("pixel-tree", className)} style={style}>
      {treeData.map((node) => (
        <TreeNodeItem
          key={node.key}
          node={node}
          level={0}
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
        />
      ))}
    </div>
  );
}