import Modal from "../../../components/Modal";
import Card from "../../../components/Card";
import Avatar from "../../../components/Avatar";
import Tag from "../../../components/Tag";
import Descriptions from "../../../components/Descriptions";
import Button from "../../../components/Button";
import Icon from "../../../components/Icon";
import type { User } from "../mock";
import "./UserDetailModal.css";

export interface UserDetailModalProps {
  open: boolean;
  user: User | null;
  onClose: () => void;
  onEdit: (user: User) => void;
}

const roleTagMap: Record<string, { color: "default" | "red" | "green" | "blue" | "yellow"; label: string }> = {
  Administrator: { color: "red", label: "ADMIN" },
  Editor: { color: "blue", label: "EDITOR" },
  Developer: { color: "green", label: "DEV" },
  Viewer: { color: "default", label: "VIEWER" },
};

const statusTagMap: Record<string, { color: "green" | "red" | "yellow"; label: string }> = {
  active: { color: "green", label: "ACTIVE" },
  pending: { color: "yellow", label: "PENDING" },
  disabled: { color: "red", label: "DISABLED" },
};

export default function UserDetailModal({ open, user, onClose, onEdit }: UserDetailModalProps) {
  if (!user) return null;

  const roleInfo = roleTagMap[user.role];
  const statusInfo = statusTagMap[user.status];

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={
        <span className="pixel-user-detail-title">
          <Icon name="eye" size="sm" />
          User Details
        </span>
      }
      size="md"
      footer={
        <div className="pixel-user-detail-footer">
          <Button variant="secondary" size="md" onClick={onClose}>
            Close
          </Button>
          <Button variant="primary" size="md" onClick={() => onEdit(user)}>
            <Icon name="edit" size="sm" />
            Edit User
          </Button>
        </div>
      }
    >
      <div className="pixel-user-detail-header">
        <Avatar size="lg">{user.name.charAt(0).toUpperCase()}</Avatar>
        <div className="pixel-user-detail-info">
          <h3>{user.name}</h3>
          <p>{user.email}</p>
          <div className="pixel-user-detail-tags">
            <Tag color={roleInfo.color} closable={false}>{roleInfo.label}</Tag>
            <Tag color={statusInfo.color} closable={false}>{statusInfo.label}</Tag>
          </div>
        </div>
      </div>

      <Card variant="outlined" size="sm" className="pixel-user-detail-card">
        <Descriptions
          items={[
            { label: "User ID", children: `#${user.id}` },
            { label: "Role", children: user.role },
            { label: "Status", children: user.status },
            { label: "Orders", children: user.orders.toString() },
            { label: "Created", children: user.createdAt, span: 2 },
          ]}
          bordered
          column={2}
        />
      </Card>
    </Modal>
  );
}
