import type { Meta, StoryObj } from "@storybook/react";
import Input, { type InputProps } from ".";
import Button from "../Button";
import { useState } from "react";

const meta: Meta<InputProps> = {
  title: "Components/Data Entry/Input",
  component: Input,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["outlined", "filled"],
      description: "视觉样式变体",
      table: { defaultValue: { summary: "outlined" } },
    },
    size: {
      control: "radio",
      options: ["sm", "md", "lg"],
      description: "尺寸",
      table: { defaultValue: { summary: "md" } },
    },
    disabled: { control: "boolean" },
    onChange: { action: "changed" },
  },
  args: {
    placeholder: "Please input",
    variant: "outlined",
    size: "md",
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 基础输入框（outlined 描边样式） */
export const Basic: Story = {};

/** 填充样式变体 */
export const Filled: Story = {
  args: { variant: "filled", placeholder: "Filled style" },
};

/** 三种尺寸并排对比 */
export const Sizes: Story = {
  render: (props) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 360 }}>
      <Input {...props} size="sm" placeholder="Small (sm)" />
      <Input {...props} size="md" placeholder="Medium (md)" />
      <Input {...props} size="lg" placeholder="Large (lg)" />
    </div>
  ),
};

/** 禁用态 */
export const Disabled: Story = {
  args: { disabled: true, value: "Disabled value" },
};

/** 受控模式：value + onChange */
export const Controlled: Story = {
  render: () => {
    const [v, setV] = useState("");
    return (
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <Input
          value={v}
          onChange={(e) => setV(e.target.value)}
          placeholder="Type something..."
          style={{ width: 260 }}
        />
        <Button variant="secondary" onClick={() => setV("")}>
          Clear
        </Button>
        <span style={{ color: "#666" }}>→ "{v}"</span>
      </div>
    );
  },
};

/** 子组件：TextArea 多行文本域 */
export const TextArea: Story = {
  render: (props) => (
    <Input.TextArea
      {...props}
      placeholder="Enter multi-line text..."
      rows={4}
      style={{ width: 420 }}
    />
  ),
};

/** 子组件：Password 密码（可显隐） */
export const Password: Story = {
  render: (props) => (
    <Input.Password {...props} placeholder="Enter password" style={{ width: 280 }} />
  ),
};

/** 子组件：Search 搜索框 */
export const Search: Story = {
  render: (props) => (
    <Input.Search
      {...props}
      placeholder="Search..."
      style={{ width: 320 }}
      onSearch={(v) => alert(`Search: ${v}`)}
    />
  ),
};
