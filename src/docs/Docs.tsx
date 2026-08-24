import { useState } from "react";
import Button from "../components/Button";
import Input from "../components/Input";
import Card from "../components/Card";
import Switch from "../components/Switch";
import Tag from "../components/Tag";
import Badge from "../components/Badge";
import { Title, Text, Paragraph, Link } from "../components/Typography";
import Layout, { Header, Sider, Content, Footer } from "../components/Layout";
import { Row, Col } from "../components/Grid";
import Space from "../components/Space";
import Menu from "../components/Menu";
import Dropdown from "../components/Dropdown";
import Tabs from "../components/Tabs";
import Pagination from "../components/Pagination";
import Steps from "../components/Steps";
import Alert from "../components/Alert";
import Progress from "../components/Progress";
import Spin from "../components/Spin";
import Slider from "../components/Slider";
import Divider from "../components/Divider";
import FloatButton from "../components/FloatButton";
import Tooltip from "../components/Tooltip";
import Popover from "../components/Popover";
import Popconfirm from "../components/Popconfirm";
import Form, { FormItem } from "../components/Form";
import Table from "../components/Table";
import Select from "../components/Select";
import Radio from "../components/Radio";
import Checkbox from "../components/Checkbox";
import Avatar from "../components/Avatar";
import Collapse from "../components/Collapse";
import Timeline from "../components/Timeline";
import Statistic from "../components/Statistic";
import Breadcrumb from "../components/Breadcrumb";
import Affix from "../components/Affix";
import Splitter from "../components/Splitter";
import Skeleton from "../components/Skeleton";
import Result from "../components/Result";
import Image from "../components/Image";
import Carousel from "../components/Carousel";
import Descriptions from "../components/Descriptions";
import List from "../components/List";
import QRCode from "../components/QRCode";
import Watermark from "../components/Watermark";
import ColorPicker from "../components/ColorPicker";
import Segmented from "../components/Segmented";
import Transfer from "../components/Transfer";
import Tree from "../components/Tree";
import TreeSelect from "../components/TreeSelect";
import Cascader from "../components/Cascader";
import AutoComplete from "../components/AutoComplete";
import Mentions from "../components/Mentions";
import DatePicker from "../components/DatePicker";
import TimePicker from "../components/TimePicker";
import Upload from "../components/Upload";
import InputNumber from "../components/InputNumber";
import Ribbon from "../components/Ribbon";
import Icon from "../components/Icon";
import Rate from "../components/Rate";
import Calendar from "../components/Calendar";
import Flex from "../components/Flex";
import Empty from "../components/Empty";
import ConfigProvider from "../components/ConfigProvider";
import LocaleProvider from "../components/LocaleProvider";
import "./Docs.css";

/* ===== 组件分类与列表 ===== */
interface ComponentInfo {
  name: string;
  desc: string;
}

const CATEGORIES: { title: string; items: ComponentInfo[] }[] = [
  {
    title: "通用",
    items: [
      { name: "Button", desc: "按钮 — variant / size / disabled" },
      { name: "Typography", desc: "排版 — Title / Text / Paragraph" },
      { name: "Icon", desc: "图标 — 像素点阵风格图标库" },
    ],
  },
  {
    title: "布局",
    items: [
      { name: "Layout", desc: "页面布局 — Header / Sider / Content / Footer" },
      { name: "Grid", desc: "栅格 — Row / Col" },
      { name: "Flex", desc: "弹性布局 — vertical / gap / justify / align" },
      { name: "Space", desc: "间距 — direction / size / wrap" },
      { name: "Splitter", desc: "分割面板 — 水平/垂直拖拽" },
    ],
  },
  {
    title: "导航",
    items: [
      { name: "Menu", desc: "菜单 — horizontal / vertical" },
      { name: "Dropdown", desc: "下拉菜单 — click / hover" },
      { name: "Breadcrumb", desc: "面包屑导航" },
      { name: "Tabs", desc: "标签页" },
      { name: "Pagination", desc: "分页" },
      { name: "Steps", desc: "步骤条" },
      { name: "Affix", desc: "固钉" },
    ],
  },
  {
    title: "数据录入",
    items: [
      { name: "Input", desc: "输入框 — TextArea / Password / Search" },
      { name: "InputNumber", desc: "数字输入框" },
      { name: "Select", desc: "选择器" },
      { name: "Radio", desc: "单选框" },
      { name: "Checkbox", desc: "复选框" },
      { name: "Switch", desc: "开关" },
      { name: "Slider", desc: "滑动输入条" },
      { name: "Rate", desc: "评分 — 星形打分" },
      { name: "Form", desc: "表单 — FormItem + 验证" },
      { name: "DatePicker", desc: "日期选择器" },
      { name: "TimePicker", desc: "时间选择器" },
      { name: "Upload", desc: "上传" },
      { name: "ColorPicker", desc: "颜色选择器" },
      { name: "Segmented", desc: "分段控制器" },
      { name: "Transfer", desc: "穿梭框" },
      { name: "Cascader", desc: "级联选择器" },
      { name: "AutoComplete", desc: "自动补全" },
      { name: "Mentions", desc: "提及输入" },
      { name: "TreeSelect", desc: "树形选择器" },
    ],
  },
  {
    title: "数据展示",
    items: [
      { name: "Table", desc: "表格 — columns / dataSource" },
      { name: "List", desc: "列表 — items / Item / ItemMeta" },
      { name: "Empty", desc: "空状态 — description / image" },
      { name: "Descriptions", desc: "描述列表" },
      { name: "Card", desc: "卡片 — outlined / elevated / inset / Meta / actions" },
      { name: "Tag", desc: "标签 — closable / color" },
      { name: "Badge", desc: "徽标 — count / dot" },
      { name: "Avatar", desc: "头像" },
      { name: "Ribbon", desc: "缎带" },
      { name: "Collapse", desc: "折叠面板" },
      { name: "Timeline", desc: "时间线" },
      { name: "Statistic", desc: "统计数值 — value / Countdown" },
      { name: "Image", desc: "图片" },
      { name: "Carousel", desc: "轮播" },
      { name: "Calendar", desc: "日历" },
      { name: "Tree", desc: "树形控件" },
      { name: "QRCode", desc: "二维码" },
    ],
  },
  {
    title: "反馈",
    items: [
      { name: "Alert", desc: "警告提示 — info / success / warning / error" },
      { name: "Modal", desc: "模态对话框" },
      { name: "Toast", desc: "轻提示" },
      { name: "Drawer", desc: "抽屉" },
      { name: "Spin", desc: "加载中" },
      { name: "Progress", desc: "进度条" },
      { name: "Skeleton", desc: "骨架屏" },
      { name: "Result", desc: "结果页" },
      { name: "Tour", desc: "漫游式引导" },
    ],
  },
  {
    title: "其他",
    items: [
      { name: "Divider", desc: "分割线" },
      { name: "FloatButton", desc: "浮动按钮" },
      { name: "Tooltip", desc: "文字提示" },
      { name: "Popover", desc: "气泡卡片" },
      { name: "Popconfirm", desc: "气泡确认框" },
      { name: "Watermark", desc: "水印" },
      { name: "ConfigProvider", desc: "全局配置" },
      { name: "LocaleProvider", desc: "国际化" },
    ],
  },
];

