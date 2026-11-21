const fs = require("fs");
const path = require("path");

function prependUseClientToDir(dir) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      prependUseClientToDir(fullPath);
    } else if (entry.isFile() && (entry.name.endsWith(".js") || entry.name.endsWith(".cjs"))) {
      // Don't add to pure utils if in utils/
      const isPureUtil = fullPath.includes(path.join("dist", "utils"));
      if (!isPureUtil) {
        const content = fs.readFileSync(fullPath, "utf-8");
        if (!content.startsWith('"use client";')) {
          fs.writeFileSync(fullPath, '"use client";\n' + content);
        }
      }
    }
  }
}

module.exports = {
  entry: {
    // Root entry
    index: "src/index.ts",

    // Dynamic Components
    "dynamic-table/index": "src/components/dynamic/DynamicTable/index.ts",
    "dynamic-form/index": "src/components/dynamic/DynamicForm.tsx",
    "dynamic-modal/index": "src/components/dynamic/DynamicModal.tsx",
    "dynamic-card/index": "src/components/dynamic/DynamicCard/index.ts",
    "dynamic-drawer/index": "src/components/dynamic/DynamicDrawer.tsx",
    "dynamic-header/index": "src/components/dynamic/DynamicHeader.tsx",
    "dynamic-sidebar/index": "src/components/dynamic/DynamicSideBar.tsx",

    // Form Components
    "input-field/index": "src/components/form/InputField.tsx",
    "select-field/index": "src/components/form/SelectField.tsx",
    "select-api-field/index": "src/components/form/SelectApiField.tsx",
    "autocomplete-select/index": "src/components/form/AutocompleteSelect.tsx",
    "date-field/index": "src/components/form/DateField.tsx",
    "date-range-field/index": "src/components/form/DateRangeField.tsx",
    "time-picker-field/index": "src/components/form/TimePickerField.tsx",
    "time-range-field/index": "src/components/form/TimeRangeField.tsx",
    "switch-field/index": "src/components/form/SwitchField.tsx",
    "checkbox-field/index": "src/components/form/CheckboxField.tsx",
    "radio-field/index": "src/components/form/RadioField.tsx",
    "password-field/index": "src/components/form/PasswordField.tsx",
    "text-area-field/index": "src/components/form/TextAreaField.tsx",
    "number-field/index": "src/components/form/NumberField.tsx",
    "slider-field/index": "src/components/form/SliderField.tsx",
    "rating-field/index": "src/components/form/RatingField.tsx",
    "color-picker-field/index": "src/components/form/ColorPickerField.tsx",
    "cascader-field/index": "src/components/form/CascaderField.tsx",
    "country-field/index": "src/components/form/CountryField.tsx",
    "phone-field/index": "src/components/form/PhoneField.tsx",
    "otp-field/index": "src/components/form/OtpField.tsx",
    "upload-field/index": "src/components/form/upload/index.ts",
    "button-field/index": "src/components/basic/ButtonField.tsx",
    "loading-spinner/index": "src/components/basic/LoadingSpinner.tsx",
    "error-api/index": "src/components/ui/ErrorApi.tsx",

    // Context & Providers
    "context/index": "src/context/index.ts",

    // Hooks
    "hooks/use-grid-filters/index": "src/hooks/useGridFilters.ts",
    "hooks/use-api-options/index": "src/hooks/useApiOptions.ts",
    "hooks/use-fetch/index": "src/hooks/useFetch.ts",
    "hooks/use-safe-control/index": "src/hooks/useSafeControl.ts",
    "hooks/index": "src/hooks/index.ts",

    // Utils
    "utils/generate-zod-schema/index": "src/utils/generateZodSchema.ts",
    "utils/get-initial-values/index": "src/utils/getInitialValues.ts",
    "utils/api/index": "src/utils/api.ts",
    "utils/main/index": "src/utils/main.utils.ts",
    "utils/index": "src/utils/index.ts",

    // Types
    "types/index": "src/types/index.ts",
  },
  format: ["cjs", "esm"],
  dts: true,
  clean: true,
  sourcemap: true,
  splitting: true,
  treeshake: true,
  external: [
    "react",
    "react-dom",
    "antd",
    "dayjs",
    "react-hook-form",
    "zod",
  ],
  async onSuccess() {
    const distDir = path.resolve(__dirname, "dist");
    prependUseClientToDir(distDir);
  },
};
