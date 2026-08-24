import { useState } from "react";
import Menu from "../../../components/Menu";
import Icon from "../../../components/Icon";
import type { MenuItem } from "../../../components/Menu";
import "./Sidebar.css";

const menuItems: MenuItem[] = [
  { key: "overview", label: "Overview", icon: <Icon name="home" size="sm" /> },
  { key: "analytics", label: "Analytics", icon: <Icon name="star" size="sm" /> },
  { key: "users", label: "Users", icon: <Icon name="user" size="sm" /> },
  { key: "orders", label: "Orders", icon: <Icon name="download" size="sm" /> },
  { key: "products", label: "Products", icon: <Icon name="upload" size="sm" /> },
  { key: "messages", label: "Messages", icon: <Icon name="mail" size="sm" /> },
];

const systemItems: MenuItem[] = [
  { key: "settings", label: "Settings", icon: <Icon name="setting" size="sm" /> },
  { key: "logs", label: "System Logs", icon: <Icon name="info" size="sm" /> },
];

export interface SidebarProps {
  selectedKey: string;
  onSelect: (key: string) => void;
  collapsed?: boolean;
}

export default function Sidebar({ selectedKey, onSelect, collapsed = false }: SidebarProps) {
  const [systemOpen, setSystemOpen] = useState(false);

  return (
    <aside className={`pixel-sidebar ${collapsed ? "pixel-sidebar--collapsed" : ""}`}>
      <div className="pixel-sidebar-logo">
        <Icon name="menu" size="lg" />
        {!collapsed && <span className="pixel-sidebar-title">PIXEL ADMIN</span>}
      </div>

      <div className="pixel-sidebar-section">
        {!collapsed && <div className="pixel-sidebar-section-title">MAIN</div>}
        <Menu
          items={menuItems}
          mode="vertical"
          selectedKey={selectedKey}
          onSelect={onSelect}
        />
      </div>

      <div className="pixel-sidebar-divider" />

      <div className="pixel-sidebar-section">
        {!collapsed && <div className="pixel-sidebar-section-title">SYSTEM</div>}
        <div
          className={`pixel-sidebar-parent ${systemOpen ? "pixel-sidebar-parent--open" : ""}`}
          onClick={() => setSystemOpen(!systemOpen)}
        >
          <Icon name="setting" size="sm" />
          {!collapsed && <span>System</span>}
          {!collapsed && (
            <Icon name={systemOpen ? "chevron-down" : "chevron-right"} size="sm" />
          )}
        </div>
        {systemOpen && !collapsed && (
          <Menu
            items={systemItems}
            mode="vertical"
            selectedKey={selectedKey}
            onSelect={onSelect}
          />
        )}
      </div>
    </aside>
  );
}
