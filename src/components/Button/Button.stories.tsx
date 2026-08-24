import type { Meta, StoryObj } from "@storybook/react";
import Button, { type ButtonProps } from ".";

const meta: Meta<ButtonProps> = {
  title: "Components/General/Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "danger"],
      description: "视觉样式变体",
      table: { defaultValue: { summary: "primary" } },
    },
    size: {
      control: "radio",
      options: ["sm", "md", "lg"],
      description: "尺寸",
      table: { defaultValue: { summary: "md" } },
    },
    disabled: { control: "boolean" },
    onClick: { action: "clicked" },
  },
  args: {
    children: "Pixel Button",
    variant: "primary",
    size: "md",
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 默认主按钮 */
export const Primary: Story = {};

/** 次按钮（用于次要操作） */
export const Secondary: Story = {
  args: { variant: "secondary" },
};

/** 危险按钮（用于删除等破坏性操作） */
export const Danger: Story = {
  args: { variant: "danger" },
};

/** 三种尺寸并排对比 */
export const Sizes: Story = {
  render: (props) => (
    <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
      <Button {...props} size="sm">Small (sm)</Button>
      <Button {...props} size="md">Medium (md)</Button>
      <Button {...props} size="lg">Large (lg)</Button>
    </div>
  ),
};

/** 禁用态 */
export const Disabled: Story = {
  args: { disabled: true },
};
