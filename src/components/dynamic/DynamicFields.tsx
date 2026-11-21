import { lazy, memo, useMemo, Suspense } from "react";
import { useWatch } from "react-hook-form";
import { Row, Col, Tooltip } from "antd";
import { BsQuestionCircle } from "react-icons/bs";
import { FieldConfig } from '../../types/formField.types';
import { isArray, isNotEmptyArray, isString } from '../../utils/main.utils';
import NotFundField from "../form/NotFundField";
import LoadingSpinner from "../basic/LoadingSpinner";
import SelectField from "../form/SelectField";
import TextField from "../form/TextField";
import DividerField from "../form/DividerField";
import PhoneField from "../form/PhoneField";
import InputField from "../form/InputField";
import PasswordField from "../form/PasswordField";
import NumberField from "../form/NumberField";
import TextAreaField from "../form/TextAreaField";
import CountryField from "../form/CountryField";
import RadioField from "../form/RadioField";
import CheckboxField from "../form/CheckboxField";
import SwitchField from "../form/SwitchField";
import DateField from "../form/DateField";
import TimePickerField from "../form/TimePickerField";
import RatingField from "../form/RatingField";
import SliderField from "../form/SliderField";
import ColorPickerField from "../form/ColorPickerField";
import CascaderField from "../form/CascaderField";
import DateRangeField from "../form/DateRangeField";
import TimeRangeField from "../form/TimeRangeField";
import HiddenField from "../form/HiddenField";

const UploadField = lazy(() => import("../form/upload"));
const DynamicChartField = lazy(() => import("../dynamic/DynamicChartField"));

export const fields: Record<string, any> = {
  select: SelectField,
  heading: TextField,
  paragraph: TextField,
  divider: DividerField,
  phone: PhoneField,
  text: InputField,
  email: InputField,
  url: InputField,
  input: InputField,
  password: PasswordField,
  number: NumberField,
  textarea: TextAreaField,
  country: CountryField,
  radio: RadioField,
  checkbox: CheckboxField,
  toggle: SwitchField,
  date: DateField,
  time: TimePickerField,
  datetime: DateField,
  file: UploadField,
  image: UploadField,
  rating: RatingField,
  slider: SliderField,
  color: ColorPickerField,
  cascader: CascaderField,
  daterange: DateRangeField,
  timerange: TimeRangeField,
  hidden: HiddenField,
  chart: DynamicChartField,
};
export interface DynamicFieldsProps {
  rows: FieldConfig[];
  methods: any;
  useWindowScroll?: boolean;
  style?: React.CSSProperties;
  namePrefix?: string;
}
const textTypes = new Set(['heading', 'paragraph', 'textField']);

const evaluateConditions = (
  conditions: any[] | undefined,
  watchedValues: any[],
) => {
  if (!isNotEmptyArray(conditions)) return true;
  if (conditions!.length !== watchedValues.length) return false;

  return conditions!.every((condition: any, index: number) => {
    const value = watchedValues[index];
    switch (condition.operator) {
      case "equals":
        return value === condition.value;
      case "not_equals":
        return value !== condition.value;
      case "contains":
        if (isArray(value)) return value.includes(condition.value);
        if (isString(value))
          return value.includes(String(condition.value));
        return false;
      case "gt":
        return Number(value) > Number(condition.value);
      case "lt":
        return Number(value) < Number(condition.value);
      default:
        return true;
    }
  });
};


const DynamicFields: React.FC<DynamicFieldsProps> = ({ rows, methods, style, namePrefix = "customTags" }) => {
  if (!isNotEmptyArray(rows)) return null;

  return (
    <Suspense fallback={<div className="flex justify-center py-6"><LoadingSpinner /></div>}>
      <Row gutter={[24, 0]} style={style}>
        {rows.map((field: FieldConfig) => (
          <SingleField key={field.id} config={field} control={methods?.control} namePrefix={namePrefix} />
        ))}
      </Row>
    </Suspense>
  );
};

export default memo(DynamicFields);

const SingleField = memo(function SingleField({
  config,
  control,
  namePrefix = "customTags",
}: {
  config: FieldConfig;
  control: any;
  namePrefix?: string;
}) {
  const dependentFields = useMemo(
    () =>
      isNotEmptyArray(config?.conditions)
        ? config?.conditions?.map((c) => c.field)
        : [],
    [config?.conditions],
  );

  const watchedValues = useWatch({
    control,
    name: dependentFields as any,
    disabled: dependentFields?.length === 0,
  });

  const isVisible = useMemo(
    () =>
      evaluateConditions(
        config?.conditions,
        isArray(watchedValues) ? watchedValues : [],
      ),
    [config?.conditions, watchedValues],
  );

  if (!isVisible) return null;

  const Field = fields[config?.type] || NotFundField;
  const label = config?.label;
  const prefix = namePrefix ? `${namePrefix}.` : "";
  const formFieldName = `${prefix}${config?.id}`;
  return (
    <Col span={config?.span || 24} offset={config?.offset || 0} className="mb-4">
      {
        !textTypes.has(config?.type) && label && (
          <label htmlFor={config?.id} className="text-[13px] mb-[3px] flex items-center gap-1 text-text-primary font-medium cursor-pointer">
            <span>{label}</span>
            {config?.tooltip && (
              <Tooltip
                title={config.tooltip}
                placement="top"
                color="#374151"
                overlayInnerStyle={{ fontSize: '12px', padding: '6px 10px', borderRadius: '6px' }}
              >
                <span className="flex items-center justify-center pt-[1px]">
                  <BsQuestionCircle className="text-[11.5px] text-text-secondary cursor-help hover:text-blue-500 transition-colors" />
                </span>
              </Tooltip>
            )}
          </label>
        )
      }
      <Field {...config} name={formFieldName} control={control} />
    </Col>
  );
});