const ALL_COMPONENTS = CATEGORIES.flatMap((c) => c.items);

/* ===== 组件代码示例 ===== */
const CODE_EXAMPLES: Record<string, string> = {
  Button: `import Button from "react-ui-pixel";

<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="danger">Danger</Button>
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
<Button disabled>Disabled</Button>`,

  Input: `import Input from "react-ui-pixel";

<Input placeholder="Default" />
<Input variant="filled" placeholder="Filled" />
<Input size="sm" placeholder="Small" />
<Input size="lg" placeholder="Large" />
<Input disabled value="Disabled" />`,

  Card: `import Card from "react-ui-pixel";

<Card title="Outlined" variant="outlined">
  Content here
</Card>
<Card title="Elevated" variant="elevated">
  With shadow
</Card>
<Card title="Inset" variant="inset">
  Inset style
</Card>

<Card
  title="Meta"
  actions={[<Button size="sm">Like</Button>]}
>
  <Card.Meta
    avatar={<Avatar>PX</Avatar>}
    title="Pixel UI"
    description="Retro styled card with Meta"
  />
</Card>`,

  Switch: `import Switch from "react-ui-pixel";

<Switch />
<Switch defaultChecked />
<Switch disabled />`,

  Tag: `import Tag from "react-ui-pixel";

<Tag>Default</Tag>
<Tag color="red">Red</Tag>
<Tag color="green">Green</Tag>
<Tag color="blue">Blue</Tag>
<Tag closable>Closable</Tag>`,

  Badge: `import Badge from "react-ui-pixel";

<Badge count={5}>
  <Button>Inbox</Button>
</Badge>
<Badge dot>
  <Button>Dot</Button>
</Badge>
<Badge count={100}>
  <Button>Overflow</Button>
</Badge>`,

  Typography: `import { Title, Text, Paragraph, Link } from "react-ui-pixel";

<Title>Heading</Title>
<Text>Text content</Text>
<Paragraph>Paragraph with multiple lines of text for reading.</Paragraph>
<Link href="#">Link</Link>

<Paragraph>像素字体同样支持中文排版：你好，世界！</Paragraph>`,

  Icon: `import Icon from "react-ui-pixel";

<Icon name="star" />
<Icon name="heart" />
<Icon name="search" />
<Icon name="setting" />
<Icon name="refresh" spin />
<Icon name="arrow-right" size="lg" color="#c00" />`,

  Rate: `import Rate from "react-ui-pixel";

<Rate defaultValue={3} />
<Rate defaultValue={2.5} allowHalf />
<Rate defaultValue={4} disabled />`,

  Calendar: `import Calendar from "react-ui-pixel";

<Calendar
  value={new Date()}
  onChange={(date) => { /* handle change */ }}
/>`,

  Layout: `import { Header, Sider, Content, Footer } from "react-ui-pixel";

<Layout>
  <Header>Header</Header>
  <Layout hasSider>
    <Sider>Sider</Sider>
    <Content>Content</Content>
  </Layout>
  <Footer>Footer</Footer>
</Layout>`,

  Grid: `import { Row, Col } from "react-ui-pixel";

<Row gutter={16}>
  <Col span={8}>Col 8</Col>
  <Col span={8}>Col 8</Col>
  <Col span={8}>Col 8</Col>
</Row>`,

  Space: `import Space from "react-ui-pixel";

<Space direction="horizontal" size="md">
  <Button>1</Button>
  <Button>2</Button>
  <Button>3</Button>
</Space>`,

  Flex: `import Flex from "react-ui-pixel";

<Flex vertical gap={8}>
  <Button>Item 1</Button>
  <Button>Item 2</Button>
  <Button>Item 3</Button>
</Flex>

<Flex gap={16} justify="space-between" wrap>
  <span>Left</span>
  <span>Center</span>
  <span>Right</span>
</Flex>`,

  Empty: `import Empty from "react-ui-pixel";

<Empty />
<Empty description="No data found">
  <Button>Refresh</Button>
</Empty>
<Empty
  description="Custom image"
  image={<span>📭</span>}
/>`,

  Menu: `import Menu from "react-ui-pixel";

<Menu
  mode="horizontal"
  defaultSelectedKey="home"
  items={[
    { key: "home", label: "Home" },
    { key: "about", label: "About" },
    { key: "contact", label: "Contact" },
  ]}
/>`,

  Dropdown: `import Dropdown from "react-ui-pixel";

<Dropdown
  trigger="click"
  items={[
    { key: "1", label: "Item 1" },
    { key: "2", label: "Item 2", divider: true },
    { key: "3", label: "Danger", danger: true },
  ]}
>
  <Button>Click me</Button>
</Dropdown>`,

  Tabs: `import Tabs from "react-ui-pixel";

<Tabs
  items={[
    { key: "tab1", label: "Tab 1", children: "Content 1" },
    { key: "tab2", label: "Tab 2", children: "Content 2" },
    { key: "tab3", label: "Disabled", disabled: true, children: "N/A" },
  ]}
/>`,

  Pagination: `import Pagination from "react-ui-pixel";

<Pagination current={1} total={50} pageSize={10} showTotal />`,

  Steps: `import Steps from "react-ui-pixel";

<Steps
  current={1}
  direction="horizontal"
  items={[
    { title: "Step 1", description: "Start" },
    { title: "Step 2", description: "In progress" },
    { title: "Step 3", description: "Done" },
  ]}
/>`,

  Modal: `import Modal from "react-ui-pixel";
import { useState } from "react";

const [open, setOpen] = useState(false);
<Button onClick={() => setOpen(true)}>Open Modal</Button>
<Modal open={open} onClose={() => setOpen(false)} title="Hello">
  <p>Modal content here</p>
</Modal>`,

  Alert: `import Alert from "react-ui-pixel";

<Alert message="Info message" type="info" />
<Alert message="Success" type="success" />
<Alert message="Warning" type="warning" />
<Alert message="Error" type="error" closable />`,

  Toast: `import { toast } from "react-ui-pixel";

toast.success("Saved!");
toast.error("Failed!");
toast.warning("Check input");`,

  Progress: `import Progress from "react-ui-pixel";

<Progress percent={30} />
<Progress percent={60} />
<Progress percent={90} />`,

  Spin: `import Spin from "react-ui-pixel";

<Spin spinning>
  <div>Content loading...</div>
</Spin>
<Spin tip="Loading..." />`,

  Slider: `import Slider from "react-ui-pixel";

<Slider min={0} max={100} value={50} />`,

  Divider: `import Divider from "react-ui-pixel";

<Divider />
<Divider text="Section" orientation="center" />
<Divider text="Left" orientation="left" />`,

  FloatButton: `import FloatButton from "react-ui-pixel";

<FloatButton variant="primary" position="bottom-right" />
<FloatButton.BackTop visibilityHeight={400} />`,

  Tooltip: `import Tooltip from "react-ui-pixel";

<Tooltip title="Tooltip text">
  <Button>Hover me</Button>
</Tooltip>`,

  Popover: `import Popover from "react-ui-pixel";

<Popover title="Title" content="Popover content">
  <Button>Hover me</Button>
</Popover>`,

  Popconfirm: `import Popconfirm from "react-ui-pixel";

<Popconfirm title="Are you sure?" onConfirm={() => {}}>
  <Button>Delete</Button>
</Popconfirm>`,

  Form: `import Form, { FormItem } from "react-ui-pixel";

<Form onFinish={(v) => { /* submit */ }}>
  <FormItem label="Name" name="name">
    <Input />
  </FormItem>
  <FormItem label="Email" name="email">
    <Input />
  </FormItem>
  <Button type="submit">Submit</Button>
</Form>`,

  Table: `import Table from "react-ui-pixel";

<Table
  columns={[
    { key: "name", title: "Name", dataIndex: "name" },
    { key: "age", title: "Age", dataIndex: "age" },
  ]}
  dataSource={[
    { name: "Alice", age: 25 },
    { name: "Bob", age: 30 },
  ]}
/>`,

  Select: `import Select from "react-ui-pixel";

<Select
  options={[
    { label: "Option A", value: "a" },
    { label: "Option B", value: "b" },
  ]}
/>`,

  Radio: `import Radio from "react-ui-pixel";

<Radio.Group defaultValue="a">
  <Radio value="a">A</Radio>
  <Radio value="b">B</Radio>
  <Radio value="c">C</Radio>
</Radio.Group>`,

  Checkbox: `import Checkbox from "react-ui-pixel";

<Checkbox>Option 1</Checkbox>
<Checkbox defaultChecked>Option 2</Checkbox>
<Checkbox disabled>Disabled</Checkbox>`,

  Avatar: `import Avatar from "react-ui-pixel";

<Avatar size="sm" />
<Avatar size="md" />
<Avatar size="lg" />
<Avatar src="https://i.pravatar.cc/80" />`,

  Collapse: `import Collapse from "react-ui-pixel";

<Collapse
  items={[
    { key: "1", label: "Panel 1", children: "Content 1" },
    { key: "2", label: "Panel 2", children: "Content 2" },
  ]}
/>`,

  Timeline: `import Timeline from "react-ui-pixel";

<Timeline
  items={[
    { key: "1", children: "Event 1", color: "blue" },
    { key: "2", children: "Event 2", color: "green" },
    { key: "3", children: "Event 3" },
  ]}
/>`,

  Statistic: `import Statistic from "react-ui-pixel";

<Statistic title="Users" value={12345} />
<Statistic title="Revenue" value={9999} prefix="$" suffix=".00" />

<Statistic.Countdown
  title="Deploy Time"
  value={Date.now() + 600000}
  format="mm:ss"
  onFinish={() => { /* countdown end */ }}
/>`,

  Breadcrumb: `import Breadcrumb from "react-ui-pixel";

<Breadcrumb
  items={[
    { title: "Home", href: "/" },
    { title: "Category" },
    { title: "Current" },
  ]}
/>`,

  Affix: `import Affix from "react-ui-pixel";

<Affix offsetTop={20}>
  <Button>Sticky Button</Button>
</Affix>`,

  Splitter: `import Splitter from "react-ui-pixel";

<Splitter direction="horizontal" style={{ height: 200 }}>
  <div>Left panel</div>
  <div>Right panel</div>
</Splitter>`,

  Skeleton: `import Skeleton from "react-ui-pixel";

<Skeleton rows={3} />
<Skeleton rows={5} />

<Skeleton avatar title paragraph={{ rows: 2 }} />

<Skeleton.Avatar shape="circle" size="lg" />
<Skeleton.Button shape="round" />
<Skeleton.Input size="sm" />
<Skeleton.Image />`,

  Result: `import Result from "react-ui-pixel";

<Result
  status="success"
  title="Success!"
  subTitle="Operation completed"
  extra={<Button>Back</Button>}
/>`,

  Drawer: `import Drawer from "react-ui-pixel";
import { useState } from "react";

const [open, setOpen] = useState(false);
<Button onClick={() => setOpen(true)}>Open</Button>
<Drawer open={open} onClose={() => setOpen(false)} title="Drawer">
  <p>Drawer content</p>
</Drawer>`,

  Image: `import Image from "react-ui-pixel";

<Image src="https://picsum.photos/200" alt="Random" width={200} />`,

  Carousel: `import Carousel from "react-ui-pixel";

<Carousel
  items={[
    <div key="1">Slide 1</div>,
    <div key="2">Slide 2</div>,
    <div key="3">Slide 3</div>,
  ]}
/>`,

  Descriptions: `import Descriptions from "react-ui-pixel";

<Descriptions
  title="User Info"
  items={[
    { label: "Name", children: "Alice" },
    { label: "Age", children: 25 },
    { label: "Email", children: "alice@example.com" },
  ]}
/>`,

  List: `import List from "react-ui-pixel";

<List
  items={[
    { key: "1", title: "Item 1", description: "Description 1" },
    { key: "2", title: "Item 2", description: "Description 2" },
  ]}
/>

<List bordered>
  <List.Item
    avatar={<Avatar size="sm">PX</Avatar>}
    extra={<Tag>v1</Tag>}
    actions={[<Button size="sm">Edit</Button>]}
  >
    <List.ItemMeta
      title="Composed Item"
      description="Using the composition API"
    />
  </List.Item>
</List>`,

  QRCode: `import QRCode from "react-ui-pixel";

<QRCode value="https://example.com" size={128} />`,

  Watermark: `import Watermark from "react-ui-pixel";

<Watermark text="Pixel UI">
  <div style={{ height: 200 }}>Watermarked content</div>
</Watermark>`,

  ColorPicker: `import ColorPicker from "react-ui-pixel";

<ColorPicker value="#000" onChange={(v) => { /* handle change */ }} />`,

  Segmented: `import Segmented from "react-ui-pixel";

<Segmented
  options={[
    { label: "Daily", value: "daily" },
    { label: "Weekly", value: "weekly" },
    { label: "Monthly", value: "monthly" },
  ]}
/>

<Segmented block size="sm" defaultValue="daily"
  options={[{ label: "Daily", value: "daily" }, { label: "Weekly", value: "weekly" }]}
/>`,

  Transfer: `import Transfer from "react-ui-pixel";

<Transfer
  dataSource={[
    { key: "1", title: "Item 1" },
    { key: "2", title: "Item 2" },
  ]}
/>`,

  Tree: `import Tree from "react-ui-pixel";

<Tree
  treeData={[
    { key: "1", title: "Parent", children: [
      { key: "1-1", title: "Child 1" },
      { key: "1-2", title: "Child 2" },
    ]},
  ]}
  defaultExpandAll
/>

<Tree
  checkable
  defaultExpandAll
  treeData={[
    { key: "a", title: "Root", children: [
      { key: "a-1", title: "Leaf A" },
      { key: "a-2", title: "Leaf B" },
    ]},
  ]}
  onCheck={(keys) => { /* handle check */ }}
/>`,

  TreeSelect: `import TreeSelect from "react-ui-pixel";

<TreeSelect
  treeData={[
    { key: "1", title: "Option 1", children: [
      { key: "1-1", title: "Sub 1" },
    ]},
  ]}
  placeholder="Select..."
/>`,

  Cascader: `import Cascader from "react-ui-pixel";

<Cascader
  options={[
    { value: "zhejiang", label: "Zhejiang", children: [
      { value: "hangzhou", label: "Hangzhou" },
    ]},
  ]}
/>`,

  AutoComplete: `import AutoComplete from "react-ui-pixel";

<AutoComplete
  options={["Apple", "Banana", "Cherry"]}
  placeholder="Type fruit..."
/>`,

  Mentions: `import Mentions from "react-ui-pixel";

<Mentions
  options={[
    { label: "Alice", value: "@alice" },
    { label: "Bob", value: "@bob" },
  ]}
  placeholder="Type @ to mention..."
/>`,

  DatePicker: `import DatePicker from "react-ui-pixel";

<DatePicker onChange={(v) => { /* handle change */ }} />`,

  TimePicker: `import TimePicker from "react-ui-pixel";

<TimePicker onChange={(v) => { /* handle change */ }} />`,

  Upload: `import Upload from "react-ui-pixel";

<Upload multiple>
  <Button>Upload Files</Button>
</Upload>`,

  InputNumber: `import InputNumber from "react-ui-pixel";

<InputNumber min={0} max={100} defaultValue={50} />`,

  Ribbon: `import Ribbon from "react-ui-pixel";

<Ribbon text="HOT" color="red">
  <Card title="Product">Content</Card>
</Ribbon>`,

  Tour: `import Tour from "react-ui-pixel";

<Tour
  open={false}
  onClose={() => {}}
  steps={[
    { title: "Step 1", description: "First step" },
    { title: "Step 2", description: "Second step" },
  ]}
/>`,

  ConfigProvider: `import ConfigProvider from "react-ui-pixel";

<ConfigProvider
  theme={{ primaryColor: "#000", fontFamily: "var(--pixel-font)" }}
  locale="en"
>
  {/* Your app */}
</ConfigProvider>`,

  LocaleProvider: `import LocaleProvider from "react-ui-pixel";

<LocaleProvider locale={{ locale: "en", messages: {} }}>
  {/* Your app */}
</LocaleProvider>`,
};

