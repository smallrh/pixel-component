import { useState, useCallback } from "react";
import Tabs, { type TabItem } from "../../components/Tabs";
import Button from "../../components/Button";
import Icon from "../../components/Icon";
import Card from "../../components/Card";
import Progress from "../../components/Progress";
import Timeline from "../../components/Timeline";
import Alert from "../../components/Alert";
import StatCard from "./components/StatCard";
import ActivityCard from "./components/ActivityCard";
import UserTable from "./components/UserTable";
import UserForm, { type UserFormValues } from "./components/UserForm";
import UserDetailModal from "./components/UserDetailModal";
import DeleteConfirmModal from "./components/DeleteConfirmModal";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import { message } from "../../components/Message";
import {
  mockUsers,
  mockActivities,
  mockOrders,
  statistics,
  type User,
  type Activity,
} from "./mock";
import "./Dashboard.css";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [loading, setLoading] = useState(false);
  const [activities, setActivities] = useState<Activity[]>(mockActivities);

  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const [detailOpen, setDetailOpen] = useState(false);
  const [detailUser, setDetailUser] = useState<User | null>(null);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteUser, setDeleteUser] = useState<User | null>(null);

  const handleToast = useCallback(() => {
    message({ content: "Operation completed successfully", type: "success", duration: 3 });
  }, []);

  const handleCreate = useCallback(() => {
    setFormMode("create");
    setEditingUser(null);
    setFormOpen(true);
  }, []);

  const handleEdit = useCallback((user: User) => {
    setFormMode("edit");
    setEditingUser(user);
    setFormOpen(true);
    setDetailOpen(false);
  }, []);

  const handleView = useCallback((user: User) => {
    setDetailUser(user);
    setDetailOpen(true);
  }, []);

  const handleDelete = useCallback((user: User) => {
    setDeleteUser(user);
    setDeleteOpen(true);
  }, []);

  const handleFormSubmit = useCallback(
    (values: UserFormValues) => {
      if (formMode === "create") {
        const newUser: User = {
          id: Date.now(),
          name: values.name,
          email: values.email,
          role: values.role as User["role"],
          status: values.status as User["status"],
          orders: 0,
          createdAt: new Date().toISOString().split("T")[0],
        };
        setUsers((prev) => [...prev, newUser]);
        message({ content: "User created successfully", type: "success", duration: 3 });
      } else if (editingUser) {
        setUsers((prev) =>
          prev.map((u) =>
            u.id === editingUser.id
              ? {
                  ...u,
                  name: values.name,
                  email: values.email,
                  role: values.role as User["role"],
                }
              : u
          )
        );
        message({ content: "User updated successfully", type: "success", duration: 3 });
      }
      setFormOpen(false);
    },
    [formMode, editingUser]
  );

  const handleDeleteConfirm = useCallback(() => {
    if (deleteUser) {
      setUsers((prev) => prev.filter((u) => u.id !== deleteUser.id));
      setActivities((prev) => [
        {
          id: Date.now(),
          user: "System",
          action: "Deleted user",
          target: deleteUser.name,
          time: "Just now",
          status: "error",
        },
        ...prev,
      ]);
      message({ content: "User deleted successfully", type: "success", duration: 3 });
    }
    setDeleteOpen(false);
  }, [deleteUser]);

  const simulateLoading = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      message({ content: "Data loaded successfully", type: "info", duration: 2 });
    }, 1500);
  }, []);

  const tabs: TabItem[] = [
    { key: "overview", label: "Overview", children: <OverviewTab users={users} activities={activities} onToast={handleToast} onSimulateLoading={simulateLoading} /> },
    { key: "analytics", label: "Analytics", children: <AnalyticsTab /> },
    { key: "users", label: "Users", children: (
      <UserTable
        users={users}
        loading={loading}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onCreate={handleCreate}
      />
    )},
    { key: "orders", label: "Orders", children: <OrdersTab /> },
    { key: "logs", label: "System Logs", children: <SystemLogsTab /> },
  ];

  return (
    <div className="pixel-dashboard">
      <Sidebar
        selectedKey={activeTab}
        onSelect={setActiveTab}
        collapsed={sidebarCollapsed}
      />
      <div className="pixel-dashboard-main">
        <Header
          onMenuToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          onUserSelect={(key) => {
            if (key === "logout") {
              message({ content: "Logged out successfully", type: "info", duration: 2 });
            }
          }}
          onNotificationClick={() =>
            message({ content: "You have 3 new notifications", type: "info", duration: 3 })
          }
          notificationCount={3}
        />
        <main className="pixel-dashboard-content">
          <div className="pixel-dashboard-tabs">
            <Tabs items={tabs} activeKey={activeTab} onChange={setActiveTab} size="md" />
          </div>
        </main>
      </div>

      <UserForm
        open={formOpen}
        mode={formMode}
        user={editingUser}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
      />
      <UserDetailModal
        open={detailOpen}
        user={detailUser}
        onClose={() => setDetailOpen(false)}
        onEdit={handleEdit}
      />
      <DeleteConfirmModal
        open={deleteOpen}
        user={deleteUser}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}

interface OverviewTabProps {
  users: User[];
  activities: Activity[];
  onToast: () => void;
  onSimulateLoading: () => void;
}

