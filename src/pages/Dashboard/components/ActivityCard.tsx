import Card from "../../../components/Card";
import Avatar from "../../../components/Avatar";
import Tag from "../../../components/Tag";
import Icon from "../../../components/Icon";
import type { Activity } from "../mock";
import "./ActivityCard.css";

export interface ActivityCardProps {
  activities: Activity[];
}

const statusTagMap: Record<Activity["status"], { color: "green" | "red" | "blue" | "yellow"; label: string }> = {
  success: { color: "green", label: "SUCCESS" },
  warning: { color: "yellow", label: "WARNING" },
  error: { color: "red", label: "ERROR" },
  info: { color: "blue", label: "INFO" },
};

export default function ActivityCard({ activities }: ActivityCardProps) {
  return (
    <Card
      variant="outlined"
      size="md"
      title={<span className="pixel-activity-card-title">Recent Activities</span>}
      extra={<span className="pixel-activity-card-count">{activities.length}</span>}
      className="pixel-activity-card"
    >
      <div className="pixel-activity-list">
        {activities.map((activity) => {
          const tagInfo = statusTagMap[activity.status];
          return (
            <div key={activity.id} className="pixel-activity-item">
              <Avatar size="sm" className="pixel-activity-avatar">
                {activity.user.charAt(0).toUpperCase()}
              </Avatar>
              <div className="pixel-activity-content">
                <div className="pixel-activity-main">
                  <strong>{activity.user}</strong>
                  <span className="pixel-activity-action">{activity.action}</span>
                  <span className="pixel-activity-target">{activity.target}</span>
                </div>
                <div className="pixel-activity-meta">
                  <Tag color={tagInfo.color} closable={false}>
                    {tagInfo.label}
                  </Tag>
                  <span className="pixel-activity-time">{activity.time}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
