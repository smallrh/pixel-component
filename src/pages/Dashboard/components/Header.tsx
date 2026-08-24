import Badge from "../../../components/Badge";
import Avatar from "../../../components/Avatar";
import Button from "../../../components/Button";
import Input from "../../../components/Input";
import Icon from "../../../components/Icon";
import Tooltip from "../../../components/Tooltip";
import Dropdown from "../../../components/Dropdown";
import type { DropdownItem } from "../../../components/Dropdown";
import "./Header.css";

const userMenuItems: DropdownItem[] = [
  { key: "profile", label: "Profile", icon: <Icon name="user" size="sm" /> },
  { key: "settings", label: "Settings", icon: <Icon name="setting" size="sm" /> },
  { key: "divider", label: "", divider: true },
  { key: "logout", label: "Logout", icon: <Icon name="trash" size="sm" />, danger: true },
];

export interface HeaderProps {
  onMenuToggle: () => void;
  onUserSelect: (key: string) => void;
  onNotificationClick: () => void;
  notificationCount: number;
}

export default function Header({ onMenuToggle, onUserSelect, onNotificationClick, notificationCount }: HeaderProps) {
  return (
    <header className="pixel-header">
      <div className="pixel-header-left">
        <Tooltip title="Toggle Sidebar" placement="bottom">
          <Button
            variant="secondary"
            size="sm"
            onClick={onMenuToggle}
            className="pixel-header-toggle"
          >
            <Icon name="menu" size="sm" />
          </Button>
        </Tooltip>
        <div className="pixel-header-search">
          <Icon name="search" size="sm" className="pixel-header-search-icon" />
          <Input
            variant="filled"
            size="sm"
            placeholder="Search..."
            className="pixel-header-search-input"
          />
        </div>
      </div>

      <div className="pixel-header-right">
        <Tooltip title="Notifications" placement="bottom">
          <Button
            variant="secondary"
            size="sm"
            onClick={onNotificationClick}
            className="pixel-header-notification"
          >
            <Badge count={notificationCount} overflowCount={9}>
              <Icon name="bell" size="sm" />
            </Badge>
          </Button>
        </Tooltip>

        <Dropdown
          items={userMenuItems}
          trigger="click"
          onSelect={onUserSelect}
        >
          <Button variant="secondary" size="sm" className="pixel-header-user">
            <Avatar size="sm">A</Avatar>
            <span className="pixel-header-user-name">Admin</span>
            <Icon name="chevron-down" size="sm" />
          </Button>
        </Dropdown>
      </div>
    </header>
  );
}
