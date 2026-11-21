# antd-dynamic-ui

A high-productivity, schema-driven UI toolkit for **React** and **Ant Design**. Build robust dashboards, dynamic data tables, and schema-generated forms in minutes with full TypeScript and Zod validation.

---

## ✨ Features

- **DynamicForm**: Generate fully interactive, responsive forms from a pure JSON schema or an API endpoint, with automatic **Zod validation** and default values.
- **DynamicTable**: Server-driven and client-driven data tables with built-in search, sorting, pagination, and extensible cell renderers (`LINK`, `TEXT`, `IMAGE`, `STATUS`, `ACTION`, `MODAL`, etc.).
- **25+ Form Components**: Pre-configured Ant Design wrappers seamlessly integrated with `react-hook-form` (`InputField`, `SelectField`, `DatePicker`, `DateRangeField`, `UploadField`, `SwitchField`, `CascaderField`, `CountryField`, `PhoneField`, etc.).
- **Zero Framework Lock-in**: Framework agnostic. Works seamlessly in **Next.js (App & Pages Router)**, **Vite**, **Remix**, or vanilla React.
- **Pluggable Architecture**: Inject any HTTP client (e.g. `velocity-http`, Axios, or native fetch) and custom router via `DynamicUIProvider`.
- **Full TypeScript Support**: Complete type definitions and autocomplete out of the box.

---

## 📦 Installation

```bash
npm install antd-dynamic-ui antd react-hook-form zod dayjs
# or
pnpm add antd-dynamic-ui antd react-hook-form zod dayjs
# or
yarn add antd-dynamic-ui antd react-hook-form zod dayjs
```

### Import Styles

Import the baseline stylesheet in your application root:

```tsx
import "antd-dynamic-ui/styles.css";
```

---

## 🚀 Quick Start

### 1. Wrap Your App with `DynamicUIProvider` & `AntdProvider`

```tsx
import React from "react";
import { DynamicUIProvider, AntdProvider } from "antd-dynamic-ui";
import "antd-dynamic-ui/styles.css";

export default function App({ children }: { children: React.ReactNode }) {
  return (
    <AntdProvider primaryColor="#e62e4d" mode="light">
      <DynamicUIProvider
        onNavigate={(url) => {
          // e.g. router.push(url) in Next.js or navigate(url) in React Router
          window.location.href = url;
        }}
        theme={{ primaryColor: "#e62e4d" }}
      >
        {children}
      </DynamicUIProvider>
    </AntdProvider>
  );
}
```

---

### 2. Schema-Driven `DynamicForm`

Define your fields in JSON (or fetch them from a backend API), and `DynamicForm` will automatically build the UI, compute initial values, and enforce Zod validation rules:

```tsx
import React from "react";
import { DynamicForm, FormSchema } from "antd-dynamic-ui";

const userFormSchema: FormSchema = {
  rows: [
    [
      {
        id: "fullName",
        type: "text",
        label: "Full Name",
        placeholder: "Enter full name",
        span: 12,
        validation: { required: true, minLength: 3 },
      },
      {
        id: "email",
        type: "email",
        label: "Email Address",
        placeholder: "user@example.com",
        span: 12,
        validation: { required: true },
      },
    ],
    [
      {
        id: "role",
        type: "select",
        label: "User Role",
        span: 12,
        options: [
          { key: "admin", value: "Administrator" },
          { key: "manager", value: "Manager" },
          { key: "viewer", value: "Viewer" },
        ],
        validation: { required: true },
      },
      {
        id: "isActive",
        type: "toggle",
        label: "Account Active",
        span: 12,
        defaultValue: true,
      },
    ],
  ],
};

export default function UserCreatePage() {
  const handleSubmit = (data: any) => {
    console.log("Form submitted successfully:", data);
  };

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: 24 }}>
      <h2>Create User</h2>
      <DynamicForm
        schema={userFormSchema}
        onSubmit={handleSubmit}
        submitText="Save User"
      />
    </div>
  );
}
```

#### Fetching Form Schema Dynamically From an API

You can also provide an `apiUrl`, and the form will fetch its schema directly from the server:

```tsx
<DynamicForm
  apiUrl="/api/v1/forms/onboarding-schema"
  onSubmit={async (data) => {
    await fetch("/api/v1/users", { method: "POST", body: JSON.stringify(data) });
  }}
/>
```

---

### 3. Server-Driven `DynamicTable`

`DynamicTable` renders columns, headers, and actions dynamically based on backend JSON:

```tsx
import React from "react";
import { DynamicTable } from "antd-dynamic-ui";

export default function UsersTable() {
  return (
    <DynamicTable
      filterKey="users_list_table"
      apiData={{
        apiUrl: "/api/v1/users",
        apiType: "get",
      }}
      onActionClick={({ actionKey, record }) => {
        if (actionKey === "edit") {
          console.log("Edit user:", record);
        } else if (actionKey === "delete") {
          console.log("Delete user:", record);
        }
      }}
    />
  );
}
```

---

### 4. Standalone Form Fields

Every field component can also be used as a standalone controlled or uncontrolled component with `react-hook-form`:

```tsx
import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { InputField, SelectField, DatePickerField, ButtonField } from "antd-dynamic-ui";

export default function CustomForm() {
  const methods = useForm();

  const onSubmit = methods.handleSubmit((data) => {
    console.log(data);
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <InputField id="username" label="Username" validation={{ required: true }} />
        <SelectField
          id="country"
          label="Country"
          options={[
            { key: "in", value: "India" },
            { key: "us", value: "United States" },
          ]}
        />
        <ButtonField type="primary" htmlType="submit">
          Save
        </ButtonField>
      </form>
    </FormProvider>
  );
}
```

---

## 🛠 Available Form Components

| Component | Description |
| :--- | :--- |
| `InputField` | Standard text, email, url, and password inputs |
| `PasswordField` | Secure password field with reveal toggle |
| `TextAreaField` | Multi-line text input with autosize options |
| `NumberField` | Formatted numeric input |
| `SelectField` | Single and multi-select dropdown |
| `SelectApiField` | Searchable remote API-driven select with pagination & debounce |
| `DateField` | Dayjs date picker |
| `DateRangeField` | Range picker for date periods |
| `TimePickerField` | Time selector |
| `TimeRangeField` | Time duration range picker |
| `CountryField` | Country dropdown with flag support |
| `PhoneField` | International phone input with dial codes |
| `SwitchField` | Boolean toggle switch |
| `CheckboxField` | Single checkbox or checkbox group |
| `RadioField` | Radio option group |
| `SliderField` | Range / numeric slider |
| `RatingField` | Star rating selector |
| `ColorPickerField` | Hex / RGB color picker |
| `CascaderField` | Multi-level hierarchical selection |
| `UploadField` | Drag-and-drop file uploader with preview modal |
| `RichTextEditor` | Rich text / markdown editing area |
| `OtpField` | Verification code / OTP input |

---

## 📄 License

MIT © [Kamlesh Sahani](https://github.com/kamlesh-Sahani)
