import Modal from "../../../components/Modal";
import Button from "../../../components/Button";
import Icon from "../../../components/Icon";
import type { User } from "../mock";
import "./DeleteConfirmModal.css";

export interface DeleteConfirmModalProps {
  open: boolean;
  user: User | null;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteConfirmModal({ open, user, onClose, onConfirm }: DeleteConfirmModalProps) {
  if (!user) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={
        <span className="pixel-delete-confirm-title">
          <Icon name="warning" size="sm" />
          Delete User
        </span>
      }
      size="sm"
      footer={
        <div className="pixel-delete-confirm-footer">
          <Button variant="secondary" size="md" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="danger" size="md" onClick={onConfirm}>
            <Icon name="trash" size="sm" />
            Delete
          </Button>
        </div>
      }
    >
      <div className="pixel-delete-confirm-content">
        <div className="pixel-delete-confirm-icon">
          <Icon name="warning" size="lg" />
        </div>
        <p>
          Are you sure you want to delete user{" "}
          <strong className="pixel-delete-confirm-name">{user.name}</strong>?
        </p>
        <p className="pixel-delete-confirm-warning">
          This action cannot be undone. The user's data will be permanently removed.
        </p>
      </div>
    </Modal>
  );
}
