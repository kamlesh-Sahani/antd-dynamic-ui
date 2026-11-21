# antd-dynamic-ui

[![npm version](https://img.shields.io/npm/v/antd-dynamic-ui.svg?style=flat-square&color=blue)](https://www.npmjs.com/package/antd-dynamic-ui)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen?style=flat-square)](#)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict%205.x-blue?style=flat-square)](#)
[![Tree Shaking](https://img.shields.io/badge/Tree--Shaking-Verified%20(2.8%20KB)-purple?style=flat-square)](#-tree-shaking-benchmarks)

A high-productivity, modular, schema-driven UI toolkit for **React** and **Ant Design**. Build robust enterprise dashboards, dynamic data tables, and schema-generated forms with automatic Zod validation, conditional logic, and first-class tree-shaking.

---

## 📑 Table of Contents

- [Introduction & Architecture](#-introduction--architecture)
- [Key Features](#-key-features)
- [Requirements & Supported Versions](#-requirements--supported-versions)
- [Installation](#-installation)
- [Quick Start](#-quick-start)
- [Import Patterns & Tree-Shaking](#-import-patterns--tree-shaking)
  - [Modular Imports (Recommended)](#1-modular-imports-recommended)
  - [Root Imports (Backward-Compatible)](#2-root-imports-backward-compatible)
  - [Tree-Shaking Benchmarks](#-tree-shaking-benchmarks)
  - [Subpath Export Reference](#-subpath-export-reference)
- [Core Components Documentation](#-core-components-documentation)
  - [DynamicForm](#1-dynamicform)
  - [DynamicTable](#2-dynamictable)
  - [DynamicModal & DynamicDrawer](#3-dynamicmodal--dynamicdrawer)
  - [DynamicCard](#4-dynamiccard)
  - [DynamicHeader & DynamicSideBar](#5-dynamicheader--dynamicsidebar)
- [Standardized Form Fields](#-standardized-form-fields)
- [Schema Engine & Validation](#-schema-engine--validation)
- [Utilities Reference](#-utilities-reference)
  - [Form & Schema Utilities](#1-form--schema-utilities)
  - [HTTP Client & API Helpers](#2-http-client--api-helpers)
  - [Security & URL Sanitization](#3-security--url-sanitization)
  - [Type Guards & Validation Helpers](#4-type-guards--validation-helpers)
  - [String, Formatting & Color Utilities](#5-string-formatting--color-utilities)
  - [Theme & Provider Utilities](#6-theme--provider-utilities)
  - [Utility Code Examples](#7-utility-code-examples)
- [Framework Integration Guide](#-framework-integration-guide)
  - [Standard React SPA (Vite / CRA / React Router)](#standard-react-spa-vite--cra--react-router)
  - [Next.js App Router (Next.js 14 / 15 / 16)](#app-router-nextjs-14--15--16)
  - [Next.js Pages Router](#pages-router)
- [Theming & Customization](#-theming--customization)
- [Security Architecture](#-security-architecture)
- [Troubleshooting & FAQs](#-troubleshooting--faqs)
- [Changelog](#-changelog)
- [License](#-license)

---

## 🌟 Introduction & Architecture

Modern enterprise applications often spend 70% of frontend development time building repetitive forms, filterable tables, and CRUD dialogs. **`antd-dynamic-ui`** abstracts these repetitive patterns into declarative, JSON-driven components while maintaining complete control over styling, validation, and layout.

### Architectural Pillars

1. **Schema-Driven UI**: Render complex, multi-column forms and rich data tables entirely from JSON configurations or backend API endpoints.
2. **Multi-Entry Tree-Shaking**: Every component, hook, and utility is isolated into independent subpaths. Importing `InputField` produces a bundle of just **2.8 KB**, never loading heavy table, chart, or modal dependencies.
3. **Automatic Schema & Validation Synchronization**: `generateZodSchema` inspects form configurations and creates dynamic Zod validation schemas at runtime, handling regex, min/max limits, dependent conditions, and required checks.
4. **Universal React Compatibility**: Fully certified on **React 18 & 19**, **Ant Design v5 & v6**, **Next.js 14, 15, and 16 (App & Pages Router)**, Vite, and Remix.
5. **Zero Vendor Lock-In**: Decoupled from proprietary CRM logic, hardcoded routes, or external APIs. Bring your own HTTP client, router, or store.

---

## ✨ Key Features

- 🏎️ **Micro-Bundle Overhead**: Subpath modular exports enable precision bundling without pulling in unused modules.
- 📋 **DynamicForm**: Generate multi-step or responsive grid forms from JSON with built-in React Hook Form & Zod validation.
- 📊 **DynamicTable**: Server-driven table with column sorting, nested filters, persistent localStorage state, and 9 built-in cell renderers (`LINK`, `STATUS`, `IMAGE`, `ACTION`, `MODAL`, etc.).
- 🔒 **Enterprise Security**: Built-in protocol sanitization (`javascript:`, `vbscript:`, and `data:` XSS protection), safe error masking, zero hardcoded secrets, and strict npm provenance.
- 🎨 **Theme-Aware**: Seamless integration with Ant Design's `ConfigProvider` tokens and standard CSS custom properties.
- 🌐 **Remote Select & Async Data**: `SelectApiField` with debounced server-side search, pagination, and caching.
- 📱 **Responsive Layouts**: Flexible grid configurations using Ant Design's 24-column layout engine.

---

## 📋 Requirements & Supported Versions

| Technology | Minimum Version | Recommended Version |
| :--- | :--- | :--- |
| **Node.js** | `>= 18.0.0` | `>= 20.x` or `>= 22.x` |
| **React** | `^18.0.0` or `^19.0.0` | `19.x` |
| **React DOM** | `^18.0.0` or `^19.0.0` | `19.x` |
| **Ant Design (`antd`)** | `^5.0.0` or `^6.0.0` | `5.24+` |
| **react-hook-form** | `^7.0.0` | `7.54+` |
| **zod** | `^3.0.0` or `^4.0.0` | `3.23+` |
| **dayjs** | `^1.11.0` | `1.11.13+` |
| **Next.js** (Optional) | `^14.0.0`, `^15.0.0`, `^16.0.0` | `15.x+` (App Router supported) |

---

## 📦 Installation

Install `antd-dynamic-ui` alongside its required peer dependencies:

### Using npm
```bash
npm install antd-dynamic-ui antd react-hook-form zod dayjs
```

### Using pnpm
```bash
pnpm add antd-dynamic-ui antd react-hook-form zod dayjs
```

### Using yarn
```bash
yarn add antd-dynamic-ui antd react-hook-form zod dayjs
```

### Using bun
```bash
bun add antd-dynamic-ui antd react-hook-form zod dayjs
```

### Global Stylesheet Setup

Import the unified CSS styles once in your root layout (`app/layout.tsx`, `pages/_app.tsx`, or `main.tsx`):

```tsx
import "antd-dynamic-ui/styles.css";
```

---

## 🚀 Quick Start

Wrap your application with `AntdProvider` and `DynamicUIProvider` to initialize theme tokens and router integration:

### 1. Root Setup (`App.tsx` or `layout.tsx`)

```tsx
import React from "react";
import { AntdProvider } from "antd-dynamic-ui/utils";
import { DynamicUIProvider } from "antd-dynamic-ui/context";
import "antd-dynamic-ui/styles.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <AntdProvider
      theme={{
        token: {
          colorPrimary: "#1677ff",
          borderRadius: 6,
        },
      }}
    >
      <DynamicUIProvider
        onNavigate={(url, target) => {
          if (target === "_blank") {
            window.open(url, "_blank");
          } else {
            // Integrate with Next.js router.push, React Router navigate, etc.
            window.location.href = url;
          }
        }}
      >
        {children}
      </DynamicUIProvider>
    </AntdProvider>
  );
}
```

### 2. Render a Schema-Driven Form

```tsx
import React from "react";
import DynamicForm, { FormSchema } from "antd-dynamic-ui/dynamic-form";

const contactSchema: FormSchema = {
  rows: [
    [
      {
        id: "name",
        type: "input",
        label: "Full Name",
        placeholder: "Jane Doe",
        span: 12,
        required: true,
        validation: { minLength: 2, maxLength: 50 },
      },
      {
        id: "email",
        type: "email",
        label: "Email Address",
        placeholder: "jane@example.com",
        span: 12,
        required: true,
        validation: { email: true },
      },
    ],
    [
      {
        id: "role",
        type: "select",
        label: "Account Role",
        span: 24,
        required: true,
        options: [
          { key: "admin", value: "Administrator" },
          { key: "developer", value: "Developer" },
          { key: "viewer", value: "Viewer" },
        ],
      },
    ],
  ],
};

export function ContactPage() {
  const handleSubmit = async (data: Record<string, any>) => {
    console.log("Form submitted successfully:", data);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Create Account</h2>
      <DynamicForm
        schema={contactSchema}
        onSubmit={handleSubmit}
        submitText="Save Account"
      />
    </div>
  );
}
```

---

## ⚡ Import Patterns & Tree-Shaking

`antd-dynamic-ui` provides dual-import architecture. Choose the pattern that best matches your project's performance requirements.

### 1. Modular Imports (Recommended)

Modular imports bypass the library barrel file and point directly to isolated component bundles. This guarantees zero unused code overhead:

```tsx
// Form Components (Default or Named)
import InputField from "antd-dynamic-ui/input-field";
import { SelectField } from "antd-dynamic-ui/select-field";
import DateField from "antd-dynamic-ui/date-field";

// Dynamic Core Engines
import DynamicForm from "antd-dynamic-ui/dynamic-form";
import DynamicTable from "antd-dynamic-ui/dynamic-table";

// Hooks
import { useGridFilters } from "antd-dynamic-ui/hooks/use-grid-filters";
import { useApiOptions } from "antd-dynamic-ui/hooks/use-api-options";
import { useSafeControl } from "antd-dynamic-ui/hooks/use-safe-control";

// Utilities
import { generateZodSchema } from "antd-dynamic-ui/utils/generate-zod-schema";
import { getInitialValues } from "antd-dynamic-ui/utils/get-initial-values";
import { api, createApiClient } from "antd-dynamic-ui/utils/api";
```

### 2. Root Imports (Backward-Compatible)

For rapid development or smaller projects, root barrel imports are fully supported:

```tsx
import {
  DynamicForm,
  DynamicTable,
  InputField,
  SelectField,
  ButtonField,
  useGridFilters,
  generateZodSchema,
} from "antd-dynamic-ui";
```

---

### 📊 Tree-Shaking Benchmarks

Production build comparison using Rollup & Vite with peer dependencies externalized:

| Import Syntax | Bundle Size (Minified + Gzip) | Unused Components Included? |
| :--- | :--- | :--- |
| `import InputField from 'antd-dynamic-ui/input-field'` | **2.8 KB** | ❌ None (DynamicTable, Modals, Charts dropped) |
| `import { InputField } from 'antd-dynamic-ui'` | **4.3 KB** | ❌ None (Modern bundlers drop unused symbols) |
| `import * as DynamicUI from 'antd-dynamic-ui'` | **1.95 MB** | ✔ All 45+ components and utilities retained |
| `import { useGridFilters } from 'antd-dynamic-ui/hooks/use-grid-filters'` | **1.1 KB** | ❌ None |
| `import { generateZodSchema } from 'antd-dynamic-ui/utils/generate-zod-schema'` | **1.7 KB** | ❌ None |

---

### 🧩 Subpath Export Reference

| Subpath | Description | Default Export | Named Export |
| :--- | :--- | :---: | :---: |
| `antd-dynamic-ui/dynamic-form` | Schema-driven form generator | ✔ | `{ DynamicForm }` |
| `antd-dynamic-ui/dynamic-table` | Data grid with filters & sorting | ✔ | `{ DynamicTable }` |
| `antd-dynamic-ui/dynamic-modal` | Accessible modal dialog wrapper | ✔ | `{ DynamicModal }` |
| `antd-dynamic-ui/dynamic-drawer` | Slide-over drawer with controls | ✔ | `{ DynamicDrawer }` |
| `antd-dynamic-ui/dynamic-card` | Data-driven card grid with skeletons | ✔ | `{ DynamicCard }` |
| `antd-dynamic-ui/dynamic-header` | Page header with search & filters | ✔ | `{ DynamicHeader }` |
| `antd-dynamic-ui/dynamic-sidebar` | Responsive collapsible navigation bar | ✔ | `{ DynamicSideBar }` |
| `antd-dynamic-ui/input-field` | Text, email, and URL input field | ✔ | `{ InputField }` |
| `antd-dynamic-ui/form-input` | Alias for `/input-field` | ✔ | `{ InputField }` |
| `antd-dynamic-ui/select-field` | Ant Design select dropdown | ✔ | `{ SelectField }` |
| `antd-dynamic-ui/form-select` | Alias for `/select-field` | ✔ | `{ SelectField }` |
| `antd-dynamic-ui/select-api-field` | Paginated remote search select | ✔ | `{ SelectApiField }` |
| `antd-dynamic-ui/autocomplete-select` | Autocomplete input with async options | ✔ | `{ AutocompleteSelect }` |
| `antd-dynamic-ui/date-field` | Single date picker | ✔ | `{ DateField }` |
| `antd-dynamic-ui/date-range-field` | Date range picker | ✔ | `{ DateRangeField }` |
| `antd-dynamic-ui/time-picker-field` | Time selector | ✔ | `{ TimePickerField }` |
| `antd-dynamic-ui/time-range-field` | Time range duration selector | ✔ | `{ TimeRangeField }` |
| `antd-dynamic-ui/switch-field` | Toggle switch | ✔ | `{ SwitchField }` |
| `antd-dynamic-ui/checkbox-field` | Checkbox or checkbox group | ✔ | `{ CheckboxField }` |
| `antd-dynamic-ui/radio-field` | Radio button group | ✔ | `{ RadioField }` |
| `antd-dynamic-ui/password-field` | Password field with reveal toggle | ✔ | `{ PasswordField }` |
| `antd-dynamic-ui/text-area-field` | Multiline autosizing text input | ✔ | `{ TextAreaField }` |
| `antd-dynamic-ui/number-field` | Formatted number input | ✔ | `{ NumberField }` |
| `antd-dynamic-ui/upload-field` | File drag-and-drop uploader | ✔ | `{ UploadField }` |
| `antd-dynamic-ui/button-field` | Standardized Ant Design button | ✔ | `{ ButtonField }` |
| `antd-dynamic-ui/error-api` | Visual API error fallback state | ✔ | `{ ErrorApi }` |
| `antd-dynamic-ui/context` | Provider and context hooks | — | `{ DynamicUIProvider, useDynamicUI }` |
| `antd-dynamic-ui/hooks/use-grid-filters` | Persistent table filter state hook | ✔ | `{ useGridFilters }` |
| `antd-dynamic-ui/hooks/use-api-options` | Remote option loader with caching | ✔ | `{ useApiOptions }` |
| `antd-dynamic-ui/hooks/use-fetch` | Lightweight HTTP fetcher | ✔ | `{ useFetch }` |
| `antd-dynamic-ui/hooks/use-safe-control` | Safe React Hook Form control hook | ✔ | `{ useSafeControl }` |
| `antd-dynamic-ui/utils/generate-zod-schema`| Zod schema generator | ✔ | `{ generateZodSchema }` |
| `antd-dynamic-ui/utils/get-initial-values` | Schema default value extractor | ✔ | `{ getInitialValues }` |
| `antd-dynamic-ui/utils/api` | Configurable HTTP client | ✔ | `{ api, createApiClient, uploadApi }` |
| `antd-dynamic-ui/utils/main` | Type guards, debouncer & URL protection | ✔ | `{ isSafeUrl, isNotEmpty, debounce, ... }` |
| `antd-dynamic-ui/utils/number-to-words` | Currency number-to-words converter | ✔ | `{ numberToWords }` |
| `antd-dynamic-ui/utils/adjust-color` | Dynamic color tinting & shading | ✔ | `{ adjustColor }` |
| `antd-dynamic-ui/utils/form-validation` | International phone validator | ✔ | `{ validatePhoneNumber }` |
| `antd-dynamic-ui/utils` | All utilities barrel | ✔ | `*` |
| `antd-dynamic-ui/types` | TypeScript interfaces & types | — | `*` |

---

## 🛠️ Core Components Documentation

### 1. `DynamicForm`

`DynamicForm` renders complete responsive forms from JSON schemas or API endpoints, managing form state with React Hook Form and validating with Zod.

#### Props Reference

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `schema` | `FormSchema` | `undefined` | Static form schema defining rows and field configurations |
| `apiUrl` | `string` | `undefined` | Endpoint URL to fetch schema from automatically |
| `method` | `"GET" \| "POST"` | `"GET"` | HTTP method used when fetching schema from `apiUrl` |
| `options` | `VelocityConfig` | `undefined` | Additional HTTP headers/config for schema fetch |
| `initialValues` | `Record<string, any>` | `{}` | Pre-populated form values overriding schema defaults |
| `onSubmit` | `(data: any) => void \| Promise<void>` | `undefined` | Callback fired on valid submission |
| `onError` | `(errors: Record<string, any>) => void` | `undefined` | Callback fired on validation failure |
| `submitText` | `string` | `"Submit"` | Text displayed inside the submit button |
| `isSubmitting` | `boolean` | `false` | Sets submit button to loading state |
| `showSubmitButton` | `boolean` | `true` | Renders default submit button in footer |
| `className` | `string` | `"w-full p-4 flex flex-col gap-4"` | CSS class names for form container |
| `renderFooter` | `(methods: UseFormReturn) => ReactNode` | `undefined` | Custom footer renderer replacing default button |

#### Conditional Fields Example

Fields can dynamically display based on the state of other fields using `conditions`:

```tsx
const registrationSchema: FormSchema = {
  rows: [
    [
      {
        id: "hasBusiness",
        type: "toggle",
        label: "Do you represent a registered business?",
        span: 24,
        defaultValue: false,
      },
    ],
    [
      {
        id: "companyName",
        type: "input",
        label: "Company Legal Name",
        span: 12,
        required: true,
        // Only visible when hasBusiness equals true
        conditions: [
          {
            field: "hasBusiness",
            operator: "equals",
            value: true,
          },
        ],
      },
      {
        id: "taxId",
        type: "input",
        label: "Tax ID / EIN",
        span: 12,
        required: true,
        conditions: [
          {
            field: "hasBusiness",
            operator: "equals",
            value: true,
          },
        ],
      },
    ],
  ],
};
```

---

### 2. `DynamicTable`

`DynamicTable` is a server-aware data grid capable of rendering complex tables from JSON configurations with pagination, sorting, search, and action dispatchers.

#### Props Reference

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `filterKey` | `string` | **Required** | Unique localStorage key to persist column filters |
| `apiData` | `TableDataResponse` | `undefined` | Server response containing `columns`, `rows`, and `total` |
| `actionUrl` | `string` | `undefined` | Base URL used for server-side actions |
| `bordered` | `boolean` | `true` | Renders borders around table cells |
| `onActionClick` | `(action: TableAction) => void` | `undefined` | Handler for cell actions (buttons, modals, clicks) |
| `className` | `string` | `undefined` | Container class name |
| `emptyText` | `string` | `"No records found"` | Text rendered when table rows are empty |

#### Cell Types Supported

1. **`TEXT`**: Standard formatted text with optional ellipsis tooltip.
2. **`LINK`**: Secure link with protocol sanitization and internal router hook.
3. **`STATUS`**: Colored badges with status mapping (`active`, `pending`, `danger`).
4. **`IMAGE`**: Circular or square thumbnail with modal previewer.
5. **`ACTION`**: Dropdown or button group for edit/delete/audit triggers.
6. **`MODAL`**: Interactive trigger opening dynamic modal forms.
7. **`COMPOSITE`**: Multi-line composite cells (e.g. user avatar + name + email subtitle).

#### Table Server Schema Example

```json
{
  "total": 1,
  "columns": [
    {
      "key": "user",
      "title": "Customer",
      "type": "COMPOSITE",
      "sorter": true
    },
    {
      "key": "status",
      "title": "Account Status",
      "type": "STATUS"
    },
    {
      "key": "actions",
      "title": "Actions",
      "type": "ACTION"
    }
  ],
  "rows": [
    {
      "id": "101",
      "user": {
        "title": "Sarah Connor",
        "subtitle": "sarah@cyberdyne.com",
        "avatar": "https://example.com/avatar.jpg"
      },
      "status": {
        "title": "Active",
        "color": "green"
      },
      "actions": [
        { "actionKey": "edit", "label": "Edit Profile" },
        { "actionKey": "delete", "label": "Suspend", "danger": true }
      ]
    }
  ]
}
```

---

### 3. `DynamicModal` & `DynamicDrawer`

Accessible modal dialog and side-drawer wrappers designed for forms and audit logs:

```tsx
import React, { useState } from "react";
import DynamicModal from "antd-dynamic-ui/dynamic-modal";
import DynamicForm from "antd-dynamic-ui/dynamic-form";

export function EditUserModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <DynamicModal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit User Profile"
      width={600}
    >
      <DynamicForm
        schema={userSchema}
        onSubmit={async (values) => {
          await updateUser(values);
          onClose();
        }}
      />
    </DynamicModal>
  );
}
```

---

### 4. `DynamicCard`

A responsive card grid component with skeleton loaders and action menus:

```tsx
import DynamicCard from "antd-dynamic-ui/dynamic-card";

export function ProjectOverview({ data, loading }: { data: any[]; loading: boolean }) {
  return (
    <DynamicCard
      data={data}
      loading={loading}
      columns={{ xs: 1, sm: 2, md: 3, lg: 4 }}
      onCardClick={(item) => console.log("Card clicked:", item)}
    />
  );
}
```

---

## 🎛️ Standardized Form Fields

All form fields share a unified prop signature and automatically integrate with React Hook Form.

### Common Field Props

Every field accepts:
- `id` (`string`): Unique field identifier and default form key.
- `name` (`string`): Custom nested path (e.g. `metadata.profile.name`).
- `label` (`string`): Descriptive field label.
- `placeholder` (`string`): Input placeholder text.
- `disabled` (`boolean`): Disable user interaction.
- `span` (`number`): Ant Design 24-column grid span (1 to 24).
- `control` (`Control`): Optional. Explicit React Hook Form control (or uses `FormProvider`).
- `className` (`string`): Additional Tailwind or CSS classes.

### Available Fields

```tsx
import InputField from "antd-dynamic-ui/input-field";
import PasswordField from "antd-dynamic-ui/password-field";
import NumberField from "antd-dynamic-ui/number-field";
import TextAreaField from "antd-dynamic-ui/text-area-field";
import SelectField from "antd-dynamic-ui/select-field";
import SelectApiField from "antd-dynamic-ui/select-api-field";
import DateField from "antd-dynamic-ui/date-field";
import DateRangeField from "antd-dynamic-ui/date-range-field";
import TimePickerField from "antd-dynamic-ui/time-picker-field";
import SwitchField from "antd-dynamic-ui/switch-field";
import CheckboxField from "antd-dynamic-ui/checkbox-field";
import RadioField from "antd-dynamic-ui/radio-field";
import UploadField from "antd-dynamic-ui/upload-field";
import OtpField from "antd-dynamic-ui/otp-field";
import PhoneField from "antd-dynamic-ui/phone-field";
import CountryField from "antd-dynamic-ui/country-field";
import CascaderField from "antd-dynamic-ui/cascader-field";
import SliderField from "antd-dynamic-ui/slider-field";
import RatingField from "antd-dynamic-ui/rating-field";
import ColorPickerField from "antd-dynamic-ui/color-picker-field";
import ButtonField from "antd-dynamic-ui/button-field";
```

#### Standalone Field Example (Inside `<FormProvider>`)

Thanks to `useSafeControl`, you do **not** need to manually pass `control` to every field:

```tsx
import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import InputField from "antd-dynamic-ui/input-field";
import PasswordField from "antd-dynamic-ui/password-field";
import ButtonField from "antd-dynamic-ui/button-field";

export function LoginForm() {
  const methods = useForm({
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = methods.handleSubmit((data) => {
    console.log("Logged in with:", data);
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={onSubmit} className="flex flex-col gap-4 max-w-sm">
        <InputField id="email" label="Email Address" type="email" />
        <PasswordField id="password" label="Password" />
        <ButtonField htmlType="submit" type="primary">
          Sign In
        </ButtonField>
      </form>
    </FormProvider>
  );
}
```

---

## 📐 Schema Engine & Validation

### `generateZodSchema`

Converts a 2D array of field configurations into a strictly typed Zod object schema:

```tsx
import { generateZodSchema } from "antd-dynamic-ui/utils/generate-zod-schema";

const schema = generateZodSchema([
  [
    {
      id: "username",
      type: "input",
      required: true,
      validation: { minLength: 3, maxLength: 20 },
    },
    {
      id: "age",
      type: "number",
      required: true,
      validation: { min: 18, max: 120 },
    },
  ],
]);

// Resulting schema is a ZodRawShape validating:
// - username: z.string().min(3).max(20)
// - age: z.number().min(18).max(120)
```

### Supported Validation Directives

- `required` (`boolean` | `string`): Enforces non-empty values with custom message.
- `validation.email` (`boolean`): Enforces email format.
- `validation.url` (`boolean`): Enforces URL format.
- `validation.minLength` (`number`): String length lower bound.
- `validation.maxLength` (`number`): String length upper bound.
- `validation.min` (`number`): Numerical lower bound.
- `validation.max` (`number`): Numerical upper bound.
- `validation.pattern` (`string`): Regex pattern validation.

---

## 🛠️ Utilities Reference

`antd-dynamic-ui` includes a comprehensive set of standalone, tree-shakeable utility functions covering schema generation, HTTP requests, security sanitization, type guarding, string formatting, color manipulation, and theming.

Every utility is available through three import styles depending on your bundling preference:

| Import Style | Example | Bundle Impact |
| :--- | :--- | :--- |
| **Modular Subpath (Recommended)** | `import { generateZodSchema } from 'antd-dynamic-ui/utils/generate-zod-schema';` | 🚀 **~1.7 KB** (zero unused code) |
| **Utils Barrel** | `import { generateZodSchema, api, isSafeUrl } from 'antd-dynamic-ui/utils';` | 📦 Imports only the utility suite |
| **Root Package** | `import { generateZodSchema, api, isSafeUrl } from 'antd-dynamic-ui';` | 📦 Backward-compatible root export |

---

### 1. Form & Schema Utilities

| Function | Modular Import Subpath | Root / Barrel Export | Parameters / Signature | Return Type | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`generateZodSchema`** | `antd-dynamic-ui/utils/generate-zod-schema` | `{ generateZodSchema }`<br>*(named & default)* | `(fieldsOrRows: FieldConfig[] \| FieldConfig[][])` | `z.ZodObject<any>` | Dynamically generates a flat Zod validation schema from 1D or 2D form field configurations. Automatically evaluates types (`string`, `email`, `url`, `number`, `checkbox`, `toggle`, `rating`, `slider`), validation limits (`min`, `max`, `minLength`, `maxLength`, `pattern`), required flags, and skips layout fields (`heading`, `divider`, `paragraph`, `chart`). |
| **`getInitialValues`** | `antd-dynamic-ui/utils/get-initial-values` | `{ getInitialValues }`<br>*(named & default)* | `(fields: FieldConfig[] \| FieldConfig[][])` | `Record<string, any>` | Recursively extracts initial values `{ [id]: value ?? defaultValue }` from 1D or 2D field configurations. Ignores layout-only elements (`heading`, `divider`). |
| **`validatePhoneNumber`** | `antd-dynamic-ui/utils/form-validation` | `{ validatePhoneNumber }`<br>*(named & default)* | `(val: string \| undefined, ctx: z.RefinementCtx)` | `void` | Validates international phone numbers against country dial codes and exact expected digit count using `headless-countries` metadata inside Zod `superRefine`. |

---

### 2. HTTP Client & API Helpers

| Function / Object | Modular Import Subpath | Root / Barrel Export | Methods / Signature | Return Type | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`api`** | `antd-dynamic-ui/utils/api` | `{ api }`<br>*(named & default)* | `api.get(url, config)`<br>`api.post(url, data, config)`<br>`api.put(url, data, config)`<br>`api.patch(url, data, config)`<br>`api.delete(url, config)`<br>`api.request(config)` | `Promise<VelocityResponse<T>>` | Universal pre-configured HTTP client powered by `velocity-http`. Includes 15-second timeout, `application/json` headers, `withCredentials: true`, and standard platform headers. Delegates to the currently active global client instance. |
| **`createApiClient`** | `antd-dynamic-ui/utils/api` | `{ createApiClient }` | `(config?: VelocityConfig)` | `Velocity` | Factory function to instantiate a new isolated `Velocity` HTTP client with custom `baseURL`, timeout, headers, credentials, or interceptors. |
| **`setGlobalApiClient`** | `antd-dynamic-ui/utils/api` | `{ setGlobalApiClient }` | `(client: any)` | `void` | Replaces the default client instance used by the global `api` proxy with a custom client (useful for custom auth interceptors, mock testing, or tenant-specific headers). |
| **`getGlobalApiClient`** | `antd-dynamic-ui/utils/api` | `{ getGlobalApiClient }` | `()` | `any` | Returns the currently active underlying HTTP client instance. |
| **`uploadApi`** | `antd-dynamic-ui/utils/api` | `{ uploadApi }` | `.getPresignedUrl(data)`<br>`.verifyUpload(data)`<br>`.deleteFiles(keys)`<br>`.uploadFile(url, formData, config)` | `Promise<any>` | Standardized cloud upload helpers for presigned S3 / storage workflows with automatic `multipart/form-data` header handling. |

---

### 3. Security & URL Sanitization

| Function | Modular Import Subpath | Root / Barrel Export | Parameters / Signature | Return Type | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`isSafeUrl`** | `antd-dynamic-ui/utils/main` | `{ isSafeUrl }` | `(url?: string)` | `boolean` | Validates URLs to protect against Cross-Site Scripting (XSS). Returns `false` for malicious protocol schemes such as `javascript:`, `vbscript:`, and `data:` URLs. Used internally by table action links, image renderers, and button redirects. |

---

### 4. Type Guards & Validation Helpers

| Function | Modular Import Subpath | Root / Barrel Export | Parameters / Signature | Return Type | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`isArray`** | `antd-dynamic-ui/utils/main` | `{ isArray }` | `(a: any)` | `a is any[]` | Type guard checking if the value is a standard JavaScript Array. |
| **`isNotEmptyArray`** | `antd-dynamic-ui/utils/main` | `{ isNotEmptyArray }` | `(a: T[] \| null \| undefined \| any)` | `a is NonNullable<T[]>` | Type guard checking if the value is an array with at least one element (`length > 0`). |
| **`isString`** | `antd-dynamic-ui/utils/main` | `{ isString }` | `(a: any)` | `a is string` | Type guard checking if the value is a string primitive. |
| **`isNotEmptyString`** | `antd-dynamic-ui/utils/main` | `{ isNotEmptyString }` | `(a: string \| null \| undefined \| any)` | `a is string` | Type guard checking if the string is non-empty after trimming whitespace (`trim().length > 0`). |
| **`isObject`** | `antd-dynamic-ui/utils/main` | `{ isObject }` | `(a: any)` | `a is Record<string, any>` | Type guard checking if the value is a non-null object and not an array. |
| **`isNotEmptyObject`** | `antd-dynamic-ui/utils/main` | `{ isNotEmptyObject }` | `(a: any)` | `a is NonNullable<T>` | Type guard verifying the object is non-null and has at least one own key (`Object.keys(a).length > 0`). |
| **`isNumber`** | `antd-dynamic-ui/utils/main` | `{ isNumber }` | `(a: any)` | `a is number` | Type guard checking if the value is a valid numeric value (`typeof a === "number" && !isNaN(a)`). |
| **`isNotEmptyNumber`** | `antd-dynamic-ui/utils/main` | `{ isNotEmptyNumber }` | `(a: any)` | `a is number` | Type guard checking if the value is a valid number and non-zero (`isNumber(a) && a !== 0`). |
| **`isBoolean`** | `antd-dynamic-ui/utils/main` | `{ isBoolean }` | `(a: any)` | `a is boolean` | Type guard checking if the value is a boolean primitive (`typeof a === "boolean"`). |
| **`isNotEmptyBoolean`**| `antd-dynamic-ui/utils/main` | `{ isNotEmptyBoolean }`| `(a: any)` | `a is true` | Type guard verifying the value is strictly `true`. |
| **`isFunction`** | `antd-dynamic-ui/utils/main` | `{ isFunction }` | `(a: any)` | `a is (...args: any[]) => any` | Type guard checking if the value is a callable function. |
| **`isNotEmptyFunction`**| `antd-dynamic-ui/utils/main` | `{ isNotEmptyFunction }`| `(a: any)` | `a is (...args: any[]) => any` | Type guard verifying the function expects at least one argument (`a.length > 0`). |
| **`isNull`** | `antd-dynamic-ui/utils/main` | `{ isNull }` | `(a: any)` | `a is null` | Type guard checking if the value is strictly `null`. |
| **`isUndefined`** | `antd-dynamic-ui/utils/main` | `{ isUndefined }` | `(a: any)` | `a is undefined` | Type guard checking if the value is strictly `undefined`. |
| **`isNotEmpty`** | `antd-dynamic-ui/utils/main` | `{ isNotEmpty }` | `(a: any)` | `boolean` | Universal emptiness checker. Automatically delegates to string, array, object, number, boolean, or function checks. Returns `false` for `null`, `undefined`, empty strings, empty arrays, and empty objects. |

---

### 5. String, Formatting & Color Utilities

| Function | Modular Import Subpath | Root / Barrel Export | Parameters / Signature | Return Type | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`numberToWords`** | `antd-dynamic-ui/utils/number-to-words` | `{ numberToWords }`<br>*(named & default)* | `(amount: number, currency: string = "USD")` | `string` | Converts numerical amounts into formal English words with currency and cents handling (e.g. `12450.50` -> `"Twelve Thousand Four Hundred Fifty United States Dollar And Fifty Cents Only"`). Supports `"USD"`, `"INR"`, `"EUR"`, `"GBP"`. Ideal for invoices, receipts, and financial documents. |
| **`adjustColor`** | `antd-dynamic-ui/utils/adjust-color` | `{ adjustColor }`<br>*(named & default)* | `(color: string, amount: number = 0)` | `string` | Dynamically tints or shades a hex color without external color libraries. Positive `amount` (+1 to +300) blends with white for lighter tints; negative `amount` (-1 to -150) blends with black for darker shades. Always returns a valid 6-character hex string (`#rrggbb`). |
| **`debounce`** | `antd-dynamic-ui/utils/main` | `{ debounce }` | `(func: T, delay: number)` | `(...args: Parameters<T>) => void` | Creates a debounced function wrapper that delays invoking `func` until after `delay` milliseconds have elapsed since the last time it was called. Perfect for search inputs and window resize listeners. |
| **`responseError`** | `antd-dynamic-ui/utils/main` | `{ responseError }` | `(err: any)` | `string` | Extracts a clean, human-readable error message from diverse API error structures (`err.response.data.message`, `err.data.message`, `err.message`, or fallback `"Something went wrong"`). |
| **`generateLocaleKey`** | `antd-dynamic-ui/utils/main` | `{ generateLocaleKey }` | `(text: string)` | `string` | Converts arbitrary labels or sentences (e.g. `"First Name"`, `"User Profile - Settings"`) into standardized snake_case localization keys (e.g. `"first_name"`, `"user_profile_settings"`). |

---

### 6. Theme & Provider Utilities

| Component / Utility | Modular Import Subpath | Root / Barrel Export | Props / Parameters | Description |
| :--- | :--- | :--- | :--- | :--- |
| **`AntdProvider`** | `antd-dynamic-ui/utils` | `{ AntdProvider }`<br>*(named & default)* | `{ children, mode?: "light" \| "dark", primaryColor?: string, token?: Record<string, any> }` | Pre-configured Ant Design `ConfigProvider` wrapper. Features automatic dark/light algorithm toggling, custom primary color token injection, dynamic custom scrollbar styles, and Ant Design `App` context. |

---

### 7. Utility Code Examples

#### Example 1: Form Schema & Initial Values Generation
```tsx
import { generateZodSchema } from "antd-dynamic-ui/utils/generate-zod-schema";
import { getInitialValues } from "antd-dynamic-ui/utils/get-initial-values";
import type { FieldConfig } from "antd-dynamic-ui/types";

const formFields: FieldConfig[][] = [
  [
    {
      id: "fullName",
      type: "input",
      label: "Full Name",
      defaultValue: "Jane Doe",
      validation: { required: true, minLength: 2 },
    },
    {
      id: "email",
      type: "email",
      label: "Work Email",
      validation: { required: true },
    },
  ],
];

// 1. Generate runtime Zod validation schema
const validationSchema = generateZodSchema(formFields);

// 2. Extract initial values for react-hook-form
const initialValues = getInitialValues(formFields);
// => { fullName: "Jane Doe", email: undefined }
```

#### Example 2: API Client & Presigned Uploads
```tsx
import { api, createApiClient, uploadApi } from "antd-dynamic-ui/utils/api";

// Use the default pre-configured client
const fetchUsers = async () => {
  const response = await api.get("/api/v1/users");
  return response.data;
};

// Or create an isolated client with custom baseURL and auth token
const customApi = createApiClient({
  baseURL: "https://api.external-service.com",
  headers: {
    Authorization: "Bearer your-token-here",
  },
});

// Cloud upload workflow
const handleUpload = async (file: File) => {
  const { data } = await uploadApi.getPresignedUrl({
    filename: file.name,
    contentType: file.type,
    folder: "documents",
  });
  
  const formData = new FormData();
  formData.append("file", file);
  await uploadApi.uploadFile(data.uploadUrl, formData);
  await uploadApi.verifyUpload({ key: data.fileKey });
};
```

#### Example 3: Security & URL Sanitization
```tsx
import { isSafeUrl } from "antd-dynamic-ui/utils/main";

// Protect links, image sources, and redirects against XSS attacks
const handleRedirect = (url: string) => {
  if (!isSafeUrl(url)) {
    console.warn("Blocked potentially malicious URL protocol:", url);
    return;
  }
  window.location.href = url;
};

isSafeUrl("https://example.com/profile"); // true
isSafeUrl("/internal-path");              // true
isSafeUrl("javascript:alert(1)");        // false (blocked)
isSafeUrl("data:text/html,<script>..."); // false (blocked)
```

#### Example 4: Color Shading & Financial Formatting
```tsx
import { adjustColor } from "antd-dynamic-ui/utils/adjust-color";
import { numberToWords } from "antd-dynamic-ui/utils/number-to-words";

// Generate hover & active brand shades dynamically
const brandColor = "#1890ff";
const hoverTint = adjustColor(brandColor, 40);   // Lighter tint for hover
const activeShade = adjustColor(brandColor, -30); // Darker shade for active state

// Spell out financial invoice totals
const invoiceTotal = 15420.50;
const words = numberToWords(invoiceTotal, "USD");
// => "Fifteen Thousand Four Hundred Twenty United States Dollar And Fifty Cents Only"

const inrWords = numberToWords(250000, "INR");
// => "Two Hundred Fifty Thousand Indian Rupee Only"
```

#### Example 5: Type Guards, Debounce & Error Handling
```tsx
import {
  isNotEmpty,
  isNotEmptyArray,
  isNotEmptyObject,
  debounce,
  responseError,
} from "antd-dynamic-ui/utils/main";

// Universal non-empty checks
if (isNotEmpty(formData.items)) {
  console.log("Items are present and valid");
}

// Debounced search handler
const handleSearch = debounce((query: string) => {
  api.get(`/api/v1/search?q=${encodeURIComponent(query)}`);
}, 300);

// Unified error parsing across API calls
try {
  await api.post("/api/v1/submit", payload);
} catch (err) {
  const message = responseError(err);
  console.error("Submission failed:", message);
}
```

---

## ⚡ Framework Integration Guide

`antd-dynamic-ui` is built on standard React primitives and has **zero hard dependencies on Next.js**. It runs natively in:
- ⚛️ **Standard React SPAs** (Vite, Create React App, Webpack) with **React Router** or **TanStack Router**
- ▲ **Next.js App Router** (Next.js 14, 15, and 16 with `@ant-design/nextjs-registry`)
- 📄 **Next.js Pages Router**
- 💿 **Remix** and **Astro** (React islands)

---

### Standard React SPA (Vite / CRA / React Router)

In a standard React application, initialize `antd-dynamic-ui` in your `main.tsx` or `App.tsx`:

#### 1. Setup in `App.tsx`

```tsx
import React from "react";
import { BrowserRouter, useNavigate, Routes, Route } from "react-router-dom";
import { AntdProvider } from "antd-dynamic-ui/utils";
import { DynamicUIProvider } from "antd-dynamic-ui/context";
import "antd-dynamic-ui/styles.css";

// Page Components
import UsersListPage from "./pages/UsersListPage";
import UserFormPage from "./pages/UserFormPage";

function AppContent() {
  const navigate = useNavigate();

  return (
    <AntdProvider primaryColor="#1677ff">
      {/* Route table link clicks and action redirects through React Router */}
      <DynamicUIProvider onNavigate={(url) => navigate(url)}>
        <Routes>
          <Route path="/" element={<UsersListPage />} />
          <Route path="/users/new" element={<UserFormPage />} />
        </Routes>
      </DynamicUIProvider>
    </AntdProvider>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
```

#### 2. Using Components in Any View

```tsx
import React from "react";
import { DynamicForm } from "antd-dynamic-ui/dynamic-form";
import type { FieldConfig } from "antd-dynamic-ui/types";

const formFields: FieldConfig[][] = [
  [
    { id: "fullName", label: "Full Name", type: "input", required: true },
    { id: "email", label: "Email Address", type: "email", required: true },
  ],
];

export default function UserFormPage() {
  return (
    <div style={{ padding: 24 }}>
      <h1>Create New User</h1>
      <DynamicForm
        fields={formFields}
        onSubmit={(data) => console.log("Submitted:", data)}
      />
    </div>
  );
}
```

---

### App Router (Next.js 14 / 15 / 16)

In the Next.js App Router, components that use Ant Design or React state must run on the client. All `antd-dynamic-ui` components include the `"use client";` banner by default.

#### 1. Setup Providers in `app/providers.tsx`

```tsx
"use client";

import React from "react";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { AntdProvider } from "antd-dynamic-ui/utils";
import { DynamicUIProvider } from "antd-dynamic-ui/context";
import { useRouter } from "next/navigation";

export function Providers({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return (
    <AntdRegistry>
      <AntdProvider>
        <DynamicUIProvider onNavigate={(url) => router.push(url)}>
          {children}
        </DynamicUIProvider>
      </AntdProvider>
    </AntdRegistry>
  );
}
```

#### 2. Root Layout in `app/layout.tsx`

```tsx
import "antd-dynamic-ui/styles.css";
import { Providers } from "./providers";

export const metadata = {
  title: "Enterprise Portal",
  description: "Built with antd-dynamic-ui",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

---

### Pages Router

For Next.js Pages Router projects, configure `pages/_app.tsx`:

```tsx
import type { AppProps } from "next/app";
import { AntdProvider } from "antd-dynamic-ui/utils";
import { DynamicUIProvider } from "antd-dynamic-ui/context";
import { useRouter } from "next/router";
import "antd-dynamic-ui/styles.css";

export default function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  return (
    <AntdProvider>
      <DynamicUIProvider onNavigate={(url) => router.push(url)}>
        <Component {...pageProps} />
      </DynamicUIProvider>
    </AntdProvider>
  );
}
```

---

## 🎨 Theming & Customization

### Ant Design Token Customization

`AntdProvider` accepts any valid Ant Design theme configuration:

```tsx
<AntdProvider
  theme={{
    token: {
      colorPrimary: "#722ed1",
      colorSuccess: "#52c41a",
      borderRadius: 8,
      fontFamily: "Inter, sans-serif",
    },
  }}
>
  <App />
</AntdProvider>
```

### CSS Variables

Customize component appearance via CSS variables in your stylesheet:

```css
:root {
  --primary-color: #1677ff;
  --secondary-color: #f0f2f5;
  --text-primary: #1f2937;
  --text-secondary: #6b7280;
  --border-color: #e5e7eb;
  --font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}
```

---

## 🔒 Security Architecture

`antd-dynamic-ui` is built according to strict enterprise security standards:

1. **Protocol Protection (XSS Prevention)**:
   - `LinkCell` and dynamic links automatically validate URLs against `isSafeUrl()`. Dangerous protocols like `javascript:`, `vbscript:`, and `data:` are blocked immediately, preventing DOM-based XSS.
2. **Reverse Tabnabbing Mitigation**:
   - All links opening in new tabs (`target="_blank"`) enforce `rel="noopener noreferrer"`.
3. **Sensitive Data Protection**:
   - `PasswordField` masks input and assigns `autoComplete="new-password"`.
   - Error messages in `DynamicForm` suppress raw field values in production environments.
4. **Supply Chain Integrity**:
   - `prepublishOnly` gates ensure tests and builds must pass before release.
   - Zero production dependencies with known security vulnerabilities (`npm audit` reports 0 vulnerabilities).
   - Automated GitHub Actions releases publish with official **npm provenance**.

---

## ❓ Troubleshooting & FAQs

### 1. `Cannot find module 'antd-dynamic-ui/form-input'`
**Cause**: Legacy module resolution in `tsconfig.json`.
**Solution**: Ensure your `tsconfig.json` has:
```json
{
  "compilerOptions": {
    "moduleResolution": "bundler" /* or "node16" / "nodenext" */
  }
}
```

### 2. Ant Design styles appear unstyled for a split second in Next.js
**Cause**: CSS-in-JS SSR extraction is missing.
**Solution**: Install `@ant-design/nextjs-registry` and wrap your root layout with `<AntdRegistry>`.

### 3. Date picker throws Dayjs formatting errors
**Cause**: Missing Dayjs plugins in your consumer app.
**Solution**: `antd-dynamic-ui` bundles the necessary plugins internally (`customParseFormat`), but if configuring custom Dayjs instances, load `customParseFormat` in your entry file:
```ts
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat.js";
dayjs.extend(customParseFormat);
```

---

## 📝 Changelog

### Version 1.0.0 (Initial Release)

- **Modular Multi-Entry Architecture**: 48 precision entry points for forms, tables, hooks, and utilities.
- **Tree-Shaking**: Shrunk individual component imports to under **2.8 KB**.
- **DynamicForm**: Schema-driven form engine with dynamic Zod generation and React Hook Form.
- **DynamicTable**: High-performance data grid with 9 cell renderers, sorting, and persistent filters.
- **25+ Form Fields**: Standardized inputs, dropdowns, pickers, and uploaders.
- **Next.js Compatibility**: Certified for App Router & Pages Router with `"use client"` directives.
- **Zero Vulnerabilities**: Hardened dependencies and audited against supply chain risks.

---

## 📄 License

MIT © [Kamlesh Sahani](https://github.com/kamlesh-Sahani)
