import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Menu from "./Menu";
import Layout, { Sider } from "../Layout";

const items = [
  { key: "home", icon: "🏠", label: "Home" },
  {
    key: "group",
    icon: "📁",
    label: "Group",
    children: [
      { key: "a", label: "Item A" },
      { key: "b", label: "Item B" },
    ],
  },
];

describe("Menu 跟随 Sider 折叠", () => {
  it("Sider 收起时，内部 Menu 自动进入图标折叠模式", () => {
    const { container } = render(
      <Layout>
        <Sider collapsed>
          <Menu items={items} mode="vertical" />
        </Sider>
      </Layout>
    );
    const nav = container.querySelector(".pixel-menu") as HTMLElement;
    expect(nav.classList.contains("pixel-menu--collapsed")).toBe(true);
    // 文字标签被隐藏（CSS 控制，DOM 仍保留以作 tooltip）
    const label = screen.getByText("Home");
    expect(label.classList.contains("pixel-menu-item-label")).toBe(true);
  });

  it("Sider 展开时，内部 Menu 不折叠", () => {
    const { container } = render(
      <Layout>
        <Sider>
          <Menu items={items} mode="vertical" />
        </Sider>
      </Layout>
    );
    const nav = container.querySelector(".pixel-menu") as HTMLElement;
    expect(nav.classList.contains("pixel-menu--collapsed")).toBe(false);
  });

  it("不在 Sider 内时默认不折叠（保持水平模式）", () => {
    const { container } = render(<Menu items={items} />);
    const nav = container.querySelector(".pixel-menu") as HTMLElement;
    expect(nav.classList.contains("pixel-menu--collapsed")).toBe(false);
    expect(nav.classList.contains("pixel-menu--horizontal")).toBe(true);
  });

  it("显式 inlineCollapsed=true 可在 Sider 外强制折叠", () => {
    const { container } = render(<Menu items={items} inlineCollapsed />);
    const nav = container.querySelector(".pixel-menu") as HTMLElement;
    expect(nav.classList.contains("pixel-menu--collapsed")).toBe(true);
  });

  it("显式 inlineCollapsed=false 可覆盖 Sider 的折叠（不折叠）", () => {
    const { container } = render(
      <Layout>
        <Sider collapsed>
          <Menu items={items} mode="vertical" inlineCollapsed={false} />
        </Sider>
      </Layout>
    );
    const nav = container.querySelector(".pixel-menu") as HTMLElement;
    expect(nav.classList.contains("pixel-menu--collapsed")).toBe(false);
  });

  it("折叠态下子菜单始终渲染（供悬浮弹出），展开态仅按需渲染", () => {
    const { container, rerender } = render(
      <Layout>
        <Sider collapsed>
          <Menu items={items} mode="vertical" />
        </Sider>
      </Layout>
    );
    // 折叠态：Group 的子菜单（Item A / Item B）已就绪
    expect(screen.getByText("Item A")).toBeTruthy();
    expect(screen.getByText("Item B")).toBeTruthy();

    rerender(
      <Layout>
        <Sider>
          <Menu items={items} mode="vertical" />
        </Sider>
      </Layout>
    );
    // 展开态且未点击：子菜单未展开，Item A/B 不在文档中
    expect(screen.queryByText("Item A")).toBeNull();
  });

  it("折叠态下悬浮父项可显示子菜单弹出层", () => {
    render(
      <Layout>
        <Sider collapsed>
          <Menu items={items} mode="vertical" />
        </Sider>
      </Layout>
    );
    // 子菜单 ul 已经渲染（display 由 CSS hover 控制），结构正确
    const submenus = document.querySelectorAll(".pixel-menu--collapsed .pixel-menu-submenu");
    expect(submenus.length).toBeGreaterThan(0);
  });

  it("选中回调仍正常工作", () => {
    const onSelect = vi.fn();
    render(
      <Layout>
        <Sider collapsed>
          <Menu items={items} mode="vertical" onSelect={onSelect} />
        </Sider>
      </Layout>
    );
    fireEvent.click(screen.getByText("Home"));
    expect(onSelect).toHaveBeenCalledWith("home");
  });
});
