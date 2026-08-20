import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Form, { FormItem, useForm } from "./Form";
import Input from "../Input";
import Checkbox from "../Checkbox";

describe("Form", () => {
  it("collects field values on submit", async () => {
    const onFinish = vi.fn();
    render(
      <Form onFinish={onFinish}>
        <FormItem name="name">
          <Input placeholder="Name" />
        </FormItem>
        <button type="submit">Submit</button>
      </Form>
    );
    fireEvent.change(screen.getByPlaceholderText("Name"), {
      target: { value: "Alice" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Submit" }));
    await waitFor(() => expect(onFinish).toHaveBeenCalled());
    expect(onFinish).toHaveBeenCalledWith({ name: "Alice" });
  });

  it("validates required field and calls onFinishFailed", async () => {
    const onFinish = vi.fn();
    const onFinishFailed = vi.fn();
    render(
      <Form onFinish={onFinish} onFinishFailed={onFinishFailed}>
        <FormItem name="email" rules={[{ required: true, message: "Email required" }]}>
          <Input placeholder="Email" />
        </FormItem>
        <button type="submit">Submit</button>
      </Form>
    );
    fireEvent.click(screen.getByRole("button", { name: "Submit" }));

    await waitFor(() => {
      expect(screen.getByText("Email required")).toBeInTheDocument();
    });
    expect(onFinish).not.toHaveBeenCalled();
    expect(onFinishFailed).toHaveBeenCalled();
    expect(onFinishFailed.mock.calls[0][0].email).toBe("Email required");
  });

  it("clears error when field is filled", async () => {
    render(
      <Form>
        <FormItem name="name" rules={[{ required: true, message: "Required" }]}>
          <Input placeholder="Name" />
        </FormItem>
        <button type="submit">Submit</button>
      </Form>
    );
    fireEvent.click(screen.getByRole("button", { name: "Submit" }));
    await waitFor(() => expect(screen.getByText("Required")).toBeInTheDocument());

    fireEvent.change(screen.getByPlaceholderText("Name"), {
      target: { value: "Bob" },
    });
    await waitFor(() =>
      expect(screen.queryByText("Required")).not.toBeInTheDocument()
    );
  });

  it("supports useForm instance for setFieldValue and validate", async () => {
    const HookHarness = () => {
      const form = useForm();
      return (
        <>
          <Form form={form}>
            <FormItem name="age" rules={[{ required: true, message: "Age required" }]}>
              <Input placeholder="Age" type="number" />
            </FormItem>
          </Form>
          <button
            onClick={() => form.setFieldValue("age", 30)}
          >
            SetAge
          </button>
        </>
      );
    };
    render(<HookHarness />);
    fireEvent.click(screen.getByRole("button", { name: "SetAge" }));
    // 填充后提交不应报错（通过把 input 填成 30）
    expect(screen.getByPlaceholderText("Age")).toHaveValue(30);
  });

  it("collects boolean value from custom Checkbox and reflects checked state", async () => {
    const onFinish = vi.fn();
    render(
      <Form onFinish={onFinish}>
        <FormItem name="agree">
          <Checkbox>I agree</Checkbox>
        </FormItem>
        <button type="submit">Submit</button>
      </Form>
    );
    // 初始未选中：视觉框不带 checked 类
    expect(document.querySelector(".pixel-checkbox-inner--checked")).toBeNull();

    // 点击标签触发表单值更新 + UI 选中
    fireEvent.click(screen.getByText("I agree"));
    await waitFor(() =>
      expect(document.querySelector(".pixel-checkbox-inner--checked")).not.toBeNull()
    );

    fireEvent.click(screen.getByRole("button", { name: "Submit" }));
    await waitFor(() => expect(onFinish).toHaveBeenCalled());
    expect(onFinish).toHaveBeenCalledWith({ agree: true });
  });

  it("collects boolean value from native checkbox input", async () => {
    const onFinish = vi.fn();
    render(
      <Form onFinish={onFinish}>
        <FormItem name="news">
          <input type="checkbox" aria-label="Subscribe" />
        </FormItem>
        <button type="submit">Submit</button>
      </Form>
    );
    fireEvent.click(screen.getByLabelText("Subscribe"));
    fireEvent.click(screen.getByRole("button", { name: "Submit" }));
    await waitFor(() => expect(onFinish).toHaveBeenCalled());
    expect(onFinish).toHaveBeenCalledWith({ news: true });
  });

  it("applies initialValues to fields", async () => {
    const onFinish = vi.fn();
    render(
      <Form initialValues={{ name: "Alice" }} onFinish={onFinish}>
        <FormItem name="name">
          <Input placeholder="Name" />
        </FormItem>
        <button type="submit">Submit</button>
      </Form>
    );
    expect(screen.getByPlaceholderText("Name")).toHaveValue("Alice");
    fireEvent.click(screen.getByRole("button", { name: "Submit" }));
    await waitFor(() => expect(onFinish).toHaveBeenCalled());
    expect(onFinish).toHaveBeenCalledWith({ name: "Alice" });
  });

  it("fires onValuesChange when a field changes", async () => {
    const onValuesChange = vi.fn();
    render(
      <Form onValuesChange={onValuesChange}>
        <FormItem name="name">
          <Input placeholder="Name" />
        </FormItem>
      </Form>
    );
    fireEvent.change(screen.getByPlaceholderText("Name"), {
      target: { value: "Bob" },
    });
    await waitFor(() => expect(onValuesChange).toHaveBeenCalled());
    expect(onValuesChange.mock.calls[0][0]).toEqual({ name: "Bob" });
    expect(onValuesChange.mock.calls[0][1]).toEqual({ name: "Bob" });
  });
});