/* ===== Props 数据 ===== */
const PROPS_DATA: Record<string, { prop: string; type: string; default: string; desc: string }[]> = {
  Button: [
    { prop: "variant", type: "'primary' | 'secondary' | 'danger'", default: "'primary'", desc: "按钮变体" },
    { prop: "size", type: "'sm' | 'md' | 'lg'", default: "'md'", desc: "按钮尺寸" },
    { prop: "disabled", type: "boolean", default: "false", desc: "是否禁用" },
    { prop: "type", type: "'button' | 'submit'", default: "'button'", desc: "按钮类型" },
    { prop: "onClick", type: "() => void", default: "-", desc: "点击回调" },
  ],
  Input: [
    { prop: "variant", type: "'outlined' | 'filled'", default: "'outlined'", desc: "输入框变体" },
    { prop: "size", type: "'sm' | 'md' | 'lg'", default: "'md'", desc: "输入框尺寸" },
    { prop: "placeholder", type: "string", default: "-", desc: "占位文本" },
    { prop: "disabled", type: "boolean", default: "false", desc: "是否禁用" },
    { prop: "value", type: "string", default: "-", desc: "输入值" },
    { prop: "onChange", type: "(v: string) => void", default: "-", desc: "值变化回调" },
  ],
  Card: [
    { prop: "variant", type: "'outlined' | 'elevated' | 'inset'", default: "'outlined'", desc: "卡片样式变体" },
    { prop: "size", type: "'sm' | 'md' | 'lg'", default: "'md'", desc: "卡片尺寸" },
    { prop: "title", type: "ReactNode", default: "-", desc: "卡片标题" },
    { prop: "style", type: "CSSProperties", default: "-", desc: "自定义样式" },
  ],
  Switch: [
    { prop: "checked", type: "boolean", default: "false", desc: "是否选中" },
    { prop: "onChange", type: "(v: boolean) => void", default: "-", desc: "变化回调" },
    { prop: "disabled", type: "boolean", default: "false", desc: "是否禁用" },
  ],
  Tag: [
    { prop: "color", type: "'default' | 'red' | 'green' | 'blue' | 'yellow'", default: "'default'", desc: "标签颜色" },
    { prop: "closable", type: "boolean", default: "false", desc: "是否可关闭" },
    { prop: "onClose", type: "() => void", default: "-", desc: "关闭回调" },
  ],
  Badge: [
    { prop: "count", type: "number", default: "-", desc: "徽标数" },
    { prop: "dot", type: "boolean", default: "false", desc: "是否显示为小圆点" },
    { prop: "overflowCount", type: "number", default: "99", desc: "溢出计数" },
  ],
  Icon: [
    { prop: "name", type: "IconName", default: "-", desc: "图标名称（40+ 内置）" },
    { prop: "size", type: "'sm' | 'md' | 'lg'", default: "'md'", desc: "图标尺寸" },
    { prop: "color", type: "string", default: "currentColor", desc: "图标颜色" },
    { prop: "spin", type: "boolean", default: "false", desc: "是否旋转" },
  ],
  Rate: [
    { prop: "value", type: "number", default: "-", desc: "当前评分（受控）" },
    { prop: "defaultValue", type: "number", default: "0", desc: "默认评分（非受控）" },
    { prop: "count", type: "number", default: "5", desc: "星星总数" },
    { prop: "allowHalf", type: "boolean", default: "false", desc: "是否允许半星" },
    { prop: "allowClear", type: "boolean", default: "true", desc: "点击已选星是否清零" },
    { prop: "disabled", type: "boolean", default: "false", desc: "是否禁用" },
    { prop: "onChange", type: "(v: number) => void", default: "-", desc: "评分变化回调" },
  ],
  Calendar: [
    { prop: "value", type: "Date", default: "-", desc: "选中日期（受控）" },
    { prop: "defaultValue", type: "Date", default: "今天", desc: "默认选中日期" },
    { prop: "onChange", type: "(date: Date) => void", default: "-", desc: "日期变化回调" },
    { prop: "fullscreen", type: "boolean", default: "false", desc: "是否全屏展示" },
  ],
  Flex: [
    { prop: "vertical", type: "boolean", default: "false", desc: "是否纵向布局" },
    { prop: "wrap", type: "'wrap' | 'nowrap' | 'wrap-reverse' | boolean", default: "false", desc: "是否换行" },
    { prop: "justify", type: "'start' | 'center' | 'end' | 'space-between' ...", default: "-", desc: "主轴对齐" },
    { prop: "align", type: "'start' | 'center' | 'end' | 'stretch' | 'baseline'", default: "-", desc: "交叉轴对齐" },
    { prop: "gap", type: "number | string | [gap, gap]", default: "-", desc: "间距（支持行列分别设置）" },
    { prop: "flex", type: "string", default: "-", desc: "作为子项时的 flex 值" },
  ],
  Empty: [
    { prop: "description", type: "ReactNode", default: "'No data'", desc: "空状态描述" },
    { prop: "image", type: "ReactNode", default: "-", desc: "自定义图片" },
    { prop: "children", type: "ReactNode", default: "-", desc: "底部操作区" },
  ],
  Skeleton: [
    { prop: "active", type: "boolean", default: "true", desc: "是否显示脉冲动画" },
    { prop: "loading", type: "boolean", default: "false", desc: "为 false 时渲染 children" },
    { prop: "title", type: "boolean", default: "true", desc: "是否显示标题占位" },
    { prop: "avatar", type: "boolean", default: "false", desc: "是否显示头像占位" },
    { prop: "paragraph", type: "boolean | { rows?, width? }", default: "true", desc: "段落占位配置" },
    { prop: "rows", type: "number", default: "3", desc: "段落行数（快捷方式）" },
    { prop: "width", type: "string | number", default: "100%", desc: "段落宽度" },
    { prop: "Skeleton.Avatar", type: "size/size2/shape/active", default: "-", desc: "头像骨架（circle/square/round）" },
    { prop: "Skeleton.Button", type: "size/shape/block/active", default: "-", desc: "按钮骨架" },
    { prop: "Skeleton.Input", type: "size/active", default: "-", desc: "输入框骨架" },
    { prop: "Skeleton.Image", type: "active", default: "-", desc: "图片骨架" },
  ],
  Tree: [
    { prop: "treeData", type: "TreeNode[]", default: "-", desc: "树数据（title/key/children/disabled）" },
    { prop: "defaultExpandAll", type: "boolean", default: "false", desc: "默认展开全部节点" },
    { prop: "checkable", type: "boolean", default: "false", desc: "节点前显示复选框" },
    { prop: "defaultCheckedKeys", type: "string[]", default: "[]", desc: "默认勾选的节点" },
    { prop: "defaultSelectedKeys", type: "string[]", default: "[]", desc: "默认选中节点" },
    { prop: "onSelect", type: "(key, selected) => void", default: "-", desc: "节点选择回调" },
    { prop: "onCheck", type: "(checkedKeys) => void", default: "-", desc: "勾选变化回调（含父子级联）" },
  ],
  Segmented: [
    { prop: "options", type: "SegmentedOption[]", default: "-", desc: "选项（label/value/disabled/icon）" },
    { prop: "value", type: "string", default: "-", desc: "当前值（受控）" },
    { prop: "defaultValue", type: "string", default: "首项", desc: "默认值（非受控）" },
    { prop: "onChange", type: "(value) => void", default: "-", desc: "切换回调" },
    { prop: "block", type: "boolean", default: "false", desc: "撑满整行" },
    { prop: "size", type: "'sm' | 'md' | 'lg'", default: "'md'", desc: "尺寸" },
    { prop: "disabled", type: "boolean", default: "false", desc: "整体禁用" },
  ],
};

