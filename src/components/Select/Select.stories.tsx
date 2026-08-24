import type { Meta, StoryObj } from "@storybook/react";
import Select, { type SelectProps } from ".";
import Button from "../Button";
import { useState } from "react";

const fruitOptions = [
  { label: "Apple", value: "apple" },
  { label: "Banana", value: "banana" },
  { label: "Cherry", value: "cherry" },
  { label: "Durian", value: "durian" },
  { label: "Elderberry", value: "elderberry" },
];

const meta: Meta<SelectProps> = {
  title: "Components/Data Entry/Select",
  component: Select,
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "radio",
      options: ["sm", "md", "lg"],
      table: { defaultValue: { summary: "md" } },
    },
    disabled: { control: "boolean" },
    allowClear: { control: "boolean" },
    onChange: { action: "changed" },
    onOpenChange: { action: "openChange" },
  },
  args: {
    options: fruitOptions,
    placeholder: "Select a fruit",
    size: "md",
    allowClear: true,
  },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 基础选择器（非受控） */
export const Basic: Story = {
  args: { defaultValue: "apple" },
};

/** 带清除按钮 + 无默认值 */
export const WithClear: Story = {};

/** 三种尺寸并排 */
export const Sizes: Story = {
  render: (props) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 280 }}>
      <Select {...props} size="sm" placeholder="Small (sm)" />
      <Select {...props} size="md" placeholder="Medium (md)" />
      <Select {...props} size="lg" placeholder="Large (lg)" />
    </div>
  ),
};

/** 禁用态（含值 + 空值） */
export const Disabled: Story = {
  render: (props) => (
    <div style={{ display: "flex", gap: 12 }}>
      <Select {...props} disabled defaultValue="banana" />
      <Select {...props} disabled placeholder="Disabled empty" />
    </div>
  ),
};

/** 受控模式：value + onChange */
export const Controlled: Story = {
  render: ({ options }) => {
    const [v, setV] = useState<string | undefined>();
    return (
      <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
        <Select
          style={{ width: 220 }}
          options={options}
          value={v}
          onChange={setV}
          placeholder="Pick one..."
        />
        <Button variant="secondary" onClick={() => setV(undefined)}>
          Reset
        </Button>
        <span style={{ color: "#666" }}>→ value: {JSON.stringify(v)}</span>
      </div>
    );
  },
};
