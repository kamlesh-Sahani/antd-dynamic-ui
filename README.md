# antd-dynamic-ui

A high-productivity, modular, schema-driven UI toolkit for **React** and **Ant Design**. Build robust dashboards, dynamic data tables, and schema-generated forms with full TypeScript, Zod validation, and first-class tree-shaking.

---

## 🚀 Key Architectural Highlights

- **Modular Multi-Entry Architecture**: Import only what you need. A single input component compiles down to just **~2.8 KB**, without pulling in the rest of the library.
- **Tree-Shaking by Default**: Clean ESM bundles with strict `sideEffects: ["**/*.css"]` boundaries allow modern bundlers (Vite, Next.js, Rollup, Webpack) to drop unused code completely.
- **Dual Formats & Universal Compatibility**: Works seamlessly in **Next.js (App & Pages Router)**, **Vite**, **Remix**, or vanilla React with both **ESM** and **CommonJS** support.
- **DynamicForm**: Build forms directly from JSON schemas or API responses with automatic Zod validation and computed default values.
- **DynamicTable**: Dynamic server-driven table with search, sorting, filtering, and rich extensible cell renderers.

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

Import the unified stylesheet once in your application root:

```tsx
import "antd-dynamic-ui/styles.css";
```

---

## ⚡ Import Styles

`antd-dynamic-ui` supports two import patterns. Both are fully type-safe and support TypeScript autocomplete.

### 1. Modular Imports (Recommended for Maximum Tree-Shaking)

Modular imports bypass the root barrel file entirely, ensuring optimal cold-start performance and guaranteed minimal bundle sizes:

#### Components (Supports both Default & Named imports):
```tsx
// Default import
import InputField from "antd-dynamic-ui/input-field";
import SelectField from "antd-dynamic-ui/select-field";
import DynamicTable from "antd-dynamic-ui/dynamic-table";
import DynamicForm from "antd-dynamic-ui/dynamic-form";

// Named import
import { InputField } from "antd-dynamic-ui/input-field";
import { SelectField } from "antd-dynamic-ui/select-field";
import { DynamicTable } from "antd-dynamic-ui/dynamic-table";
import { DynamicForm } from "antd-dynamic-ui/dynamic-form";
```

#### Hooks:
```tsx
import { useGridFilters } from "antd-dynamic-ui/hooks/use-grid-filters";
import { useApiOptions } from "antd-dynamic-ui/hooks/use-api-options";
import { useFetch } from "antd-dynamic-ui/hooks/use-fetch";
```

#### Utilities:
```tsx
import { generateZodSchema } from "antd-dynamic-ui/utils/generate-zod-schema";
import { getInitialValues } from "antd-dynamic-ui/utils/get-initial-values";
import { api, createApiClient } from "antd-dynamic-ui/utils/api";
```

#### Context & Providers:
```tsx
import { DynamicUIProvider, useDynamicUI } from "antd-dynamic-ui/context";
import { AntdProvider } from "antd-dynamic-ui/utils";
```

---

### 2. Root Imports (Convenient & Tree-Shakable)

If you prefer importing multiple components from a single source, root imports remain 100% backward-compatible:

```tsx
import {
  DynamicUIProvider,
  AntdProvider,
  DynamicForm,
  DynamicTable,
  InputField,
  SelectField,
  ButtonField,
  useGridFilters,
  generateZodSchema,
} from "antd-dynamic-ui";
```

> **Performance Tip**: Modern bundlers with tree-shaking enabled (like Vite or Next.js App Router) will automatically eliminate unused components from root named imports. However, for micro-frontends or strict bundle budgets, **modular imports** are recommended as they guarantee zero overhead.

---

## 📊 Experimental Tree-Shaking Benchmarks

Tested with production minification and tree-shaking enabled (excluding peer dependencies):

| Import Pattern | Production Bundle Size | Unused Components Included? |
| :--- | :--- | :--- |
| **Modular** (`antd-dynamic-ui/input-field`) | **2.8 KB** | ❌ None (DynamicTable, Modals completely dropped) |
| **Root Named** (`{ InputField } from 'antd-dynamic-ui'`) | **4.3 KB** | ❌ None (DynamicTable, Modals completely dropped) |
| **Full Namespace** (`* as UI from 'antd-dynamic-ui'`) | **1.95 MB** | ✔ All components retained |
| **Modular Hook** (`hooks/use-grid-filters`) | **1.1 KB** | ❌ None |
| **Modular Util** (`utils/generate-zod-schema`) | **1.7 KB** | ❌ None |

---

## 🧩 Complete Subpath Export Map

| Subpath | Description |
| :--- | :--- |
| `antd-dynamic-ui/dynamic-table` | Server & client dynamic table |
| `antd-dynamic-ui/dynamic-form` | Schema-driven form generator |
| `antd-dynamic-ui/dynamic-modal` | Accessible customizable modal |
| `antd-dynamic-ui/dynamic-drawer` | Drawer wrapper with controls |
| `antd-dynamic-ui/dynamic-card` | Data-driven card grid |
| `antd-dynamic-ui/dynamic-header` | Page header with search, refresh & filters |
| `antd-dynamic-ui/dynamic-sidebar` | Responsive collapsible navigation sidebar |
| `antd-dynamic-ui/input-field` (alias: `/form-input`) | Text, email, and URL input field |
| `antd-dynamic-ui/select-field` (alias: `/form-select`) | Standard dropdown selection |
| `antd-dynamic-ui/select-api-field` | Remote paginated debounced select |
| `antd-dynamic-ui/date-field` | Date picker with Dayjs |
| `antd-dynamic-ui/date-range-field` | Date range picker |
| `antd-dynamic-ui/time-picker-field` | Time selector |
| `antd-dynamic-ui/time-range-field` | Time range duration selector |
| `antd-dynamic-ui/switch-field` | Boolean toggle switch |
| `antd-dynamic-ui/checkbox-field` | Single checkbox or group |
| `antd-dynamic-ui/radio-field` | Radio button group |
| `antd-dynamic-ui/password-field` | Password field with reveal toggle |
| `antd-dynamic-ui/text-area-field` | Autosizing textarea |
| `antd-dynamic-ui/number-field` | Formatted number input |
| `antd-dynamic-ui/upload-field` | File drag-and-drop uploader with preview |
| `antd-dynamic-ui/button-field` | Unified button component |
| `antd-dynamic-ui/error-api` | Visual API error fallback view |
| `antd-dynamic-ui/context` | `DynamicUIProvider` and context hooks |
| `antd-dynamic-ui/hooks/use-grid-filters` | Persistent table filter state hook |
| `antd-dynamic-ui/hooks/use-api-options` | Remote select option loading hook |
| `antd-dynamic-ui/hooks/use-fetch` | HTTP data fetching hook |
| `antd-dynamic-ui/utils/generate-zod-schema` | Dynamic Zod schema generator |
| `antd-dynamic-ui/utils/get-initial-values` | Form default value extractor |
| `antd-dynamic-ui/utils/api` | Configurable universal HTTP client |
| `antd-dynamic-ui/types` | TypeScript interfaces and type definitions |

---

## 📄 License

MIT © [Kamlesh Sahani](https://github.com/kamlesh-Sahani)