/* ===== 组件预览渲染 ===== */
function ComponentPreview({ name }: { name: string }) {
  switch (name) {
    case "Button":
      return (
        <>
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="danger">Danger</Button>
          <Button size="sm">Small</Button>
          <Button size="lg">Large</Button>
          <Button disabled>Disabled</Button>
        </>
      );
    case "Input":
      return (
        <>
          <Input placeholder="Default" style={{ width: 180 }} />
          <Input variant="filled" placeholder="Filled" style={{ width: 180 }} />
          <Input size="sm" placeholder="Small" style={{ width: 140 }} />
          <Input size="lg" placeholder="Large" style={{ width: 200 }} />
        </>
      );
    case "Card":
      return (
        <>
          <Card title="Outlined" variant="outlined" style={{ width: 180 }}>
            Content
          </Card>
          <Card title="Elevated" variant="elevated" style={{ width: 180 }}>
            With shadow
          </Card>
          <Card title="Inset" variant="inset" style={{ width: 180 }}>
            Inset style
          </Card>
        </>
      );
    case "Switch":
      return (
        <>
          <Switch />
          <Switch defaultChecked />
          <Switch disabled />
        </>
      );
    case "Tag":
      return (
        <>
          <Tag>Default</Tag>
          <Tag color="red">Red</Tag>
          <Tag color="green">Green</Tag>
          <Tag color="blue">Blue</Tag>
          <Tag color="yellow">Yellow</Tag>
          <Tag closable>Closable</Tag>
        </>
      );
    case "Badge":
      return (
        <>
          <Badge count={5}>
            <Button>Inbox</Button>
          </Badge>
          <Badge dot>
            <Button>Dot</Button>
          </Badge>
          <Badge count={100}>
            <Button>Overflow</Button>
          </Badge>
        </>
      );
    case "Typography":
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 8, width: "100%" }}>
          <Title level={1}>Heading 1</Title>
          <Title level={2}>Heading 2</Title>
          <Text>Default text</Text>
          <Text type="secondary">Secondary text</Text>
          <Text strong>Strong text</Text>
          <Text code>Code text</Text>
          <Text underline>Underlined</Text>
          <Paragraph>Paragraph with multiple lines of text content for demonstration purposes.</Paragraph>
          <Link href="#">Link</Link>
        </div>
      );
    case "Icon":
      return (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center" }}>
          <Icon name="star" />
          <Icon name="heart" />
          <Icon name="home" />
          <Icon name="setting" />
          <Icon name="user" />
          <Icon name="bell" />
          <Icon name="mail" />
          <Icon name="search" />
          <Icon name="close" />
          <Icon name="check" />
          <Icon name="plus" />
          <Icon name="minus" />
          <Icon name="arrow-up" />
          <Icon name="arrow-down" />
          <Icon name="arrow-left" />
          <Icon name="arrow-right" />
          <Icon name="chevron-up" />
          <Icon name="chevron-down" />
          <Icon name="edit" />
          <Icon name="trash" />
          <Icon name="download" />
          <Icon name="upload" />
          <Icon name="refresh" spin />
          <Icon name="info" />
          <Icon name="warning" />
          <Icon name="error" />
          <Icon name="success" />
          <Icon name="menu" />
          <Icon name="more" />
          <Icon name="eye" />
          <Icon name="eye-off" />
          <Icon name="copy" />
          <Icon name="external" />
          <Icon name="star" size="sm" />
          <Icon name="star" size="lg" />
          <Icon name="heart" color="#c00" size="lg" />
          <Icon name="info" color="#00c" size="lg" />
        </div>
      );
    case "Layout":
      return (
        <Layout style={{ width: "100%", height: 200, border: "2px solid #000" }}>
          <Header style={{ background: "#e0e0e0", padding: "8px 16px", fontSize: 12 }}>Header</Header>
          <Layout hasSider style={{ flex: 1 }}>
            <Sider style={{ background: "#f0f0f0", padding: 8, fontSize: 12 }} width={80}>Sider</Sider>
            <Content style={{ padding: 8, fontSize: 12 }}>Content</Content>
          </Layout>
          <Footer style={{ background: "#e0e0e0", padding: "8px 16px", fontSize: 12 }}>Footer</Footer>
        </Layout>
      );
    case "Grid":
      return (
        <div style={{ width: "100%" }}>
          <Row gutter={8}>
            <Col span={8}><div style={{ background: "#e0e0e0", padding: 8, textAlign: "center", fontSize: 12, border: "1px solid #000" }}>Col 8</div></Col>
            <Col span={8}><div style={{ background: "#e0e0e0", padding: 8, textAlign: "center", fontSize: 12, border: "1px solid #000" }}>Col 8</div></Col>
            <Col span={8}><div style={{ background: "#e0e0e0", padding: 8, textAlign: "center", fontSize: 12, border: "1px solid #000" }}>Col 8</div></Col>
          </Row>
        </div>
      );
    case "Space":
      return (
        <Space direction="horizontal" size="md">
          <Button size="sm">1</Button>
          <Button size="sm">2</Button>
          <Button size="sm">3</Button>
        </Space>
      );
    case "Flex":
      return (
        <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 12 }}>
          <Flex gap={8}>
            <Button size="sm">Item A</Button>
            <Button size="sm">Item B</Button>
            <Button size="sm">Item C</Button>
          </Flex>
          <Flex vertical gap={8}>
            <Button size="sm">Vertical 1</Button>
            <Button size="sm">Vertical 2</Button>
          </Flex>
          <Flex justify="space-between" gap={8}>
            <Tag>Left</Tag>
            <Tag>Center</Tag>
            <Tag>Right</Tag>
          </Flex>
        </div>
      );
    case "Menu":
      return (
        <div style={{ width: "100%" }}>
          <Menu
            mode="horizontal"
            defaultSelectedKey="home"
            items={[
              { key: "home", label: "Home" },
              { key: "about", label: "About" },
              { key: "contact", label: "Contact" },
            ]}
          />
        </div>
      );
    case "Dropdown":
      return (
        <Dropdown
          trigger="click"
          items={[
            { key: "1", label: "Item 1" },
            { key: "2", label: "Item 2", divider: true },
            { key: "3", label: "Danger", danger: true },
          ]}
        >
          <Button size="sm">Click me</Button>
        </Dropdown>
      );
    case "Tabs":
      return (
        <div style={{ width: "100%" }}>
          <Tabs
            items={[
              { key: "tab1", label: "Tab 1", children: <div style={{ padding: 8, fontSize: 12 }}>Content 1</div> },
              { key: "tab2", label: "Tab 2", children: <div style={{ padding: 8, fontSize: 12 }}>Content 2</div> },
              { key: "tab3", label: "Disabled", disabled: true, children: <div>N/A</div> },
            ]}
          />
        </div>
      );
    case "Pagination":
      return <Pagination current={1} total={50} pageSize={10} showTotal />;
    case "Steps":
      return (
        <div style={{ width: "100%" }}>
          <Steps
            current={1}
            direction="horizontal"
            items={[
              { title: "Step 1", description: "Start" },
              { title: "Step 2", description: "In progress" },
              { title: "Step 3", description: "Done" },
            ]}
          />
        </div>
      );
    case "Modal":
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-start" }}>
          <span style={{ fontSize: 12, color: "#999" }}>点击按钮打开弹窗（在 Playground 中体验）</span>
          <Button size="sm" disabled>Open Modal</Button>
        </div>
      );
    case "Alert":
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 8, width: "100%" }}>
          <Alert message="Info message" type="info" />
          <Alert message="Success" type="success" />
          <Alert message="Warning" type="warning" />
          <Alert message="Error" type="error" closable />
        </div>
      );
    case "Toast":
      return (
        <div style={{ display: "flex", gap: 8 }}>
          <span style={{ fontSize: 12, color: "#999" }}>Toast 通过 API 调用（在 Playground 中体验）</span>
        </div>
      );
    case "Progress":
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%" }}>
          <Progress percent={30} />
          <Progress percent={60} />
          <Progress percent={90} />
        </div>
      );
    case "Spin":
      return (
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <Spin spinning size="sm" />
          <Spin spinning size="md" />
          <Spin spinning tip="Loading..." />
        </div>
      );
    case "Slider":
      return <Slider min={0} max={100} value={50} style={{ width: 200 }} />;
    case "Rate":
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "flex-start" }}>
          <Rate defaultValue={3} />
          <Rate defaultValue={2.5} allowHalf />
          <Rate defaultValue={4} disabled />
        </div>
      );
    case "Divider":
      return (
        <div style={{ width: "100%" }}>
          <Divider />
          <Divider text="Section" orientation="center" />
          <Divider text="Left" orientation="left" />
        </div>
      );
    case "FloatButton":
      return (
        <div style={{ position: "relative", height: 80, width: 120, border: "1px dashed #ccc", overflow: "hidden" }}>
          <FloatButton variant="primary" size="sm" style={{ position: "absolute", bottom: 8, right: 8 }}>+</FloatButton>
        </div>
      );
    case "Tooltip":
      return (
        <Tooltip title="Tooltip text">
          <Button size="sm">Hover me</Button>
        </Tooltip>
      );
    case "Popover":
      return (
        <Popover title="Title" content="Popover content" trigger="hover">
          <Button size="sm">Hover me</Button>
        </Popover>
      );
    case "Popconfirm":
      return (
        <Popconfirm title="Are you sure?" onConfirm={() => {}}>
          <Button size="sm">Delete</Button>
        </Popconfirm>
      );
    case "Form":
      return (
        <div style={{ width: "100%", maxWidth: 300 }}>
          <Form onFinish={() => { /* submit */ }}>
            <FormItem label="Name" name="name">
              <Input placeholder="Enter name" style={{ width: "100%" }} />
            </FormItem>
            <FormItem label="Email" name="email">
              <Input placeholder="Enter email" style={{ width: "100%" }} />
            </FormItem>
            <Button type="submit" size="sm">Submit</Button>
          </Form>
        </div>
      );
    case "Table":
      return (
        <div style={{ width: "100%" }}>
          <Table
            columns={[
              { key: "name", title: "Name", dataIndex: "name" },
              { key: "age", title: "Age", dataIndex: "age" },
              { key: "city", title: "City", dataIndex: "city" },
            ]}
            dataSource={[
              { key: "1", name: "Alice", age: 25, city: "NYC" },
              { key: "2", name: "Bob", age: 30, city: "LA" },
              { key: "3", name: "Charlie", age: 28, city: "SF" },
            ]}
          />
        </div>
      );
    case "Select":
      return (
        <Select
          options={[
            { label: "Option A", value: "a" },
            { label: "Option B", value: "b" },
            { label: "Option C", value: "c" },
          ]}
          style={{ width: 180 }}
        />
      );
    case "Radio":
      return (
        <Radio
          options={[
            { label: "A", value: "a" },
            { label: "B", value: "b" },
            { label: "C", value: "c" },
          ]}
          value="a"
        />
      );
    case "Checkbox":
      return (
        <>
          <Checkbox>Option 1</Checkbox>
          <Checkbox checked>Option 2</Checkbox>
          <Checkbox disabled>Disabled</Checkbox>
        </>
      );
    case "Avatar":
      return (
        <>
          <Avatar size="sm" />
          <Avatar size="md" />
          <Avatar size="lg" />
          <Avatar src="https://i.pravatar.cc/80" />
        </>
      );
    case "Collapse":
      return (
        <div style={{ width: "100%" }}>
          <Collapse
            items={[
              { key: "1", label: "Panel 1", children: <div style={{ fontSize: 12 }}>Content 1</div> },
              { key: "2", label: "Panel 2", children: <div style={{ fontSize: 12 }}>Content 2</div> },
            ]}
          />
        </div>
      );
    case "Timeline":
      return (
        <Timeline
          items={[
            { key: "1", children: "Event 1", color: "blue" },
            { key: "2", children: "Event 2", color: "green" },
            { key: "3", children: "Event 3" },
          ]}
        />
      );
    case "Statistic":
      return (
        <div style={{ display: "flex", gap: 24 }}>
          <Statistic title="Users" value={12345} />
          <Statistic title="Revenue" value={9999} prefix="$" suffix=".00" />
        </div>
      );
    case "Breadcrumb":
      return (
        <Breadcrumb
          items={[
            { title: "Home", href: "/" },
            { title: "Category" },
            { title: "Current" },
          ]}
        />
      );
    case "Affix":
      return (
        <div style={{ position: "relative", height: 60, border: "1px dashed #ccc", padding: 8 }}>
          <span style={{ fontSize: 12, color: "#999" }}>Affix 在滚动容器中固定</span>
          <Affix offsetTop={0}>
            <Button size="sm">Sticky</Button>
          </Affix>
        </div>
      );
    case "Splitter":
      return (
        <div style={{ width: "100%" }}>
          <Splitter direction="horizontal" style={{ height: 100 }}>
            <div style={{ padding: 8, fontSize: 12 }}>Left panel</div>
            <div style={{ padding: 8, fontSize: 12 }}>Right panel</div>
          </Splitter>
        </div>
      );
    case "Skeleton":
      return (
        <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 12 }}>
          <Skeleton avatar title paragraph={{ rows: 2 }} />
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Skeleton.Avatar shape="circle" />
            <Skeleton.Avatar shape="square" size="lg" />
            <Skeleton.Button size="sm" />
            <Skeleton.Button shape="circle" />
            <Skeleton.Input size="sm" />
            <Skeleton.Image />
          </div>
        </div>
      );
    case "Result":
      return (
        <Result
          status="success"
          title="Success!"
          subTitle="Operation completed"
          extra={<Button size="sm">Back</Button>}
        />
      );
    case "Drawer":
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-start" }}>
          <span style={{ fontSize: 12, color: "#999" }}>Drawer 通过状态控制（在 Playground 中体验）</span>
          <Button size="sm" disabled>Open</Button>
        </div>
      );
    case "Image":
      return <Image src="https://picsum.photos/200" alt="Random" width={120} />;
    case "Calendar":
      return (
        <div style={{ width: "100%" }}>
          <Calendar fullscreen={false} />
        </div>
      );
    case "Carousel":
      return (
        <div style={{ width: "100%", maxWidth: 300 }}>
          <Carousel
            items={[
              <div key="1" style={{ background: "#e0e0e0", padding: 20, textAlign: "center", fontSize: 12 }}>Slide 1</div>,
              <div key="2" style={{ background: "#d0d0d0", padding: 20, textAlign: "center", fontSize: 12 }}>Slide 2</div>,
              <div key="3" style={{ background: "#c0c0c0", padding: 20, textAlign: "center", fontSize: 12 }}>Slide 3</div>,
            ]}
          />
        </div>
      );
    case "Descriptions":
      return (
        <div style={{ width: "100%" }}>
          <Descriptions
            title="User Info"
            items={[
              { label: "Name", children: "Alice" },
              { label: "Age", children: 25 },
              { label: "Email", children: "alice@example.com" },
            ]}
          />
        </div>
      );
    case "List":
      return (
        <div style={{ width: "100%" }}>
          <List
            items={[
              { key: "1", title: "Item 1", description: "Description 1" },
              { key: "2", title: "Item 2", description: "Description 2" },
            ]}
          />
        </div>
      );
    case "Empty":
      return (
        <div style={{ width: "100%", display: "flex", gap: 16, justifyContent: "center" }}>
          <div style={{ border: "2px solid #000", width: 200 }}>
            <Empty />
          </div>
          <div style={{ border: "2px solid #000", width: 200 }}>
            <Empty description="No data" image={<span style={{ fontSize: 32, lineHeight: 1 }}>📭</span>}>
              <Button size="sm">Refresh</Button>
            </Empty>
          </div>
        </div>
      );
    case "QRCode":
      return <QRCode value="https://example.com" size={96} />;
    case "Watermark":
      return (
        <Watermark text="Pixel UI">
          <div style={{ height: 60, border: "1px solid #000", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}>
            Watermarked area
          </div>
        </Watermark>
      );
    case "ColorPicker":
      return <ColorPicker value="#000" onChange={() => { /* handle change */ }} />;
    case "Segmented":
      return (
        <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 8 }}>
          <Segmented
            options={[
              { label: "Daily", value: "daily" },
              { label: "Weekly", value: "weekly" },
              { label: "Monthly", value: "monthly" },
            ]}
          />
          <Segmented
            block
            size="sm"
            options={[
              { label: "All", value: "all" },
              { label: "Draft", value: "draft" },
              { label: "Published", value: "published" },
            ]}
          />
        </div>
      );
    case "Transfer":
      return (
        <div style={{ width: "100%" }}>
          <Transfer
            dataSource={[
              { key: "1", title: "Item 1" },
              { key: "2", title: "Item 2" },
              { key: "3", title: "Item 3" },
            ]}
          />
        </div>
      );
    case "Tree":
      return (
        <div style={{ width: "100%", display: "flex", gap: 16 }}>
          <div style={{ flex: 1 }}>
            <Tree
              treeData={[
                {
                  key: "1", title: "Parent", children: [
                    { key: "1-1", title: "Child 1" },
                    { key: "1-2", title: "Child 2" },
                  ],
                },
              ]}
              defaultExpandAll
            />
          </div>
          <div style={{ flex: 1 }}>
            <Tree
              checkable
              defaultExpandAll
              treeData={[
                {
                  key: "a", title: "Root", children: [
                    { key: "a-1", title: "Leaf A" },
                    { key: "a-2", title: "Leaf B" },
                  ],
                },
              ]}
            />
          </div>
        </div>
      );
    case "TreeSelect":
      return (
        <TreeSelect
          treeData={[
            { value: "1", title: "Option 1", children: [{ value: "1-1", title: "Sub 1" }] },
          ]}
          placeholder="Select..."
          style={{ width: 200 }}
        />
      );
    case "Cascader":
      return (
        <Cascader
          options={[
            {
              value: "zhejiang", label: "Zhejiang", children: [
                { value: "hangzhou", label: "Hangzhou" },
              ],
            },
          ]}
          style={{ width: 200 }}
        />
      );
    case "AutoComplete":
      return (
        <AutoComplete
          options={["Apple", "Banana", "Cherry"]}
          placeholder="Type fruit..."
          style={{ width: 200 }}
        />
      );
    case "Mentions":
      return (
        <Mentions
          options={[
            { label: "Alice", value: "@alice" },
            { label: "Bob", value: "@bob" },
          ]}
          placeholder="Type @ to mention..."
          style={{ width: 250 }}
        />
      );
    case "DatePicker":
      return <DatePicker onChange={() => { /* handle change */ }} />;
    case "TimePicker":
      return <TimePicker onChange={() => { /* handle change */ }} />;
    case "Upload":
      return (
        <Upload multiple>
          <Button size="sm">Upload Files</Button>
        </Upload>
      );
    case "InputNumber":
      return <InputNumber min={0} max={100} defaultValue={50} />;
    case "Ribbon":
      return (
        <Ribbon text="HOT" color="red">
          <Card title="Product" style={{ width: 160 }}>
            Content
          </Card>
        </Ribbon>
      );
    case "Tour":
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-start" }}>
          <span style={{ fontSize: 12, color: "#999" }}>Tour 通过状态控制（在 Playground 中体验）</span>
          <Button size="sm" disabled>Start Tour</Button>
        </div>
      );
    case "ConfigProvider":
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <span style={{ fontSize: 12, color: "#999" }}>ConfigProvider 包裹应用提供全局配置</span>
          <ConfigProvider theme={{ primaryColor: "#000", fontFamily: "var(--pixel-font)" }} locale="en">
            <Button size="sm">Wrapped Button</Button>
          </ConfigProvider>
        </div>
      );
    case "LocaleProvider":
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <span style={{ fontSize: 12, color: "#999" }}>LocaleProvider 提供国际化上下文</span>
          <LocaleProvider locale={{ locale: "en", messages: {} }}>
            <Button size="sm">Wrapped Button</Button>
          </LocaleProvider>
        </div>
      );
    default:
      return <span style={{ fontSize: 12, color: "#999" }}>预览待实现</span>;
  }
}

