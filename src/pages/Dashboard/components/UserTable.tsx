import { useState, useMemo } from "react";
import Table, { type TableColumn, type TableRecord } from "../../../components/Table";
import Pagination from "../../../components/Pagination";
import Checkbox from "../../../components/Checkbox";
import Avatar from "../../../components/Avatar";
import Tag from "../../../components/Tag";
import Button from "../../../components/Button";
import Dropdown, { type DropdownItem } from "../../../components/Dropdown";
import Icon from "../../../components/Icon";
import Skeleton from "../../../components/Skeleton";
import Empty from "../../../components/Empty";
import Tooltip from "../../../components/Tooltip";
import Input from "../../../components/Input";
import Select from "../../../components/Select";
import type { User } from "../mock";
import "./UserTable.css";

export interface UserTableProps {
  users: User[];
  loading: boolean;
  onView: (user: User) => void;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  onCreate: () => void;
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

export default function UserTable({
  users,
  loading,
  onView,
  onEdit,
  onDelete,
  onCreate,
}: UserTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        searchText === "" ||
        user.name.toLowerCase().includes(searchText.toLowerCase()) ||
        user.email.toLowerCase().includes(searchText.toLowerCase());
      const matchesStatus = statusFilter === "all" || user.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [users, searchText, statusFilter]);

  const pagedUsers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredUsers.slice(start, start + pageSize);
  }, [filteredUsers, currentPage, pageSize]);

  const allSelected = pagedUsers.length > 0 && pagedUsers.every((u) => selectedIds.has(u.id));
  const someSelected = pagedUsers.some((u) => selectedIds.has(u.id)) && !allSelected;

  const toggleAll = () => {
    if (allSelected) {
      const next = new Set(selectedIds);
      pagedUsers.forEach((u) => next.delete(u.id));
      setSelectedIds(next);
    } else {
      const next = new Set(selectedIds);
      pagedUsers.forEach((u) => next.add(u.id));
      setSelectedIds(next);
    }
  };

  const toggleOne = (id: number) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const menuItems = (user: User): DropdownItem[] => [
    { key: "view", label: "View Details", icon: <Icon name="eye" size="sm" /> },
    { key: "edit", label: "Edit User", icon: <Icon name="edit" size="sm" /> },
    { key: "divider", label: "", divider: true },
    { key: "delete", label: "Delete User", icon: <Icon name="trash" size="sm" />, danger: true },
  ];

  const handleAction = (action: string, user: User) => {
    switch (action) {
      case "view":
        onView(user);
        break;
      case "edit":
        onEdit(user);
        break;
      case "delete":
        onDelete(user);
        break;
    }
  };

  const columns: TableColumn[] = [
    {
      key: "checkbox",
      title: (
        <Checkbox
          checked={allSelected}
          indeterminate={someSelected}
          onChange={toggleAll}
          disabled={pagedUsers.length === 0}
        >
          <span className="sr-only">Select all</span>
        </Checkbox>
      ),
      dataIndex: "id",
      render: (_: unknown, record: TableRecord) => {
        const user = record as User;
        return (
          <Checkbox
            checked={selectedIds.has(user.id)}
            onChange={() => toggleOne(user.id)}
          >
            <span className="sr-only">Select {user.name}</span>
          </Checkbox>
        );
      },
    },
    {
      key: "user",
      title: "User",
      dataIndex: "name",
      render: (_: unknown, record: TableRecord) => {
        const user = record as User;
        return (
          <div className="pixel-user-cell">
            <Avatar size="sm">{user.name.charAt(0)}</Avatar>
            <div className="pixel-user-cell-info">
              <div className="pixel-user-cell-name">{user.name}</div>
              <div className="pixel-user-cell-email">{user.email}</div>
            </div>
          </div>
        );
      },
    },
    {
      key: "role",
      title: "Role",
      dataIndex: "role",
      render: (_: unknown, record: TableRecord) => {
        const user = record as User;
        const tagInfo = roleTagMap[user.role];
        return <Tag color={tagInfo.color} closable={false}>{tagInfo.label}</Tag>;
      },
    },
    {
      key: "status",
      title: "Status",
      dataIndex: "status",
      render: (_: unknown, record: TableRecord) => {
        const user = record as User;
        const tagInfo = statusTagMap[user.status];
        return <Tag color={tagInfo.color} closable={false}>{tagInfo.label}</Tag>;
      },
    },
    {
      key: "orders",
      title: "Orders",
      dataIndex: "orders",
      render: (value: unknown) => <span className="pixel-user-orders">{value}</span>,
    },
    {
      key: "createdAt",
      title: "Created At",
      dataIndex: "createdAt",
    },
    {
      key: "actions",
      title: "Actions",
      dataIndex: "id",
      render: (_: unknown, record: TableRecord) => {
        const user = record as User;
        return (
          <div className="pixel-user-actions">
            <Tooltip title="View" placement="top">
              <Button variant="secondary" size="sm" onClick={() => onView(user)}>
                <Icon name="eye" size="sm" />
              </Button>
            </Tooltip>
            <Tooltip title="Edit" placement="top">
              <Button variant="secondary" size="sm" onClick={() => onEdit(user)}>
                <Icon name="edit" size="sm" />
              </Button>
            </Tooltip>
            <Dropdown items={menuItems(user)} trigger="click" onSelect={(key) => handleAction(key, user)}>
              <Button variant="secondary" size="sm">
                <Icon name="more" size="sm" />
              </Button>
            </Dropdown>
          </div>
        );
      },
    },
  ];

  return (
    <div className="pixel-user-table-wrapper">
      <div className="pixel-user-table-toolbar">
        <div className="pixel-user-table-search">
          <Input
            variant="filled"
            size="sm"
            placeholder="Search users..."
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
        <div className="pixel-user-table-filter">
          <Select
            options={[
              { label: "All Status", value: "all" },
              { label: "Active", value: "active" },
              { label: "Pending", value: "pending" },
              { label: "Disabled", value: "disabled" },
            ]}
            value={statusFilter}
            onChange={(v) => {
              setStatusFilter(v);
              setCurrentPage(1);
            }}
            size="sm"
          />
        </div>
        <Button variant="primary" size="sm" onClick={onCreate}>
          <Icon name="plus" size="sm" />
          Create User
        </Button>
      </div>

      {loading ? (
        <div className="pixel-user-table-loading">
          <Skeleton avatar={false} title={false} rows={5} />
        </div>
      ) : pagedUsers.length === 0 ? (
        <Empty description="No users found">
          <Button variant="primary" size="sm" onClick={onCreate}>
            <Icon name="plus" size="sm" />
            Create User
          </Button>
        </Empty>
      ) : (
        <>
          <Table
            columns={columns}
            dataSource={pagedUsers as TableRecord[]}
            rowKey="id"
            bordered
            loading={loading}
          />
          <div className="pixel-user-table-pagination">
            <Pagination
              current={currentPage}
              total={filteredUsers.length}
              pageSize={pageSize}
              onChange={setCurrentPage}
              showTotal
              size="sm"
            />
          </div>
        </>
      )}

      {selectedIds.size > 0 && (
        <div className="pixel-user-table-selection-bar">
          <span>{selectedIds.size} user(s) selected</span>
          <Button variant="danger" size="sm" onClick={() => {
            selectedIds.forEach((id) => {
              const user = users.find((u) => u.id === id);
              if (user) onDelete(user);
            });
            setSelectedIds(new Set());
          }}>
            <Icon name="trash" size="sm" />
            Delete Selected
          </Button>
        </div>
      )}
    </div>
  );
}
