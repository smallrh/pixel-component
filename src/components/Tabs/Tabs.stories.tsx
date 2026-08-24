import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import Tabs from "./Tabs";
import type { TabItem } from "./Tabs";
import Alert from "../Alert";
import Button from "../Button";

/**
 * 所有 items 都定义为模块级常量，避免 Storybook Controls 系统在 args 中
 * 内联处理 ReactNode（label/children）导致序列化失败或内部状态循环。
 */
const basicItems: TabItem[] = [
  { key: "tab1", label: "Tab 1", children: <p>Content of Tab 1. Hello pixel UI!</p> },
  { key: "tab2", label: "Tab 2", children: <p>Content of Tab 2. Here goes another panel.</p> },
  { key: "tab3", label: "Disabled", disabled: true, children: <p>You should not see this.</p> },
  { key: "tab4", label: "Tab 4", children: <Alert type="success" message="Panel 4 content" /> },
];

const sizeItems: TabItem[] = [
  { key: "a", label: "Tab A", children: <p>Content for Tab A.</p> },
  { key: "b", label: "Tab B", children: <p>Content for Tab B.</p> },
];

const controlledItems: TabItem[] = [
  { key: "home", label: "Home", children: <Alert type="info" message="🏠 Home panel" /> },
  { key: "profile", label: "Profile", children: <Alert type="success" message="👤 Profile panel" /> },
  { key: "settings", label: "Settings", children: <Alert type="warning" message="⚙️ Settings panel" /> },
];

const meta: Meta<typeof Tabs> = {
  title: "Components/Navigation/Tabs",
  component: Tabs,
  tags: ["autodocs"],
  argTypes: {
    // items 包含 ReactNode，Storybook Controls 无法正确序列化。
    // 完全禁用 Controls 和 Docs 表格显示，只在 story 代码中静态定义。
    items: {
      control: false,
      table: { disable: true },
    },
    size: {
      control: "radio",
      options: ["sm", "md", "lg"],
      table: { defaultValue: { summary: "md" } },
    },
    onChange: { action: "changed" },
  },
  args: {
    // 仅提供非 ReactNode 的默认值（items 不在 args 中定义）
    size: "md",
  },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof Tabs>;

/** 基础用法：点击 Tab 切换内容 */
export const Basic: Story = {
  args: {
    size: "md"
  },

  render: () => <Tabs items={basicItems} />
};

/** 三种尺寸并排展示 */
export const Sizes: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <Tabs size="sm" items={sizeItems} />
      <Tabs size="md" items={sizeItems} />
      <Tabs size="lg" items={sizeItems} />
    </div>
  ),
};

/** 受控模式：外部 useState 管理 activeKey，通过 onChange 同步 */
export const Controlled: Story = {
  render: () => {
    type K = (typeof controlledItems)[number]["key"];
    const [active, setActive] = useState<K>("home");
    return (
      <div>
        <div style={{ marginBottom: 12, display: "flex", gap: 8 }}>
          {controlledItems.map((it) => (
            <Button
              key={it.key}
              variant={active === it.key ? "primary" : "secondary"}
              onClick={() => setActive(it.key)}
            >
              Go to {it.label}
            </Button>
          ))}
        </div>
        <Tabs
          activeKey={active}
          onChange={(key) => setActive(key as K)}
          items={controlledItems}
        />
      </div>
    );
  },
};
