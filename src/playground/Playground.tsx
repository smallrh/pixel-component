import { useState } from "react";
import Button from "../components/Button";
import Input from "../components/Input";
import Card from "../components/Card";
import Modal from "../components/Modal";
import Toast from "../components/Toast";
import FloatButton from "../components/FloatButton";
import Divider from "../components/Divider";
import Space from "../components/Space";
import { Title, Text, Paragraph, Link } from "../components/Typography";
import Layout, { Header, Sider, Content, Footer } from "../components/Layout";
import { Row, Col } from "../components/Grid";
import Affix from "../components/Affix";
import Splitter from "../components/Splitter";
import Menu from "../components/Menu";
import Dropdown from "../components/Dropdown";
import Breadcrumb from "../components/Breadcrumb";
import Tabs from "../components/Tabs";
import Pagination from "../components/Pagination";
import Steps from "../components/Steps";
import Table from "../components/Table";
import List from "../components/List";
import Descriptions from "../components/Descriptions";
import Badge from "../components/Badge";
import Tag from "../components/Tag";
import Avatar from "../components/Avatar";
import Tooltip from "../components/Tooltip";
import Popover from "../components/Popover";
import Popconfirm from "../components/Popconfirm";
import Collapse from "../components/Collapse";
import Timeline from "../components/Timeline";
import Statistic from "../components/Statistic";
import Image from "../components/Image";
import Carousel from "../components/Carousel";
import Ribbon from "../components/Ribbon";
import InputNumber from "../components/InputNumber";
import Select from "../components/Select";
import Radio from "../components/Radio";
import Checkbox from "../components/Checkbox";
import Switch from "../components/Switch";
import Slider from "../components/Slider";
import Cascader from "../components/Cascader";
import AutoComplete from "../components/AutoComplete";
import Mentions from "../components/Mentions";
import DatePicker from "../components/DatePicker";
import TimePicker from "../components/TimePicker";
import Upload from "../components/Upload";
import Form, { FormItem } from "../components/Form";
import Alert from "../components/Alert";
import Spin from "../components/Spin";
import Progress from "../components/Progress";
import Skeleton from "../components/Skeleton";
import Drawer from "../components/Drawer";
import Result from "../components/Result";
import Transfer from "../components/Transfer";
import Tree from "../components/Tree";
import TreeSelect from "../components/TreeSelect";
import QRCode from "../components/QRCode";
import Watermark from "../components/Watermark";
import Tour from "../components/Tour";
import ColorPicker from "../components/ColorPicker";
import Segmented from "../components/Segmented";
import Anchor from "../components/Anchor";
import EditableTable from "../components/EditableTable";
import Icon from "../components/Icon";
import Rate from "../components/Rate";
import Calendar from "../components/Calendar";
import Flex from "../components/Flex";
import Empty from "../components/Empty";
import { message, useMessage, MessageContainer } from "../components/Message";
import { notification, useNotification, NotificationContainer } from "../components/Notification";
import PageHeader from "../components/PageHeader";

