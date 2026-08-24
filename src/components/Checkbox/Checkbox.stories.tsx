import type { Meta, StoryObj } from "@storybook/react";
import Checkbox, { type CheckboxProps } from ".";
import { useState } from "react";

const meta: Meta<CheckboxProps> = {
  title: "Components/Data Entry/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
  argTypes: {
    checked: { control: "boolean" },
    indeterminate: { control: "boolean" },
    disabled: { control: "boolean" },
    onChange: { action: "changed" },
  },
  args: {
    children: "Checkbox label",
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 基础勾选（非受控） */
export const Basic: Story = {};

/** 默认已勾选 */
export const Checked: Story = {
  args: { checked: true, children: "Checked by default" },
};

/** 半选状态（indeterminate，用于全选子项未全选场景） */
export const Indeterminate: Story = {
  args: { indeterminate: true, children: "Indeterminate state" },
};

/** 禁用态（未勾选 + 已勾选 + 半选） */
export const Disabled: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <Checkbox disabled>Disabled unchecked</Checkbox>
      <Checkbox disabled checked>Disabled checked</Checkbox>
      <Checkbox disabled indeterminate>Disabled indeterminate</Checkbox>
    </div>
  ),
};

/** 受控模式 + 全选/半选联动演示 */
export const ControlledGroup: Story = {
  render: () => {
    const items = ["Apple", "Banana", "Cherry"];
    const [checkedList, setCheckedList] = useState<string[]>(["Apple"]);
    const allChecked = checkedList.length === items.length;
    const indeterminate = checkedList.length > 0 && !allChecked;

    const toggle = (name: string) =>
      setCheckedList((prev) =>
        prev.includes(name) ? prev.filter((x) => x !== name) : [...prev, name]
      );
    const toggleAll = () =>
      setCheckedList(allChecked ? [] : [...items]);

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <Checkbox
          checked={allChecked}
          indeterminate={indeterminate}
          onChange={toggleAll}
        >
          Check all
        </Checkbox>
        <div style={{ display: "flex", flexDirection: "column", gap: 4, paddingLeft: 20 }}>
          {items.map((it) => (
            <Checkbox
              key={it}
              checked={checkedList.includes(it)}
              onChange={() => toggle(it)}
            >
              {it}
            </Checkbox>
          ))}
        </div>
      </div>
    );
  },
};
