import Card from "../../../components/Card";
import Statistic from "../../../components/Statistic";
import Tag from "../../../components/Tag";
import Icon from "../../../components/Icon";
import type { ReactNode } from "react";
import "./StatCard.css";

export interface StatCardProps {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: ReactNode;
  color: "primary" | "success" | "warning" | "danger";
}

const colorMap = {
  primary: { bg: "var(--pixel-bg-primary, #e6e6e6)", text: "var(--pixel-color-primary, #000)" },
  success: { bg: "var(--pixel-bg-success, #e6ffe6)", text: "var(--pixel-color-success, #00a000)" },
  warning: { bg: "var(--pixel-bg-warning, #fff7e6)", text: "var(--pixel-color-warning, #d48806)" },
  danger: { bg: "var(--pixel-bg-danger, #ffe6e6)", text: "var(--pixel-color-danger, #d40000)" },
};

export default function StatCard({ title, value, change, trend, icon, color }: StatCardProps) {
  const colors = colorMap[color];

  return (
    <Card variant="outlined" size="md" className="pixel-stat-card">
      <div className="pixel-stat-card-header">
        <span className="pixel-stat-card-title">{title}</span>
        <div
          className="pixel-stat-card-icon"
          style={{ background: colors.bg, color: colors.text }}
        >
          {icon}
        </div>
      </div>
      <Statistic
        value={<span className="pixel-stat-card-value">{value}</span>}
      />
      <div className="pixel-stat-card-footer">
        <Tag
          color={trend === "up" ? "green" : "red"}
          closable={false}
        >
          <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
            <Icon name={trend === "up" ? "arrow-up" : "arrow-down"} size="sm" />
            {change}
          </span>
        </Tag>
        <span className="pixel-stat-card-period">this month</span>
      </div>
    </Card>
  );
}