export default function Playground() {
  const [modalOpen, setModalOpen] = useState(false);
  const [toast, setToast] = useState<{ open: boolean; message: string; variant?: "default" | "success" | "error" | "warning" }>({ open: false, message: "" });
  const [page, setPage] = useState(1);
  const [step, setStep] = useState(0);
  const [transferTargetKeys, setTransferTargetKeys] = useState<string[]>([]);
  const [treeSelectValue, setTreeSelectValue] = useState<string>("");
  const [selectValue, setSelectValue] = useState<string>("");
  const [radioValue, setRadioValue] = useState<string>("");
  const [checkboxChecked, setCheckboxChecked] = useState(false);
  const [switchChecked, setSwitchChecked] = useState(false);
  const [sliderValue, setSliderValue] = useState(30);
  const [inputNumberValue, setInputNumberValue] = useState<number | null>(null);
  const [cascaderValue, setCascaderValue] = useState<string[]>([]);
  const [autoCompleteValue, setAutoCompleteValue] = useState("");
  const [mentionsValue, setMentionsValue] = useState("");
  const [datePickerValue, setDatePickerValue] = useState("");
  const [timePickerValue, setTimePickerValue] = useState("");
  const [progressPercent, setProgressPercent] = useState(65);
  const [rateValue, setRateValue] = useState(3);
  const [calendarValue, setCalendarValue] = useState<Date | undefined>(undefined);
  const [editableData, setEditableData] = useState<Record<string, unknown>[]>([
    { key: "1", name: "Alice", age: "28", role: "Designer" },
    { key: "2", name: "Bob", age: "34", role: "Developer" },
    { key: "3", name: "Charlie", age: "42", role: "Manager" },
  ]);
  const { items: msgItems, remove: removeMsg } = useMessage();
  const { items: notifItems, remove: removeNotif } = useNotification();
  const [countdownTarget] = useState(() => Date.now() + 10 * 60 * 1000);

  const showToast = (message: string, variant?: "default" | "success" | "error" | "warning") => {
    setToast({ open: true, message, variant });
  };

  return (
    <div className="playground">
      {/* Layout */}
      <section className="playground-section">
        <h2 className="playground-title">Layout</h2>
        <Layout style={{ border: "2px solid #000", minHeight: 240 }}>
          <Header>Pixel Header</Header>
          <Layout hasSider>
            <Sider>
              <div style={{ padding: "8px 16px" }}>Menu Item 1</div>
              <div style={{ padding: "8px 16px" }}>Menu Item 2</div>
              <div style={{ padding: "8px 16px" }}>Menu Item 3</div>
            </Sider>
            <Content>
              <Title level={3}>Content Area</Title>
              <Paragraph>This is the main content area with pixel layout system. Header, Sider, Content, Footer all work together.</Paragraph>
            </Content>
          </Layout>
          <Footer>Pixel UI ©2026</Footer>
        </Layout>
      </section>

      {/* Grid - Row / Col */}
      <section className="playground-section">
        <h2 className="playground-title">Grid (Row / Col)</h2>
        <Row gutter={8}>
          <Col span={6}><div style={{ background: "#e8e8e8", padding: 8, border: "1px solid #000", textAlign: "center", fontSize: 11 }}>6</div></Col>
          <Col span={6}><div style={{ background: "#e8e8e8", padding: 8, border: "1px solid #000", textAlign: "center", fontSize: 11 }}>6</div></Col>
          <Col span={6}><div style={{ background: "#e8e8e8", padding: 8, border: "1px solid #000", textAlign: "center", fontSize: 11 }}>6</div></Col>
          <Col span={6}><div style={{ background: "#e8e8e8", padding: 8, border: "1px solid #000", textAlign: "center", fontSize: 11 }}>6</div></Col>
        </Row>
        <div style={{ height: 8 }} />
        <Row gutter={[8, 8]}>
          <Col span={12}><div style={{ background: "#ddd", padding: 8, border: "1px solid #000", textAlign: "center", fontSize: 11 }}>12</div></Col>
          <Col span={12}><div style={{ background: "#ddd", padding: 8, border: "1px solid #000", textAlign: "center", fontSize: 11 }}>12</div></Col>
          <Col span={8}><div style={{ background: "#ccc", padding: 8, border: "1px solid #000", textAlign: "center", fontSize: 11 }}>8</div></Col>
          <Col span={8} offset={8}><div style={{ background: "#ccc", padding: 8, border: "1px solid #000", textAlign: "center", fontSize: 11 }}>8 offset 8</div></Col>
        </Row>
        <div style={{ height: 8 }} />
        <Row justify="center" gutter={8}>
          <Col span={4}><div style={{ background: "#eee", padding: 8, border: "1px solid #000", textAlign: "center", fontSize: 11 }}>4</div></Col>
          <Col span={4}><div style={{ background: "#eee", padding: 8, border: "1px solid #000", textAlign: "center", fontSize: 11 }}>4</div></Col>
        </Row>
      </section>

      {/* Affix */}
      <section className="playground-section" id="affix-demo" style={{ position: "relative", minHeight: 120 }}>
        <h2 className="playground-title">Affix</h2>
        <Affix offsetTop={60}>
          <div style={{ background: "#000", color: "#fff", padding: "8px 16px", fontFamily: "var(--pixel-font)", fontSize: 12 }}>
            ⬆ I am affixed when scrolled past (offsetTop=60)
          </div>
        </Affix>
        <Text type="secondary">Scroll up to see the affix bar stick to top.</Text>
      </section>

      {/* Splitter */}
      <section className="playground-section">
        <h2 className="playground-title">Splitter</h2>
        <Splitter style={{ height: 120 }}>
          <div style={{ padding: 8, fontFamily: "var(--pixel-font)", fontSize: 12 }}>Left Panel<br />Drag the black bar</div>
          <div style={{ padding: 8, fontFamily: "var(--pixel-font)", fontSize: 12 }}>Right Panel</div>
        </Splitter>
        <div style={{ height: 8 }} />
        <Splitter direction="vertical" style={{ height: 120 }}>
          <div style={{ padding: 8, fontFamily: "var(--pixel-font)", fontSize: 12 }}>Top Panel</div>
          <div style={{ padding: 8, fontFamily: "var(--pixel-font)", fontSize: 12 }}>Bottom Panel</div>
        </Splitter>
      </section>

      {/* Flex */}
      <section className="playground-section">
        <h2 className="playground-title">Flex</h2>
        <Text strong>Basic row</Text>
        <div style={{ height: 4 }} />
        <Flex gap={8} style={{ border: "2px solid #000", padding: 8, marginBottom: 12 }}>
          <div style={{ background: "#e8e8e8", border: "1px solid #000", padding: "4px 12px", fontSize: 12 }}>Item A</div>
          <div style={{ background: "#e8e8e8", border: "1px solid #000", padding: "4px 12px", fontSize: 12 }}>Item B</div>
          <div style={{ background: "#e8e8e8", border: "1px solid #000", padding: "4px 12px", fontSize: 12 }}>Item C</div>
        </Flex>
        <Text strong>Vertical + justify</Text>
        <div style={{ height: 4 }} />
        <Flex vertical gap={8} justify="space-between" align="center" style={{ border: "2px solid #000", padding: 8, height: 110 }}>
          <div style={{ background: "#e8e8e8", border: "1px solid #000", padding: "4px 12px", fontSize: 12 }}>Top</div>
          <div style={{ background: "#e8e8e8", border: "1px solid #000", padding: "4px 12px", fontSize: 12 }}>Middle</div>
          <div style={{ background: "#e8e8e8", border: "1px solid #000", padding: "4px 12px", fontSize: 12 }}>Bottom</div>
        </Flex>
        <div style={{ height: 8 }} />
        <Text strong>Wrap</Text>
        <div style={{ height: 4 }} />
        <Flex wrap gap={[8, 8]} style={{ border: "2px solid #000", padding: 8, width: 260 }}>
          {Array.from({ length: 8 }, (_, i) => (
            <div key={i} style={{ background: "#e8e8e8", border: "1px solid #000", padding: "4px 10px", fontSize: 12 }}>{i + 1}</div>
          ))}
        </Flex>
      </section>

      {/* Menu */}
      <section className="playground-section">
        <h2 className="playground-title">Menu</h2>
        <Row gutter={16}>
          <Col span={12}>
            <Text strong>Horizontal</Text>
            <div style={{ height: 4 }} />
            <Menu
              mode="horizontal"
              defaultSelectedKey="home"
              items={[
                { key: "home", label: "Home" },
                { key: "about", label: "About" },
                {
                  key: "products",
                  label: "Products",
                  children: [
                    { key: "p1", label: "Pixel Art" },
                    { key: "p2", label: "Icons" },
                    { key: "p3", label: "Fonts" },
                  ],
                },
                { key: "contact", label: "Contact", disabled: true },
              ]}
            />
          </Col>
          <Col span={12}>
            <Text strong>Vertical</Text>
            <div style={{ height: 4 }} />
            <Menu
              mode="vertical"
              defaultSelectedKey="dashboard"
              items={[
                { key: "dashboard", label: "Dashboard" },
                {
                  key: "settings",
                  label: "Settings",
                  children: [
                    { key: "profile", label: "Profile" },
                    { key: "security", label: "Security" },
                  ],
                },
                { key: "logout", label: "Logout", disabled: true },
              ]}
            />
          </Col>
        </Row>
      </section>

      {/* Dropdown */}
      <section className="playground-section">
        <h2 className="playground-title">Dropdown</h2>
        <Dropdown
          trigger="click"
          items={[
            { key: "view", label: "View" },
            { key: "edit", label: "Edit" },
            { key: "div1", label: "", divider: true },
            { key: "delete", label: "Delete", danger: true },
            { key: "archive", label: "Archive", disabled: true },
          ]}
          onSelect={(key) => showToast(`Selected: ${key}`)}
        >
          <Button>Click me ▾</Button>
        </Dropdown>
        <span style={{ marginLeft: 16 }} />
        <Dropdown
          trigger="hover"
          items={[
            { key: "save", label: "Save" },
            { key: "save-as", label: "Save As" },
          ]}
        >
          <Text strong style={{ cursor: "pointer", borderBottom: "2px dotted #000" }}>Hover me ▾</Text>
        </Dropdown>
      </section>

      {/* Breadcrumb */}
      <section className="playground-section">
        <h2 className="playground-title">Breadcrumb</h2>
        <Breadcrumb
          items={[
            { title: "Home", href: "#" },
            { title: "Components", href: "#" },
            { title: "Navigation" },
          ]}
        />
      </section>

      {/* Tabs */}
      <section className="playground-section">
        <h2 className="playground-title">Tabs</h2>
        <Tabs
          items={[
            { key: "tab1", label: "Tab 1", children: <Text>Content of Tab 1. Pixel styled tabs.</Text> },
            { key: "tab2", label: "Tab 2", children: <Text>Content of Tab 2. Retro vibes.</Text> },
            { key: "tab3", label: "Disabled", disabled: true, children: <Text>Can't see me.</Text> },
            { key: "tab4", label: "Tab 4", children: <Text>Content of Tab 4. Ready for action.</Text> },
          ]}
        />
      </section>

      {/* Pagination */}
      <section className="playground-section">
        <h2 className="playground-title">Pagination</h2>
        <Pagination
          current={page}
          total={85}
          pageSize={10}
          showTotal
          onChange={(p) => setPage(p)}
        />
      </section>

      {/* Steps */}
      <section className="playground-section">
        <h2 className="playground-title">Steps</h2>
        <Steps
          current={step}
          items={[
            { title: "Step 1", description: "Start" },
            { title: "Step 2", description: "Process" },
            { title: "Step 3", description: "Review" },
            { title: "Step 4", description: "Done" },
          ]}
        />
        <div style={{ marginTop: 12 }}>
          <Space>
            <Button size="sm" disabled={step <= 0} onClick={() => setStep((s) => Math.max(0, s - 1))}>
              ◀ Prev
            </Button>
            <Button size="sm" disabled={step >= 4} onClick={() => setStep((s) => Math.min(4, s + 1))}>
              Next ▶
            </Button>
          </Space>
        </div>
        <div style={{ height: 16 }} />
        <Steps
          direction="vertical"
          current={1}
          items={[
            { title: "Design", description: "Create mockups" },
            { title: "Develop", description: "Write code" },
            { title: "Deploy", description: "Ship it" },
          ]}
        />
      </section>

      {/* Typography */}
      <section className="playground-section">
        <h2 className="playground-title">Typography</h2>
        <Title level={1}>Title H1</Title>
        <Title level={2}>Title H2</Title>
        <Title level={3}>Title H3</Title>
        <Space>
          <Text>Default text</Text>
          <Text type="secondary">Secondary</Text>
          <Text type="disabled">Disabled</Text>
          <Text strong>Strong</Text>
          <Text mark>Marked</Text>
          <Text delete>Deleted</Text>
          <Text underline>Underline</Text>
          <Text code>code</Text>
        </Space>
        <Paragraph>This is a paragraph with pixel style. Every line follows the 8px grid and monospace font. Perfect for retro UI.</Paragraph>
        <Paragraph style={{ background: "#f5f5f5", padding: 8, border: "1px solid #000" }}>
          像素字体支持中文：你好，世界！这是复古像素风格的简体中文排版，每个汉字都遵循像素网格绘制。
        </Paragraph>
        <Link href="https://github.com">Pixel Link</Link>
      </section>

      {/* Divider */}
      <section className="playground-section">
        <h2 className="playground-title">Divider</h2>
        <Space direction="vertical" size="lg">
          <Divider />
          <Divider text="Section Label" />
          <Divider text="Left" orientation="left" />
          <Divider text="Right" orientation="right" />
        </Space>
      </section>

      {/* Space */}
      <section className="playground-section">
        <h2 className="playground-title">Space</h2>
        <Space size="sm" wrap>
          <Button size="sm">A</Button>
          <Button size="sm">B</Button>
          <Button size="sm">C</Button>
          <Button size="sm">D</Button>
          <Button size="sm">E</Button>
        </Space>
        <div style={{ height: 8 }} />
        <Space direction="vertical" size="md">
          <Button size="sm">Vertical 1</Button>
          <Button size="sm">Vertical 2</Button>
          <Button size="sm">Vertical 3</Button>
        </Space>
      </section>

      {/* Icon */}
      <section className="playground-section">
        <h2 className="playground-title">Icon</h2>
        <div className="playground-row">
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
        </div>
        <div className="playground-row">
          <Icon name="arrow-up" />
          <Icon name="arrow-down" />
          <Icon name="arrow-left" />
          <Icon name="arrow-right" />
          <Icon name="chevron-up" />
          <Icon name="chevron-down" />
          <Icon name="chevron-left" />
          <Icon name="chevron-right" />
          <Icon name="edit" />
          <Icon name="trash" />
          <Icon name="download" />
          <Icon name="upload" />
        </div>
        <div className="playground-row">
          <Icon name="info" />
          <Icon name="warning" />
          <Icon name="error" />
          <Icon name="success" />
          <Icon name="refresh" spin />
          <Icon name="menu" />
          <Icon name="more" />
          <Icon name="eye" />
          <Icon name="eye-off" />
          <Icon name="copy" />
          <Icon name="external" />
        </div>
        <div className="playground-row">
          <Icon name="star" size="sm" />
          <Icon name="star" size="md" />
          <Icon name="star" size="lg" />
          <Icon name="heart" color="#c00" size="lg" />
          <Icon name="info" color="#00c" size="lg" />
        </div>
      </section>

      {/* Button */}
      <section className="playground-section">
        <h2 className="playground-title">Button</h2>
        <div className="playground-row">
          <Button>Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="danger">Danger</Button>
        </div>
        <div className="playground-row">
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
        </div>
        <div className="playground-row">
          <Button disabled>Disabled</Button>
        </div>
      </section>

      {/* FloatButton */}
      <section className="playground-section">
        <h2 className="playground-title">FloatButton</h2>
        <Space>
          <FloatButton variant="primary" position="bottom-left" size="sm">+</FloatButton>
          <FloatButton variant="secondary" position="top-left" size="sm">?</FloatButton>
          <FloatButton variant="danger" position="top-right" size="sm">X</FloatButton>
          <FloatButton variant="primary" position="bottom-right">↑</FloatButton>
        </Space>
        <Text type="secondary" style={{ display: "block", marginTop: 8 }}>实际使用可设置 position 定位到四角</Text>
        <div style={{ marginTop: 8 }}>
          <Text strong>FloatButton.BackTop</Text>
          <Text type="secondary" style={{ marginLeft: 8, fontSize: 11 }}>（visibilityHeight=1 立即显示，点击回到顶部）</Text>
        </div>
        <div style={{ marginTop: 4 }}>
          <FloatButton.BackTop visibilityHeight={1} size="sm">↑</FloatButton.BackTop>
        </div>
      </section>

      {/* Input */}
      <section className="playground-section">
        <h2 className="playground-title">Input</h2>
        <div className="playground-row">
          <Input placeholder="outlined..." />
          <Input variant="filled" placeholder="filled..." />
        </div>
        <div className="playground-row">
          <Input size="sm" placeholder="small" />
          <Input size="md" placeholder="medium" />
          <Input size="lg" placeholder="large" />
        </div>
        <div className="playground-row">
          <Input disabled value="disabled" />
        </div>
      </section>

      {/* Card */}
      <section className="playground-section">
        <h2 className="playground-title">Card</h2>
        <div className="playground-row" style={{ alignItems: "stretch" }}>
          <Card variant="outlined" size="md" style={{ flex: 1 }}>
            <div className="pixel-card-header">Outlined</div>
            <div className="pixel-card-body">A simple outlined card with pixel border.</div>
          </Card>
          <Card variant="elevated" size="md" style={{ flex: 1 }}>
            <div className="pixel-card-header">Elevated</div>
            <div className="pixel-card-body">Floating card with deeper shadow.</div>
          </Card>
          <Card variant="inset" size="md" style={{ flex: 1 }}>
            <div className="pixel-card-header">Inset</div>
            <div className="pixel-card-body">Pressed-in look with inner shadow.</div>
          </Card>
        </div>
        <div style={{ height: 12 }} />
        <div className="playground-row" style={{ alignItems: "stretch" }}>
          <Card title="Meta Card" extra={<Tag>NEW</Tag>} style={{ width: 260 }}>
            <Card.Meta
              avatar={<Avatar size="sm">PX</Avatar>}
              title="Pixel UI"
              description="A retro-styled component library with hard shadows and monospace."
            />
            <div style={{ marginTop: 12, fontSize: 12 }}>
              Card body content with Meta and actions below.
            </div>
          </Card>
          <Card
            title="Actions"
            style={{ width: 260 }}
            actions={[
              <span key="like">♥</span>,
              <span key="share">↗</span>,
              <span key="more">⋯</span>,
            ]}
          >
            <Card.Meta
              avatar={<Avatar size="sm" style={{ background: "#e8e8e8" }}>🖼</Avatar>}
              title="Actions Demo"
              description="Hover the bottom actions to see pixel highlight."
            />
          </Card>
        </div>
      </section>

      {/* Modal */}
      <section className="playground-section">
        <h2 className="playground-title">Modal</h2>
        <div className="playground-row">
          <Button onClick={() => setModalOpen(true)}>Open Modal</Button>
        </div>
        <Modal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Pixel Modal"
        >
          <p>This is a pixel-styled modal dialog.</p>
          <p>Press ESC or click the ✕ button to close.</p>
          <div style={{ marginTop: 16 }}>
            <Button onClick={() => setModalOpen(false)}>Close</Button>
          </div>
        </Modal>
      </section>

      {/* Toast */}
      <section className="playground-section">
        <h2 className="playground-title">Toast</h2>
        <div className="playground-row">
          <Button onClick={() => showToast("Item saved!", "success")}>Success</Button>
          <Button variant="danger" onClick={() => showToast("Something went wrong!", "error")}>Error</Button>
          <Button variant="secondary" onClick={() => showToast("Check your input!", "warning")}>Warning</Button>
          <Button onClick={() => showToast("Hello from Pixel UI!")}>Default</Button>
        </div>
        <Toast
          open={toast.open}
          onClose={() => setToast(prev => ({ ...prev, open: false }))}
          message={toast.message}
          variant={toast.variant}
        />
      </section>

      {/* Table */}
      <section className="playground-section">
        <h2 className="playground-title">Table</h2>
        <Table
          columns={[
            { key: "name", title: "Name", dataIndex: "name" },
            { key: "age", title: "Age", dataIndex: "age" },
            { key: "role", title: "Role", dataIndex: "role" },
            {
              key: "status",
              title: "Status",
              dataIndex: "status",
              render: (v) => (
                <Tag color={(v as string) === "Active" ? "green" : "red"}>{v as string}</Tag>
              ),
            },
          ]}
          dataSource={[
            { key: "1", name: "Alice", age: 28, role: "Designer", status: "Active" },
            { key: "2", name: "Bob", age: 34, role: "Developer", status: "Active" },
            { key: "3", name: "Charlie", age: 42, role: "Manager", status: "Inactive" },
          ]}
        />
      </section>

      {/* List */}
      <section className="playground-section">
        <h2 className="playground-title">List</h2>
        <List
          items={[
            { key: "1", title: "Pixel Design System", description: "Complete component library with retro aesthetic", avatar: <span>📦</span> },
            { key: "2", title: "Release v1.0", description: "All core components are ready for production", avatar: <span>🚀</span> },
            { key: "3", title: "Documentation", description: "Read the docs for usage examples", avatar: <span>📄</span> },
          ]}
        />
        <div style={{ height: 12 }} />
        <Text strong>Composition API (List.Item / List.Item.Meta)</Text>
        <div style={{ height: 4 }} />
        <List bordered>
          <List.Item
            avatar={<Avatar size="sm">PX</Avatar>}
            extra={<Tag>v1.0</Tag>}
            actions={[
              <Button size="sm" key="edit">Edit</Button>,
              <Button size="sm" variant="secondary" key="more">More</Button>,
            ]}
          >
            <List.ItemMeta
              title="Composed Item"
              description="Using List.Item with ItemMeta and actions slots."
            />
          </List.Item>
          <List.Item
            avatar={<Avatar size="sm">UX</Avatar>}
            actions={[<Button size="sm" key="edit">Edit</Button>]}
          >
            <List.ItemMeta
              title="Second Item"
              description="Item meta description for the second composed row."
            />
          </List.Item>
        </List>
      </section>

      {/* Empty */}
      <section className="playground-section">
        <h2 className="playground-title">Empty</h2>
        <div className="playground-row" style={{ alignItems: "flex-start" }}>
          <div style={{ border: "2px solid #000", width: 220 }}>
            <Empty />
          </div>
          <div style={{ border: "2px solid #000", width: 220 }}>
            <Empty
              description="No data found"
              image={<span style={{ fontSize: 32, lineHeight: 1 }}>📭</span>}
            >
              <Button size="sm">Refresh</Button>
            </Empty>
          </div>
        </div>
      </section>

      {/* Descriptions */}
      <section className="playground-section">
        <h2 className="playground-title">Descriptions</h2>
        <Descriptions
          title="User Info"
          items={[
            { label: "Name", children: "Alice Wang" },
            { label: "Email", children: "alice@pixel-ui.com" },
            { label: "Role", children: "Frontend Developer" },
            { label: "Location", children: "Shanghai, China" },
          ]}
        />
      </section>

      {/* Badge & Tag & Avatar */}
      <section className="playground-section">
        <h2 className="playground-title">Badge / Tag / Avatar</h2>
        <Space size="lg" wrap>
          <Space>
            <Badge count={5}>
              <Button size="sm">Inbox</Button>
            </Badge>
            <Badge dot count={1}>
              <Button size="sm">Alerts</Button>
            </Badge>
          </Space>
          <Space>
            <Tag>Default</Tag>
            <Tag color="red">Red</Tag>
            <Tag color="green">Green</Tag>
            <Tag color="blue">Blue</Tag>
            <Tag color="yellow">Yellow</Tag>
            <Tag closable onClose={() => showToast("Tag closed", "warning")}>Closable</Tag>
          </Space>
          <Space>
            <Avatar size="sm">A</Avatar>
            <Avatar size="md">B</Avatar>
            <Avatar size="lg">C</Avatar>
          </Space>
        </Space>
      </section>

      {/* Tooltip & Popover & Popconfirm */}
      <section className="playground-section">
        <h2 className="playground-title">Tooltip / Popover / Popconfirm</h2>
        <Space size="lg" wrap>
          <Tooltip title="Pixel tip!">
            <Button size="sm">Hover for tooltip</Button>
          </Tooltip>
          <Popover title="Pixel Card" content={<span>This is popover content with pixel style.</span>}>
            <Button size="sm">Click for popover</Button>
          </Popover>
          <Popconfirm
            title="Are you sure you want to delete this item?"
            onConfirm={() => showToast("Confirmed!", "success")}
            onCancel={() => showToast("Cancelled", "warning")}
          >
            <Button size="sm" variant="danger">Delete</Button>
          </Popconfirm>
        </Space>
      </section>

      {/* Collapse / Timeline / Statistic */}
      <section className="playground-section">
        <h2 className="playground-title">Collapse / Timeline / Statistic</h2>
        <Space direction="vertical" size="md" style={{ width: "100%" }}>
          <Collapse
            items={[
              { key: "1", label: "Section A", children: "Pixel content for section A." },
              { key: "2", label: "Section B", children: "Pixel content for section B." },
            ]}
          />
          <Timeline
            items={[
              { key: "1", children: "Project started", color: "green" },
              { key: "2", children: "Design phase", color: "blue" },
              { key: "3", children: "Development", color: "default" },
              { key: "4", children: "Launch!", color: "red" },
            ]}
          />
          <Space>
            <Statistic title="Downloads" value="12,345" prefix="📦" />
            <Statistic title="Users" value="8,901" suffix="+1" />
          </Space>
          <div>
            <Text strong>Statistic.Countdown</Text>
            <div style={{ height: 4 }} />
            <Statistic.Countdown
              title="Deploy Time"
              value={countdownTarget}
              format="HH:mm:ss"
              suffix="remaining"
            />          </div>
        </Space>
      </section>

      {/* Image / Carousel / Ribbon */}
      <section className="playground-section">
        <h2 className="playground-title">Image / Carousel / Ribbon</h2>
        <Space size="lg" wrap>
          <Image
            src="https://placehold.co/120x80/000/fff?text=PIXEL"
            alt="pixel placeholder"
            width={120}
            height={80}
          />
          <Carousel
            items={[
              <div key="1">Slide 1 — Pixel UI</div>,
              <div key="2">Slide 2 — Retro Style</div>,
              <div key="3">Slide 3 — Components</div>,
            ]}
            style={{ width: 240 }}
          />
          <Ribbon text="NEW" color="red">
            <Card title="Pixel Card" style={{ width: 160 }}>
              <span>Ribbon demo</span>
            </Card>
          </Ribbon>
        </Space>
      </section>

      {/* Data Entry: Input variants / InputNumber / Select / Radio / Checkbox / Switch / Slider */}
      <section className="playground-section">
        <h2 className="playground-title">Data Entry</h2>
        <Space direction="vertical" size="md" style={{ width: "100%" }}>
          <Space wrap>
            <Input placeholder="Default input" />
            <Input.TextArea placeholder="TextArea" rows={2} style={{ width: 200 }} />
            <Input.Password placeholder="Password" />
            <Input.Search placeholder="Search..." onSearch={(v) => showToast(`Search: ${v}`)} />
            <InputNumber
              placeholder="Number"
              value={inputNumberValue ?? undefined}
              onChange={setInputNumberValue}
            />
          </Space>
          <Space wrap>
            <Select
              options={[
                { label: "Option A", value: "a" },
                { label: "Option B", value: "b" },
                { label: "Option C", value: "c" },
              ]}
              value={selectValue}
              onChange={setSelectValue}
              placeholder="Select..."
            />
            <Radio
              options={[
                { label: "Apple", value: "apple" },
                { label: "Banana", value: "banana" },
                { label: "Cherry", value: "cherry" },
              ]}
              value={radioValue}
              onChange={setRadioValue}
            />
            <Checkbox checked={checkboxChecked} onChange={setCheckboxChecked}>Check me</Checkbox>
            <Switch checked={switchChecked} onChange={setSwitchChecked} />
            <Slider value={sliderValue} onChange={setSliderValue} style={{ width: 160 }} />
          </Space>
        </Space>
      </section>

      {/* Cascader / AutoComplete / Mentions / DatePicker / TimePicker / Upload */}
      <section className="playground-section">
        <h2 className="playground-title">Advanced Entry</h2>
        <Space wrap>
          <Cascader
            options={[
              { label: "Guangdong", value: "gd", children: [{ label: "Shenzhen", value: "sz" }] },
              { label: "Beijing", value: "bj" },
            ]}
            value={cascaderValue}
            onChange={(v) => setCascaderValue(v)}
          />
          <AutoComplete
            options={["Pixel UI", "React", "TypeScript", "Vite"]}
            value={autoCompleteValue}
            onChange={setAutoCompleteValue}
          />
          <Mentions
            options={[{ label: "Alice", value: "alice" }, { label: "Bob", value: "bob" }]}
            value={mentionsValue}
            onChange={setMentionsValue}
          />
          <DatePicker value={datePickerValue} onChange={setDatePickerValue} />
          <TimePicker value={timePickerValue} onChange={setTimePickerValue} />
          <Upload />
        </Space>
      </section>

      {/* Rate */}
      <section className="playground-section">
        <h2 className="playground-title">Rate</h2>
        <div className="playground-row">
          <Rate value={rateValue} onChange={setRateValue} />
        </div>
        <div className="playground-row">
          <Rate defaultValue={2} allowHalf />
        </div>
        <div className="playground-row">
          <Rate defaultValue={4} disabled />
        </div>
      </section>

      {/* Calendar */}
      <section className="playground-section">
        <h2 className="playground-title">Calendar</h2>
        <div className="playground-row">
          <Calendar value={calendarValue} onChange={setCalendarValue} />
        </div>
      </section>

      {/* Form */}
      <section className="playground-section">
        <h2 className="playground-title">Form</h2>
        <Form
          onFinish={(v) => showToast(`Form: ${JSON.stringify(v)}`)}
          style={{ maxWidth: 400 }}
        >
          <FormItem label="Name" name="name">
            <Input name="name" placeholder="Enter name" />
          </FormItem>
          <FormItem label="Email" name="email">
            <Input name="email" placeholder="Enter email" />
          </FormItem>
          <Button type="submit">Submit</Button>
        </Form>
      </section>

      {/* Feedback: Alert / Spin / Progress / Skeleton / Drawer / Result */}
      <section className="playground-section">
        <h2 className="playground-title">Feedback</h2>
        <Space direction="vertical" size="md" style={{ width: "100%" }}>
          <Space wrap>
            <Alert message="Info alert" type="info" />
            <Alert message="Success" type="success" closable />
            <Alert message="Warning" type="warning" description="This is a warning description" />
            <Alert message="Error" type="error" closable />
          </Space>
          <Space wrap>
            <Spin spinning tip="Loading...">
              <div style={{ padding: 16, border: "1px solid #000" }}>Content</div>
            </Spin>
            <Progress percent={progressPercent} />
            <Space>
              <Button size="sm" onClick={() => setProgressPercent(p => Math.max(0, p - 10))}>-10%</Button>
              <Button size="sm" onClick={() => setProgressPercent(p => Math.min(100, p + 10))}>+10%</Button>
            </Space>
            <Skeleton rows={3} style={{ width: 200 }} />
            <Space direction="vertical" size="sm">
              <Skeleton avatar title paragraph={{ rows: 2 }} style={{ width: 240 }} />
              <Space wrap>
                <Skeleton.Avatar shape="circle" />
                <Skeleton.Avatar shape="square" size="lg" />
                <Skeleton.Button size="sm" />
                <Skeleton.Button shape="circle" />
                <Skeleton.Input size="sm" />
                <Skeleton.Input />
                <Skeleton.Image />
              </Space>
            </Space>
          </Space>
          <Space wrap>
            <DrawerDemo />
            <Result
              status="success"
              title="Operation Successful"
              subTitle="Your changes have been saved."
              extra={<Button size="sm">Back</Button>}
            />
          </Space>
        </Space>
      </section>

      {/* PageHeader */}
      <section className="playground-section">
        <h2 className="playground-title">PageHeader</h2>
        <PageHeader
          title="Pixel Dashboard"
          subTitle="Monitor your pixel metrics"
          breadcrumb={<Breadcrumb items={[{ title: "Home" }, { title: "Dashboard" }]} />}
          extra={<Button size="sm">Export</Button>}
          onBack={() => showToast("Back clicked")}
          footer={<Text type="secondary">Last updated: 2026-07-01</Text>}
        />
      </section>

      {/* Anchor */}
      <section className="playground-section">
        <h2 className="playground-title">Anchor</h2>
        <div style={{ display: "flex", gap: 24 }}>
          <div style={{ flex: 1 }}>
            <div id="anchor-sec-1" style={{ height: 120, border: "2px solid #000", padding: 12, marginBottom: 16, background: "#f8f8f8" }}>
              <Text strong>Section 1: Getting Started</Text>
              <Paragraph>Introduction to Pixel UI components.</Paragraph>
            </div>
            <div id="anchor-sec-2" style={{ height: 120, border: "2px solid #000", padding: 12, marginBottom: 16, background: "#f0f0f0" }}>
              <Text strong>Section 2: Components</Text>
              <Paragraph>Explore all available components.</Paragraph>
            </div>
            <div id="anchor-sec-3" style={{ height: 120, border: "2px solid #000", padding: 12, marginBottom: 16, background: "#e8e8e8" }}>
              <Text strong>Section 3: Customization</Text>
              <Paragraph>Theming and style overrides.</Paragraph>
            </div>
          </div>
          <div style={{ width: 160, flexShrink: 0 }}>
            <Anchor
              items={[
                { key: "sec1", href: "#anchor-sec-1", title: "Getting Started" },
                { key: "sec2", href: "#anchor-sec-2", title: "Components" },
                { key: "sec3", href: "#anchor-sec-3", title: "Customization" },
              ]}
              offsetTop={100}
            />
          </div>
        </div>
      </section>

      {/* EditableTable */}
      <section className="playground-section">
        <h2 className="playground-title">EditableTable</h2>
        <EditableTable
          columns={[
            { key: "name", title: "Name", dataIndex: "name" },
            { key: "age", title: "Age", dataIndex: "age" },
            { key: "role", title: "Role", dataIndex: "role" },
          ]}
          dataSource={editableData}
          onSave={(data) => {
            setEditableData(data);
            showToast("Table saved!", "success");
          }}
        />
      </section>

      {/* Message */}
      <section className="playground-section">
        <h2 className="playground-title">Message</h2>
        <Space wrap>
          <Button onClick={() => message({ content: "Info message", type: "info" })}>Info</Button>
          <Button onClick={() => message({ content: "Success message", type: "success" })}>Success</Button>
          <Button variant="danger" onClick={() => message({ content: "Error message", type: "error" })}>Error</Button>
          <Button variant="secondary" onClick={() => message({ content: "Warning message", type: "warning" })}>Warning</Button>
        </Space>
        <MessageContainer items={msgItems} onRemove={removeMsg} />
      </section>

      {/* Notification */}
      <section className="playground-section">
        <h2 className="playground-title">Notification</h2>
        <Space wrap>
          <Button onClick={() => notification({ message: "Info", description: "This is an info notification.", type: "info", duration: 4 })}>Info</Button>
          <Button onClick={() => notification({ message: "Success", description: "Operation completed successfully.", type: "success", duration: 4 })}>Success</Button>
          <Button variant="danger" onClick={() => notification({ message: "Error", description: "Something went wrong.", type: "error", duration: 4 })}>Error</Button>
          <Button variant="secondary" onClick={() => notification({ message: "Warning", description: "Please check your input.", type: "warning", duration: 4 })}>Warning</Button>
        </Space>
        <NotificationContainer items={notifItems} onRemove={removeNotif} />
      </section>

      {/* Transfer / Tree / TreeSelect */}
      <section className="playground-section">
        <h2 className="playground-title">Transfer / Tree / TreeSelect</h2>
        <Space wrap>
          <Transfer
            dataSource={[
              { key: "1", title: "Item 1" },
              { key: "2", title: "Item 2" },
              { key: "3", title: "Item 3" },
              { key: "4", title: "Item 4" },
            ]}
            targetKeys={transferTargetKeys}
            onChange={setTransferTargetKeys}
          />
          <Tree
            treeData={[
              { title: "Root", key: "0", children: [
                { title: "Leaf A", key: "0-0" },
                { title: "Leaf B", key: "0-1", children: [
                  { title: "Leaf B1", key: "0-1-0" },
                ]},
              ]},
            ]}
            defaultExpandAll
          />
          <Tree
            treeData={[
              { title: "Root", key: "c0", children: [
                { title: "Child 1", key: "c0-0" },
                { title: "Child 2", key: "c0-1", children: [
                  { title: "Grandchild", key: "c0-1-0" },
                ]},
                { title: "Child 3 (disabled)", key: "c0-2", disabled: true },
              ]},
            ]}
            defaultExpandAll
            checkable
            defaultCheckedKeys={["c0-1-0"]}
            onCheck={(keys) => showToast(`checked: ${keys.length}`)}
          />
          <TreeSelect
            treeData={[
              { title: "Option 1", value: "1" },
              { title: "Option 2", value: "2", children: [
                { title: "Sub 2-1", value: "2-1" },
              ]},
            ]}
            value={treeSelectValue}
            onChange={setTreeSelectValue}
            placeholder="Tree select"
          />
        </Space>
      </section>

      {/* Special: QRCode / Watermark / Tour / ColorPicker / Segmented */}
      <section className="playground-section">
        <h2 className="playground-title">Special Components</h2>
        <Space wrap>
          <QRCode value="pixel-ui" size={100} />
          <Watermark text="PIXEL">
            <div style={{ width: 160, height: 80, border: "1px solid #000", display: "flex", alignItems: "center", justifyContent: "center" }}>
              Watermarked
            </div>
          </Watermark>
          <TourDemo />
          <ColorPicker />
          <Segmented
            options={[
              { label: "Day", value: "day" },
              { label: "Week", value: "week" },
              { label: "Month", value: "month" },
            ]}
          />
          <Segmented
            size="sm"
            defaultValue="basic"
            options={[
              { label: "Basic", value: "basic" },
              { label: "Pro", value: "pro", disabled: true },
              { label: "Ultra", value: "ultra" },
            ]}
          />
          <Segmented
            block
            options={[
              { label: "All", value: "all" },
              { label: "Draft", value: "draft" },
              { label: "Published", value: "published" },
            ]}
            onChange={(v) => showToast(`segmented: ${v}`)}
          />
          <Segmented
            disabled
            defaultValue="locked"
            options={[
              { label: "Locked", value: "locked" },
              { label: "Unavailable", value: "no" },
            ]}
          />
        </Space>
      </section>
    </div>
  );
}

function DrawerDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button size="sm" onClick={() => setOpen(true)}>Open Drawer</Button>
      <Drawer open={open} onClose={() => setOpen(false)} title="Pixel Drawer">
        <p>Drawer content with pixel style.</p>
      </Drawer>
    </>
  );
}

function TourDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button size="sm" onClick={() => setOpen(true)}>Start Tour</Button>
      <Tour
        open={open}
        onClose={() => setOpen(false)}
        steps={[
          { title: "Welcome", description: "Welcome to Pixel UI component library!" },
          { title: "Components", description: "Explore all the retro-styled components." },
          { title: "Enjoy", description: "Start building with Pixel UI today." },
        ]}
      />
    </>
  );
}