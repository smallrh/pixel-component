# pixel-ui

一个基于 React 19 + TypeScript 的像素风格（Pixel / 8-bit）组件库，提供 70+ 个组件，API 风格贴近 [Ant Design](https://ant.design)，视觉风格致敬经典 8-bit 游戏。

## ✨ 特性

- 🕹️ **像素风格**：内置 "Press Start 2P" 与 "Fusion Pixel" 像素字体，自带像素点阵图标库（Icon）
- 📦 **70+ 组件**：覆盖布局、导航、数据录入、数据展示、反馈、通用六大类
- 🎨 **主题系统**：通过 `ConfigProvider` / `Theme` 定制主色、字体、圆角
- 🌍 **国际化**：`LocaleProvider` 提供多语言文案插槽
- ⚡ **TypeScript 优先**：完整类型定义，零 `any` 逃逸

## 📦 安装

```bash
npm install react-ui-pixel react react-dom
# 或
pnpm add react-ui-pixel react react-dom
```

## 🚀 快速开始

```tsx
import { Button, ConfigProvider, Theme } from "pixel-ui";
import "pixel-ui/style.css";
export default function App() {
  return (
    <ConfigProvider theme={{ primaryColor: "#000" }}>
      <Theme>
        <Button variant="primary">Hello Pixel!</Button>
      </Theme>
    </ConfigProvider>
  );
}
```

## 🖥️ 本地开发

```bash
npm install     # 安装依赖
npm run dev     # 启动开发服务器（Playground 演示所有组件，右上角可切换到 Docs 文档页）
```

## 🔨 构建

```bash
npm run build   # 类型检查 + 库构建（ES/CJS）+ 生成 .d.ts
```

产物输出到 `dist/`：

```
dist/
├── pixel-ui.es.js      # ES Module 产物
├── pixel-ui.cjs        # CommonJS 产物
├── pixel-ui.css        # 全量样式
└── types/              # TypeScript 类型声明
```

## 📚 组件列表

### 通用 / General
| 组件 | 说明 |
| --- | --- |
| Button | 按钮（primary / secondary / danger，sm/md/lg） |
| FloatButton | 悬浮按钮 + BackTop 回到顶部 |
| Icon | 像素点阵图标库（36 个图标） |
| Typography | 排版系统（Title / Text / Paragraph / Link） |
| ConfigProvider | 全局配置（主题、语言） |
| Theme | 主题 Token → CSS 变量注入 |
| LocaleProvider | 国际化文案 |
| App | 应用级上下文（message / notification 快捷入口） |

### 布局 / Layout
| 组件 | 说明 |
| --- | --- |
| Layout | 页面骨架（Header / Sider / Content / Footer） |
| Grid | 栅格（Row / Col） |
| Flex | Flex 布局容器 |
| Space | 间距容器 |
| Splitter | 可拖拽分割面板 |
| Divider | 分割线 |

### 导航 / Navigation
| 组件 | 说明 |
| --- | --- |
| Menu | 菜单（horizontal / vertical） |
| Dropdown | 下拉菜单 |
| Breadcrumb | 面包屑 |
| Tabs | 标签页 |
| Pagination | 分页 |
| Steps | 步骤条 |
| Affix | 固钉 |
| Anchor | 锚点 |

### 数据录入 / Data Entry
| 组件 | 说明 |
| --- | --- |
| Input | 输入框（Input.TextArea / Input.Password / Input.Search） |
| InputNumber | 数字输入框 |
| Select | 选择器 |
| AutoComplete | 自动完成 |
| Cascader | 级联选择 |
| TreeSelect | 树选择 |
| Mentions | 提及 |
| Radio | 单选框 |
| Checkbox | 复选框 |
| Switch | 开关 |
| Slider | 滑块 |
| Rate | 评分 |
| Form | 表单（FormItem + 校验） |
| DatePicker | 日期选择 |
| TimePicker | 时间选择 |
| ColorPicker | 颜色选择 |
| Upload | 上传 |
| Transfer | 穿梭框 |
| EditableTable | 可编辑表格 |

### 数据展示 / Data Display
| 组件 | 说明 |
| --- | --- |
| Table | 表格 |
| List | 列表 |
| Descriptions | 描述列表 |
| Card | 卡片 |
| Avatar | 头像 |
| Badge | 徽标 |
| Ribbon | 缎带 |
| Tag | 标签 |
| Statistic | 统计数值 + Statistic.Countdown |
| Calendar | 日历 |
| Timeline | 时间轴 |
| Carousel | 轮播 |
| Image | 图片 |
| QRCode | 二维码 |
| Tree | 树形控件 |
| Collapse | 折叠面板 |
| Empty | 空状态 |
| Skeleton | 骨架屏 |

### 反馈 / Feedback
| 组件 | 说明 |
| --- | --- |
| Alert | 警告提示 |
| Modal | 对话框 |
| Drawer | 抽屉 |
| Message | 全局消息 |
| Notification | 通知提醒 |
| Toast | 轻提示 |
| Popconfirm | 气泡确认框 |
| Popover | 气泡卡片 |
| Tooltip | 文字提示 |
| Tour | 漫游式引导 |
| Progress | 进度条 |
| Spin | 加载中 |
| Result | 结果页 |
| PageHeader | 页头 |

## 📖 文档

- `src/docs/` — 组件文档演示页（Playground 右上角切换）
- `component.md` — 全组件体系规划文档

## 🤝 参与贡献

1. Fork 本仓库
2. 创建功能分支（`feat/xxx`）
3. 提交变更
4. 发起 Pull Request

## 📄 License

MIT
