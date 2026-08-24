import { useEffect } from "react";
import Modal from "../../../components/Modal";
import Form, { FormItem, useForm } from "../../../components/Form";
import Input from "../../../components/Input";
import Select from "../../../components/Select";
import Checkbox from "../../../components/Checkbox";
import Radio from "../../../components/Radio";
import Switch from "../../../components/Switch";
import Button from "../../../components/Button";
import Icon from "../../../components/Icon";
import type { User } from "../mock";
import type { FormInstance } from "../../../components/Form";
import "./UserForm.css";

export interface UserFormValues {
  name: string;
  email: string;
  role: string;
  status: string;
  department: string;
  description: string;
  notifications: boolean;
  agree: boolean;
}

export interface UserFormProps {
  open: boolean;
  mode: "create" | "edit";
  user?: User | null;
  onClose: () => void;
  onSubmit: (values: UserFormValues) => void;
}

const roleOptions = [
  { label: "Administrator", value: "Administrator" },
  { label: "Editor", value: "Editor" },
  { label: "Developer", value: "Developer" },
  { label: "Viewer", value: "Viewer" },
];

const departmentOptions = [
  { label: "Engineering", value: "engineering" },
  { label: "Design", value: "design" },
  { label: "Marketing", value: "marketing" },
  { label: "Sales", value: "sales" },
  { label: "Operations", value: "operations" },
];

export default function UserForm({ open, mode, user, onClose, onSubmit }: UserFormProps) {
  const form = useForm<UserFormValues>();

  useEffect(() => {
    if (open && mode === "edit" && user) {
      form.setFieldsValue({
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        department: "engineering",
        description: "",
        notifications: true,
        agree: false,
      } as Partial<UserFormValues>);
    } else if (open && mode === "create") {
      form.resetFields();
    }
  }, [open, mode, user, form]);

  const handleSubmit = async () => {
    const isValid = await form.validate();
    if (isValid) {
      const values = form.getFieldsValue();
      onSubmit(values);
    }
  };

  const title = mode === "create" ? "Create User" : "Edit User";

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={
        <span className="pixel-user-form-title">
          <Icon name={mode === "create" ? "plus" : "edit"} size="sm" />
          {title}
        </span>
      }
      size="md"
      footer={
        <div className="pixel-user-form-footer">
          <Button variant="secondary" size="md" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" size="md" onClick={handleSubmit}>
            {mode === "create" ? "Create User" : "Update User"}
          </Button>
        </div>
      }
    >
      <Form<UserFormValues>
        form={form}
        initialValues={{
          name: "",
          email: "",
          role: "",
          status: "active",
          department: "",
          description: "",
          notifications: true,
          agree: false,
        }}
      >
        <div className="pixel-user-form-grid">
          <FormItem
            label="Username"
            name="name"
            rules={[{ required: true, message: "Username is required" }]}
          >
            <Input placeholder="Enter username" size="md" />
          </FormItem>

          <FormItem
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Email is required" },
              { pattern: /^[^@]+@[^@]+\.[^@]+$/, message: "Invalid email format" },
            ]}
          >
            <Input placeholder="Enter email" size="md" variant="outlined" />
          </FormItem>

          <FormItem
            label="Role"
            name="role"
            rules={[{ required: true, message: "Please select a role" }]}
          >
            <Select
              options={roleOptions}
              placeholder="Select role"
              size="md"
            />
          </FormItem>

          <FormItem label="Department" name="department">
            <Select
              options={departmentOptions}
              placeholder="Select department"
              size="md"
            />
          </FormItem>

          <FormItem
            label="Status"
            name="status"
            rules={[{ required: true, message: "Status is required" }]}
          >
            <Radio
              options={[
                { label: "Active", value: "active" },
                { label: "Pending", value: "pending" },
                { label: "Disabled", value: "disabled" },
              ]}
              direction="horizontal"
            />
          </FormItem>

          <FormItem label="Enable Notifications" name="notifications">
            <Switch />
          </FormItem>
        </div>

        <FormItem label="Description" name="description">
          <Input.TextArea
            placeholder="Enter description..."
            rows={4}
            size="md"
          />
        </FormItem>

        <FormItem
          label=""
          name="agree"
          rules={[{ required: true, message: "You must agree to the terms" }]}
        >
          <Checkbox>
            I agree to the terms and conditions
          </Checkbox>
        </FormItem>
      </Form>
    </Modal>
  );
}

export type { FormInstance };