/* ===== 主组件 ===== */
export default function Docs() {
  const [selected, setSelected] = useState("Button");
  const current = ALL_COMPONENTS.find((c) => c.name === selected);
  const code = CODE_EXAMPLES[selected];
  const props = PROPS_DATA[selected];

  return (
    <div className="docs">
      {/* 左侧菜单 */}
      <div className="docs-sidebar">
        <div className="docs-sidebar-header">
          <h2 className="docs-sidebar-logo">Pixel UI</h2>
          <p className="docs-sidebar-sub">Component Docs</p>
        </div>
        {CATEGORIES.map((cat) => (
          <div key={cat.title}>
            <div className="docs-sidebar-category">{cat.title}</div>
            {cat.items.map((item) => (
              <button
                key={item.name}
                className={`docs-sidebar-item ${selected === item.name ? "docs-sidebar-item--active" : ""}`}
                onClick={() => setSelected(item.name)}
              >
                {item.name}
              </button>
            ))}
          </div>
        ))}
      </div>

      {/* 右侧内容 */}
      <div className="docs-content">
        <div className="docs-content-header">
          <h1 className="docs-content-title">{selected}</h1>
          <p className="docs-content-desc">{current?.desc}</p>
        </div>

        {/* 组件预览 */}
        <div className="docs-example">
          <div className="docs-example-label">▸ 预览 / Preview</div>
          <div className="docs-example-preview">
            <ComponentPreview name={selected} />
          </div>
        </div>

        {/* 代码示例 */}
        {code && (
          <div className="docs-example">
            <div className="docs-example-label">▸ 代码 / Code</div>
            <pre className="docs-example-code">{code}</pre>
          </div>
        )}

        {/* Props 表格 */}
        {props && props.length > 0 && (
          <div className="docs-example">
            <div className="docs-example-label">▸ 属性 / Props</div>
            <table className="docs-props-table">
              <thead>
                <tr>
                  <th>Prop</th>
                  <th>Type</th>
                  <th>Default</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {props.map((p) => (
                  <tr key={p.prop}>
                    <td><strong>{p.prop}</strong></td>
                    <td><code>{p.type}</code></td>
                    <td>{p.default}</td>
                    <td>{p.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}