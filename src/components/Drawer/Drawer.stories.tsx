import type { Meta, StoryObj } from "@storybook/react";
import Drawer, { type DrawerProps } from ".";
import Button from "../Button";
import { useState } from "react";

const meta: Meta<DrawerProps> = {
  title: "Components/Feedback/Drawer",
  component: Drawer,
  tags: ["autodocs"],
  argTypes: {
    placement: {
      control: "radio",
      options: ["left", "right"],
      table: { defaultValue: { summary: "right" } },
    },
    closable: { control: "boolean", table: { defaultValue: { summary: "true" } } },
    maskClosable: { control: "boolean", table: { defaultValue: { summary: "true" } } },
    keyboard: { control: "boolean", table: { defaultValue: { summary: "true" } } },
    onClose: { action: "close" },
  },
  args: {
    open: true,
    title: "Pixel Drawer",
    placement: "right",
    children: (
      <div>
        <p>This is the drawer content.</p>
        <p>Press <kbd>Esc</kbd> or click the mask to close.</p>
      </div>
    ),
  },
} satisfies Meta<typeof Drawer>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 默认右侧抽屉（打开态） */
export const Basic: Story = {};

/** 从左侧滑入 */
export const PlacementLeft: Story = {
  args: { placement: "left", title: "Left Drawer" },
};

/** 无标题、无关闭按钮（仅遮罩/Esc 关闭） */
export const NoHeader: Story = {
  args: { title: undefined, closable: false },
};

/** 可交互：点按钮打开 */
export const Interaction: Story = {
  args: { open: false },
  render: ({ open: _o, onClose, ...args }) => {
    const [open, setOpen] = useState(false);
    return (
      <div style={{ display: "flex", gap: 8 }}>
        <Button onClick={() => setOpen(true)}>Open Right Drawer</Button>
        <Drawer
          {...args}
          open={open}
          onClose={() => { onClose?.(); setOpen(false); }}
        >
          <p>Drawer body content. Lorem ipsum pixel style.</p>
          <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
            <Button variant="primary" onClick={() => { onClose?.(); setOpen(false); }}>
              Confirm
            </Button>
            <Button variant="secondary" onClick={() => { onClose?.(); setOpen(false); }}>
              Cancel
            </Button>
          </div>
        </Drawer>
      </div>
    );
  },
};
