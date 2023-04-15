import { DropdownItem } from "../../../../types/types";
import { Control, Controller, ControllerRenderProps } from "react-hook-form";
import { LimitsFormEntries, LimitsFormValues } from "../../../../types/types";
import { ControlledAutocomplete } from "./ControlledAutocomplete";

interface Props {
  name: LimitsFormEntries;
  options: DropdownItem[];
  control: Control<LimitsFormValues, any>;
}

export const Dropdown = ({ name, options, control }: Props) => {
  return (
    <Controller
      control={control}
      name={name}
      rules={{
        required:
          name === LimitsFormEntries.Limits ? false : `Please enter ${name}`,
      }}
      render={({ field, fieldState }) => (
        <ControlledAutocomplete
          field={field}
          fieldError={fieldState.error}
          options={options}
        />
      )}
    />
  );
};
