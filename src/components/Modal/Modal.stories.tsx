import type { Meta, StoryObj } from "@storybook/react";
import { fn, userEvent, within, expect } from "@storybook/test";
import Modal, { type ModalProps } from ".";
import Button from "../Button";
import { useState } from "react";

const meta: Meta<ModalProps> = {
  title: "Components/Feedback/Modal",
  component: Modal,
  tags: ["autodocs"],
  decorators: [
    (Story) => {
      // 给 story 包一层可点击的开关按钮，避免 Modal 默认空页面
      return <Story />;
    },
  ],
  argTypes: {
    size: {
      control: "radio",
      options: ["sm", "md", "lg"],
      table: { defaultValue: { summary: "md" } },
    },
    closable: { control: "boolean" },
    maskClosable: { control: "boolean" },
    keyboard: { control: "boolean" },
    onClose: { action: "close" },
  },
  args: {
    open: true,
    title: "Hello Pixel Modal",
    onClose: fn(),
  },
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 基础模态（默认中等尺寸、可关闭） */
export const Basic: Story = {};

/** 自定义 footer（确认/取消按钮） */
export const WithCustomFooter: Story = {
  args: {
    footer: (
      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
        <Button variant="secondary">Cancel</Button>
        <Button variant="primary">OK</Button>
      </div>
    ),
  },
};

/** 小尺寸 */
export const Small: Story = {
  args: { size: "sm" },
};

/** 可交互：点按钮打开 Modal、Esc 关闭 */
export const Interaction: Story = {
  args: { open: false },
  render: ({ open: _openIgnored, onClose, ...args }) => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Modal</Button>
        <Modal {...args} open={open} onClose={() => { onClose?.(); setOpen(false); }} />
      </>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Open Modal" }));
    const dialog = canvas.getByRole("dialog");
    await expect(dialog).toBeInTheDocument();
  },
};
