import { Autocomplete } from "@mui/material";
import { ControllerRenderProps, FieldError } from "react-hook-form";
import {
  DropdownItem,
  LimitsFormEntries,
  LimitsFormValues,
} from "../../../../types/types";
import { useControlledAutocomplete } from "../../../../hooks/useControlledAutocomplete";

interface Props {
  field: ControllerRenderProps<LimitsFormValues, LimitsFormEntries>;
  fieldError: FieldError | undefined;
  options: DropdownItem[];
}

export const ControlledAutocomplete = ({
  field,
  fieldError,
  options,
}: Props) => {
  const rest = useControlledAutocomplete(
    options,
    field,
    fieldError,
    "primaryLabel",
    field.name === LimitsFormEntries.Limits ? "serviceName" : "secondaryLabel"
  );
  return <Autocomplete {...field} {...rest} multiple />;
};
