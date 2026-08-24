import type { Meta, StoryObj } from "@storybook/react";
import Alert, { type AlertProps } from ".";

const meta: Meta<AlertProps> = {
  title: "Components/Feedback/Alert",
  component: Alert,
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: "select",
      options: ["info", "success", "warning", "error"],
      table: { defaultValue: { summary: "info" } },
    },
    closable: { control: "boolean" },
    showIcon: { control: "boolean", table: { defaultValue: { summary: "true" } } },
  },
  args: {
    message: "This is an alert message.",
    type: "info",
  },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 信息提示（默认） */
export const Info: Story = {};

/** 四种类型并排对比 */
export const Types: Story = {
  render: (props) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <Alert {...props} type="info"    message="Info — Here is an informational notice." />
      <Alert {...props} type="success" message="Success — Operation completed successfully." />
      <Alert {...props} type="warning" message="Warning — Please check your input carefully." />
      <Alert {...props} type="error"   message="Error — Something went wrong. Please retry." />
    </div>
  ),
};

/** 带详细描述（description） */
export const WithDescription: Story = {
  args: {
    type: "success",
    message: "🎉 Deployment succeeded",
    description: "Your site has been deployed to production. CDN propagation may take a few minutes.",
  },
};

/** 可关闭（关闭后从 DOM 移除） */
export const Closable: Story = {
  args: {
    type: "warning",
    message: "⚠️ This alert can be dismissed",
    closable: true,
  },
};

/** 不显示图标 */
export const WithoutIcon: Story = {
  args: { showIcon: false, message: "Alert without icon (plain text only)." },
};
