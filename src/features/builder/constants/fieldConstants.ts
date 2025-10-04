import {
  TextFields as TextIcon,
  Numbers as NumberIcon,
  ToggleOn as BooleanIcon,
  AccountTree as ObjectIcon,
  List as ArrayIcon,
  ArrowDropDown as EnumIcon,
  CheckBox as MultiselectIcon,
  InsertDriveFile as FileIcon,
} from "@mui/icons-material";
import { colors } from "../../../styles/tokens";

export const FIELD_ICONS = {
  text: TextIcon,
  string: TextIcon,
  number: NumberIcon,
  boolean: BooleanIcon,
  object: ObjectIcon,
  array: ArrayIcon,
  enum: EnumIcon,
  multiselect: MultiselectIcon,
} as const;

export const FIELD_COLORS = {
  text: colors.fieldTypes.text,
  string: colors.fieldTypes.text,
  number: colors.fieldTypes.number,
  boolean: colors.fieldTypes.boolean,
  object: colors.fieldTypes.object,
  array: colors.fieldTypes.array,
  enum: colors.accent.mint,
  multiselect: colors.accent.gold,
} as const;

export const getFieldIcon = (type: string) => {
  const Icon = FIELD_ICONS[type as keyof typeof FIELD_ICONS];
  return Icon || FileIcon;
};

export const getFieldColor = (type: string) => {
  return FIELD_COLORS[type as keyof typeof FIELD_COLORS] || colors.accent.teal;
};
