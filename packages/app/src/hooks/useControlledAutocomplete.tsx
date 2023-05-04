import { useEffect, useState } from "react";
import { ControllerRenderProps, FieldError } from "react-hook-form";
import {
  DropdownItem,
  LimitsFormEntries,
  LimitsFormValues,
} from "../types/types";
import { filterOptionsBuilder } from "../utils/filterOptionsBuilder";
import { useAppSelector } from "./useAppSelector";
import {
  autocompleteClasses,
  styled,
  Popper,
  AutocompleteRenderOptionState,
  AutocompleteRenderGroupParams,
  AutocompleteRenderInputParams,
  Checkbox,
  ListItemText,
  TextField,
} from "@mui/material";
import { ListboxComponent } from "../components/LimitsRequest/LimitsForm/Dropdowns/ListboxComponent";
import { capitalizeFirstLetter } from "../utils/capitalizeFirstLetter";

const StyledPopper = styled(Popper)({
  [`& .${autocompleteClasses.listbox}`]: {
    boxSizing: "border-box",
    "& ul": {
      padding: 0,
      margin: 0,
    },
  },
});

export const useControlledAutocomplete = (
  options: DropdownItem[],
  field: ControllerRenderProps<LimitsFormValues, LimitsFormEntries>,
  fieldError: FieldError | undefined,
  ...filterOptions: (keyof DropdownItem)[]
) => {
  const [value, setValue] = useState<DropdownItem[]>([]);
  const [inputValue, setInputValue] = useState("");
  const currentProfile = useAppSelector((state) => state.profile.profile);

  useEffect(() => {
    setValue([]);
  }, [currentProfile]);

  if (field.name === LimitsFormEntries.Limits) {
    options.sort(function (a, b) {
      return `${a.serviceName}`.localeCompare(`${b.serviceName}`);
    });
  }

  const optionsFilter = filterOptionsBuilder(...filterOptions);

  const handleChange = (
    selected: DropdownItem[],
    field: ControllerRenderProps<LimitsFormValues, any>
  ) => {
    const inputList = selected.map((item) => {
      if (field.name === LimitsFormEntries.Compartments)
        return item.secondaryLabel;
      if (field.name === LimitsFormEntries.Limits)
        return { limitName: item.primaryLabel, serviceName: item.serviceName! };
      return item.primaryLabel;
    });
    setValue(selected);
    field.onChange(inputList);
  };

  const onInputChange = (_event: any, newInputValue: string) =>
    setInputValue(newInputValue);

  const onChange = (
    _event: React.SyntheticEvent<Element, Event>,
    newValue: DropdownItem[]
  ) => {
    handleChange(newValue, field);
  };

  const getOptionLabel = (option: DropdownItem) => {
    return option.primaryLabel;
  };

  const isOptionEqualToValue = (option: DropdownItem, value: DropdownItem) =>
    option.primaryLabel === value.primaryLabel &&
    option.secondaryLabel === value.secondaryLabel &&
    option.serviceName === option.serviceName;

  const renderOption = (
    props: React.HTMLAttributes<HTMLLIElement>,
    option: DropdownItem,
    state: AutocompleteRenderOptionState
  ) => (
    <li {...props} style={{ padding: 0, height: "100%" }}>
      <Checkbox size="small" checked={state.selected} />
      <ListItemText
        primary={option.primaryLabel}
        secondary={
          option.primaryLabel != option.secondaryLabel && option.secondaryLabel
        }
        sx={{ mt: 0, mb: 0 }}
        primaryTypographyProps={{
          sx: {
            wordBreak: "break-word",
            lineHeight: 1.25,
            whiteSpace: "initial",
          },
        }}
        secondaryTypographyProps={{
          sx: {
            wordBreak: "break-word",
            lineHeight: 1.25,
            whiteSpace: "initial",
          },
        }}
      />
    </li>
  );

  const renderInput = (params: AutocompleteRenderInputParams) => (
    <TextField
      {...params}
      label={capitalizeFirstLetter(field.name)}
      placeholder={`Choose ${field.name}`}
      error={fieldError !== undefined}
      helperText={
        field.name === LimitsFormEntries.Limits
          ? "This field is optional"
          : fieldError?.message
      }
      required={field.name !== LimitsFormEntries.Limits}
    />
  );

  return {
    disableCloseOnSelect: true,
    PopperComponent:
      field.name === LimitsFormEntries.Limits ? StyledPopper : undefined,

    ListboxComponent:
      field.name === LimitsFormEntries.Limits ? ListboxComponent : undefined,
    options,
    fullWidth: true,
    value,
    inputValue,
    ...(field.name === LimitsFormEntries.Limits && {
      groupBy: (option: DropdownItem) => `${option.serviceName}`,
      renderGroup: (params: AutocompleteRenderGroupParams) =>
        params as unknown as React.ReactNode,
    }),
    filterOptions: optionsFilter,
    isOptionEqualToValue,
    getOptionLabel,
    onChange,
    onInputChange,
    renderOption,
    renderInput,
  };
};
