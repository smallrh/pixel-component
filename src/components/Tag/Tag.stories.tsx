import type { Meta, StoryObj } from "@storybook/react";
import Tag, { type TagProps } from ".";
import { useState } from "react";

const meta: Meta<TagProps> = {
  title: "Components/Data Display/Tag",
  component: Tag,
  tags: ["autodocs"],
  argTypes: {
    color: {
      control: "select",
      options: ["default", "red", "green", "blue", "yellow"],
      table: { defaultValue: { summary: "default" } },
    },
    closable: { control: "boolean" },
    onClose: { action: "closed" },
  },
  args: { children: "Tag Label" },
} satisfies Meta<typeof Tag>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 默认标签（白底黑字） */
export const Default: Story = {};

/** 五种颜色并排对比 */
export const Colors: Story = {
  render: (props) => (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      <Tag {...props} color="default">Default</Tag>
      <Tag {...props} color="red">Red</Tag>
      <Tag {...props} color="green">Green</Tag>
      <Tag {...props} color="blue">Blue</Tag>
      <Tag {...props} color="yellow">Yellow</Tag>
    </div>
  ),
};

/** 可关闭（关闭时触发 onClose） */
export const Closable: Story = {
  render: () => {
    const [tags, setTags] = useState(["React", "TypeScript", "Vite", "Pixel UI"]);
    return (
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {tags.map((t) => (
          <Tag
            key={t}
            closable
            color="green"
            onClose={() => setTags((prev) => prev.filter((x) => x !== t))}
          >
            {t}
          </Tag>
        ))}
        {tags.length === 0 && (
          <span style={{ color: "#999" }}>All tags closed</span>
        )}
      </div>
    );
  },
};
