import type { Meta, StoryObj } from "@storybook/react";
import Form, { type FormInstance, type FormProps } from ".";
import { FormItem } from "./FormItem";
import { useForm } from "./useForm";
import Input from "../Input";
import Checkbox from "../Checkbox";
import Button from "../Button";
import Select from "../Select";
import { useState } from "react";

const meta: Meta<FormProps<{
  username: string;
  password: string;
  gender: string;
  remember: boolean;
}>> = {
  title: "Components/Data Entry/Form",
  component: Form,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
};

export default meta;

type V = { username: string; password: string; gender: string; remember: boolean };

type Story = StoryObj<FormProps<V>>;

/** 基础登录表单（含必填校验） */
export const Login: Story = {
  render: () => {
    const form = useForm<V>();
    const [submitted, setSubmitted] = useState<V | null>(null);

    return (
      <div style={{ maxWidth: 420 }}>
        <Form<V>
          form={form}
          initialValues={{ remember: true }}
          onFinish={(values) => setSubmitted(values)}
          style={{ width: "100%" }}
        >
          <FormItem<V> label="Username" name="username" rules={[{ required: true, message: "Please input username" }]}>
            <Input placeholder="username" />
          </FormItem>

          <FormItem<V> label="Password" name="password" rules={[{ required: true, message: "Please input password" }]}>
            <Input type="password" placeholder="password" />
          </FormItem>

          <FormItem<V> label="Gender" name="gender" rules={[{ required: true }]}>
            <Select
              placeholder="Select gender"
              options={[
                { label: "Male", value: "m" },
                { label: "Female", value: "f" },
                { label: "Other", value: "o" },
              ]}
            />
          </FormItem>

          <FormItem<V> name="remember" valuePropName="checked">
            <Checkbox>Remember me</Checkbox>
          </FormItem>

          <FormItem<V>>
            <div style={{ display: "flex", gap: 8 }}>
              <Button type="submit" variant="primary">Sign In</Button>
              <Button variant="secondary" onClick={() => form.resetFields?.()}>Reset</Button>
            </div>
          </FormItem>
        </Form>

        {submitted && (
          <pre style={{
            marginTop: 16, padding: 12, background: "#fff", border: "2px solid #000",
            fontFamily: "var(--pixel-font)", fontSize: 11, imageRendering: "pixelated",
          }}>
            {JSON.stringify(submitted, null, 2)}
          </pre>
        )}
      </div>
    );
  },
};

// 帮助 TS 推断 FormInstance API，无渲染作用
type _EnsureFormInstance = FormInstance<V>;