function OverviewTab({ users, activities, onToast, onSimulateLoading }: OverviewTabProps) {
  return (
    <div className="pixel-overview">
      <div className="pixel-stat-grid">
        <StatCard
          title="Total Users"
          value={statistics.totalUsers.value}
          change={statistics.totalUsers.change}
          trend="up"
          color="primary"
          icon={<Icon name="user" size="md" />}
        />
        <StatCard
          title="Revenue"
          value={statistics.revenue.value}
          change={statistics.revenue.change}
          trend="up"
          color="success"
          icon={<Icon name="star" size="md" />}
        />
        <StatCard
          title="Orders"
          value={statistics.orders.value}
          change={statistics.orders.change}
          trend="up"
          color="warning"
          icon={<Icon name="download" size="md" />}
        />
        <StatCard
          title="Growth"
          value={statistics.growth.value}
          change={statistics.growth.change}
          trend="up"
          color="danger"
          icon={<Icon name="arrow-up" size="md" />}
        />
      </div>

      <div className="pixel-overview-row">
        <Card
          variant="outlined"
          size="md"
          title={<span className="pixel-card-title">System Health</span>}
          extra={
            <Button variant="secondary" size="sm" onClick={onSimulateLoading}>
              <Icon name="refresh" size="sm" />
              Refresh
            </Button>
          }
          className="pixel-health-card"
        >
          <div className="pixel-health-content">
            <div className="pixel-health-item">
              <span className="pixel-health-label">CPU Usage</span>
              <Progress percent={67} showInfo strokeColor="var(--pixel-color-primary, #000)" />
            </div>
            <div className="pixel-health-item">
              <span className="pixel-health-label">Memory</span>
              <Progress percent={45} showInfo strokeColor="var(--pixel-color-success, #00a000)" />
            </div>
            <div className="pixel-health-item">
              <span className="pixel-health-label">Storage</span>
              <Progress percent={92} showInfo strokeColor="var(--pixel-color-warning, #d48806)" />
            </div>
          </div>
        </Card>

        <ActivityCard activities={activities.slice(0, 5)} />
      </div>

      <div className="pixel-overview-alerts">
        <Alert type="info" message="New version 2.0.0 is available. Update now?" />
        <Alert type="warning" message="Storage usage is above 90%. Consider cleaning up." />
      </div>
    </div>
  );
}

function AnalyticsTab() {
  return (
    <div className="pixel-analytics">
      <Card
        variant="outlined"
        size="lg"
        title={<span className="pixel-card-title">Revenue Analytics</span>}
        className="pixel-chart-card"
      >
        <div className="pixel-chart-placeholder">
          <div className="pixel-pixel-chart">
            {[40, 60, 35, 75, 55, 80, 45, 90, 65, 85, 50, 95].map((height, i) => (
              <div
                key={i}
                className="pixel-chart-bar"
                style={{ height: `${height}%` }}
              >
                <span className="pixel-chart-label">{["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i]}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <Card variant="outlined" size="md" title={<span className="pixel-card-title">Activity Timeline</span>}>
        <Timeline
          items={mockActivities.slice(0, 6).map((a) => ({
            key: String(a.id),
            children: (
              <div>
                <strong>{a.user}</strong> {a.action} <em>{a.target}</em>
                <div className="pixel-timeline-time">{a.time}</div>
              </div>
            ),
            color: a.status === "success" ? "green" : a.status === "error" ? "red" : a.status === "warning" ? "blue" : "default",
          }))}
        />
      </Card>
    </div>
  );
}

function OrdersTab() {
  return (
    <div className="pixel-orders">
      <Card variant="outlined" size="md" title={<span className="pixel-card-title">Recent Orders</span>}>
        <table className="pixel-orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>User</th>
              <th>Product</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {mockOrders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.user}</td>
                <td>{order.product}</td>
                <td>${order.amount.toFixed(2)}</td>
                <td>
                  <span className={`pixel-order-status pixel-order-status--${order.status}`}>
                    {order.status.toUpperCase()}
                  </span>
                </td>
                <td>{order.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

function SystemLogsTab() {
  return (
    <div className="pixel-logs">
      <Card variant="outlined" size="md" title={<span className="pixel-card-title">System Logs</span>}>
        <Timeline
          items={[
            { key: "1", children: <div><strong>[INFO]</strong> System started successfully<div className="pixel-timeline-time">2026-08-24 08:00:00</div></div>, color: "green" },
            { key: "2", children: <div><strong>[WARNING]</strong> Disk space running low (92%)<div className="pixel-timeline-time">2026-08-24 09:30:00</div></div>, color: "blue" },
            { key: "3", children: <div><strong>[ERROR]</strong> Failed to connect to external API<div className="pixel-timeline-time">2026-08-24 10:15:00</div></div>, color: "red" },
            { key: "4", children: <div><strong>[INFO]</strong> Scheduled backup completed<div className="pixel-timeline-time">2026-08-24 12:00:00</div></div>, color: "default" },
            { key: "5", children: <div><strong>[SUCCESS]</strong> User authentication restored<div className="pixel-timeline-time">2026-08-24 14:22:00</div></div>, color: "green" },
          ]}
        />
      </Card>
    </div>
  );
}
