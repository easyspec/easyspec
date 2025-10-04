import {
  TextFields as TextIcon,
  Numbers as NumberIcon,
  ToggleOn as BooleanIcon,
  AccountTree as ObjectIcon,
  List as ArrayIcon,
  ArrowDropDown as EnumIcon,
  CheckBox as MultiselectIcon,
} from "@mui/icons-material";
import type { FieldTypeConfig } from "../types";
import { colors } from "../styles/tokens";

export const FIELD_TYPE_CONFIG: Record<string, FieldTypeConfig> = {
  text: {
    icon: TextIcon,
    color: colors.fieldTypes.text,
    label: "Text",
  },
  number: {
    icon: NumberIcon,
    color: colors.fieldTypes.number,
    label: "Number",
  },
  boolean: {
    icon: BooleanIcon,
    color: colors.fieldTypes.boolean,
    label: "Boolean",
  },
  object: {
    icon: ObjectIcon,
    color: colors.fieldTypes.object,
    label: "Object",
  },
  array: {
    icon: ArrayIcon,
    color: colors.fieldTypes.array,
    label: "Array",
  },
  enum: {
    icon: EnumIcon,
    color: colors.accent.mint,
    label: "Dropdown",
  },
  multiselect: {
    icon: MultiselectIcon,
    color: colors.accent.gold,
    label: "Multi-Select",
  },
};

// Start with empty fields for new forms
// Users can build their own form structure
export const DEFAULT_FORM_FIELDS = [];
