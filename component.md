# 全组件体系文档（完整版）

pixel-ui 组件库共 **70+ 个组件**，按功能分为六大类。

## 一、通用 / General（基础能力）

| # | 组件 | 说明 |
|---|------|------|
| 1 | Button | 按钮，支持 `variant`（primary/secondary/danger）、`size`（sm/md/lg）、disabled |
| 2 | FloatButton | 悬浮按钮，附 `FloatButton.BackTop` 回到顶部 |
| 3 | Icon | 像素点阵图标库，36 个内置图标（`IconName` 类型约束） |
| 4 | Typography | 排版系统：`Title` / `Text` / `Paragraph` / `Link` |
| 5 | ConfigProvider | 全局配置：主题（primaryColor/fontFamily/borderRadius）+ 语言 |
| 6 | Theme | 主题 Token → CSS 变量注入（`useTheme()` 读取） |
| 7 | LocaleProvider | 国际化文案（`useLocale()` / `t()`） |
| 8 | App | 应用级上下文（`useApp()` 获取 message / notification 快捷方法） |

## 二、布局 / Layout（页面骨架）

| # | 组件 | 说明 |
|---|------|------|
| 1 | Layout | 页面骨架：`Layout.Header` / `Layout.Sider` / `Layout.Content` / `Layout.Footer` |
| 2 | Grid | 24 栅格系统：`Row` / `Col` |
| 3 | Flex | Flex 布局容器：`vertical` / `gap` / `justify` / `align` / `wrap` |
| 4 | Space | 间距容器：`direction` / `size` / `wrap` |
| 5 | Splitter | 分割面板：水平 / 垂直拖拽 |
| 6 | Divider | 分割线 |

## 三、导航 / Navigation（页面跳转与定位）

| # | 组件 | 说明 |
|---|------|------|
| 1 | Menu | 菜单：horizontal / vertical，支持选中态 |
| 2 | Dropdown | 下拉菜单：click / hover 触发 |
| 3 | Breadcrumb | 面包屑导航 |
| 4 | Tabs | 标签页：受控 / 非受控 |
| 5 | Pagination | 分页器 |
| 6 | Steps | 步骤条 |
| 7 | Affix | 固钉：滚动固定 |
| 8 | Anchor | 锚点：滚动监听 + 平滑滚动 |

## 四、数据录入 / Data Entry（表单输入）

| # | 组件 | 说明 |
|---|------|------|
| 1 | Input | 输入框：`Input.TextArea` / `Input.Password` / `Input.Search` |
| 2 | InputNumber | 数字输入框（步进器） |
| 3 | Select | 选择器（下拉面板 + 外部点击关闭） |
| 4 | AutoComplete | 自动完成（输入过滤建议） |
| 5 | Cascader | 级联选择器（多级联动） |
| 6 | TreeSelect | 树选择器 |
| 7 | Mentions | 提及（@ 触发） |
| 8 | Radio | 单选框组 |
| 9 | Checkbox | 复选框 |
| 10 | Switch | 开关 |
| 11 | Slider | 滑动输入条 |
| 12 | Rate | 评分（星形打分） |
| 13 | Form | 表单：`FormItem` + 字段校验 |
| 14 | DatePicker | 日期选择器 |
| 15 | TimePicker | 时间选择器 |
| 16 | ColorPicker | 颜色选择器 |
| 17 | Upload | 上传（文件选择 + 列表展示） |
| 18 | Transfer | 穿梭框（左右转移） |
| 19 | EditableTable | 可编辑表格（行内编辑） |

## 五、数据展示 / Data Display（信息呈现）

| # | 组件 | 说明 |
|---|------|------|
| 1 | Table | 表格（columns/dataSource/render 自定义单元格） |
| 2 | List | 列表 |
| 3 | Descriptions | 描述列表（label/value 对） |
| 4 | Card | 卡片容器 |
| 5 | Avatar | 头像（文字/图标） |
| 6 | Badge | 徽标（角标计数） |
| 7 | Ribbon | 缎带角标 |
| 8 | Tag | 标签（可关闭） |
| 9 | Statistic | 统计数值，附 `Statistic.Countdown` 倒计时 |
| 10 | Calendar | 日历（月视图） |
| 11 | Timeline | 时间轴 |
| 12 | Carousel | 轮播图 |
| 13 | Image | 图片（预览/占位） |
| 14 | QRCode | 二维码生成 |
| 15 | Tree | 树形控件（`checkable` 级联复选框） |
| 16 | Collapse | 折叠面板（手风琴） |
| 17 | Empty | 空状态 |
| 18 | Skeleton | 骨架屏 |

## 六、反馈 / Feedback（操作反馈）

| # | 组件 | 说明 |
|---|------|------|
| 1 | Alert | 警告提示（可关闭） |
| 2 | Modal | 对话框（Escape 关闭、遮罩点击关闭） |
| 3 | Drawer | 抽屉（left/right 方向） |
| 4 | Message | 全局消息（`message()` 命令式调用 + `MessageContainer`） |
| 5 | Notification | 通知提醒（`notification()` 命令式调用 + `NotificationContainer`） |
| 6 | Toast | 轻提示（open/duration/variant/action） |
| 7 | Popconfirm | 气泡确认框 |
| 8 | Popover | 气泡卡片 |
| 9 | Tooltip | 文字提示（hover 触发） |
| 10 | Tour | 漫游式引导 |
| 11 | Progress | 进度条（percent/status） |
| 12 | Spin | 加载中（spinning/大小） |
| 13 | Result | 结果页（success/error/info/warning） |
| 14 | PageHeader | 页头（标题 + 返回按钮） |

## 七、基础设施（非 UI 组件）

| # | 名称 | 说明 |
|---|------|------|
| 1 | tokens | 设计 Token（`space` / `shadow` / `colors`） |
| 2 | global.css | 全局样式与像素字体声明 |
| 3 | useConfig | 读取 ConfigProvider 配置 |
| 4 | useTheme | 读取 Theme Token |
| 5 | useLocale / t | 读取语言包 / 翻译 |
| 6 | useMessage / useNotification | 消息/通知的容器 Hook |

## 状态标注

- ✅ 已实现：以上全部组件均已实现并有 Playground 演示
- 📝 待增强：主题深度定制（CSS 变量全量接入）、i18n 内置语言包、Storybook 文档
