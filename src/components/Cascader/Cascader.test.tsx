import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Cascader, { type CascaderOption } from "./Cascader";

const options: CascaderOption[] = [
  {
    label: "Guangdong",
    value: "gd",
    children: [{ label: "Shenzhen", value: "sz" }],
  },
  { label: "Beijing", value: "bj" },
];

describe("Cascader", () => {
  it("shows placeholder when empty", () => {
    render(<Cascader options={options} placeholder="Pick" />);
    expect(screen.getByText("Pick")).toBeInTheDocument();
  });

  it("renders top-level options and cascades through children", () => {
    const onChange = vi.fn();
    render(<Cascader options={options} onChange={onChange} />);
    fireEvent.click(screen.getByRole("combobox"));
    // 第一列
    expect(screen.getByText("Guangdong")).toBeInTheDocument();
    expect(screen.getByText("Beijing")).toBeInTheDocument();

    // 点击有子级的 Guangdong -> 展开第二列 Shenzhen，不提交
    fireEvent.click(screen.getByText("Guangdong"));
    expect(screen.getByText("Shenzhen")).toBeInTheDocument();
    expect(onChange).not.toHaveBeenCalled();

    // 点击叶子 Shenzhen -> 提交完整路径
    fireEvent.click(screen.getByText("Shenzhen"));
    expect(onChange).toHaveBeenCalledTimes(1);
    const [values, labels] = onChange.mock.calls[0];
    expect(values).toEqual(["gd", "sz"]);
    expect(labels).toEqual(["Guangdong", "Shenzhen"]);
  });

  it("commits immediately for a leaf at top level", () => {
    const onChange = vi.fn();
    render(<Cascader options={options} onChange={onChange} />);
    fireEvent.click(screen.getByRole("combobox"));
    fireEvent.click(screen.getByText("Beijing"));
    expect(onChange).toHaveBeenCalledWith(["bj"], ["Beijing"]);
  });
});
