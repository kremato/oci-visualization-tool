import { useEffect, useState } from "react";
import { ControllerRenderProps } from "react-hook-form";
import {
  DropdownItem,
  LimitsFormEntries,
  LimitsFormValues,
} from "../types/types";
import { filterOptionsBuilder } from "../utils/filterOptionsBuilder";
import { usePrevious } from "./usePrevious";
import { useAppSelector } from "./useAppSelector";
import { autocompleteClasses, styled, Popper } from "@mui/material";
import { ListboxComponent } from "../components/LimitsRequest/LimitsForm/Dropdowns/ListboxComponent";

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
  name: string,
  options: DropdownItem[],
  field: ControllerRenderProps<LimitsFormValues, LimitsFormEntries>,
  ...filterOptions: (keyof DropdownItem)[]
) => {
  const [value, setValue] = useState<DropdownItem[]>([]);
  const [inputValue, setInputValue] = useState("");
  const currentProfile = useAppSelector((state) => state.profile.profile);

  useEffect(() => {
    setValue([]);
  }, [currentProfile]);

  if (name === LimitsFormEntries.Limits) {
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
      if (name === LimitsFormEntries.Compartments) return item.secondaryLabel;
      if (name === LimitsFormEntries.Limits)
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

  //TODO: option.primaryLabel
  /* const getOptionLabel = (option: DropdownItem) => {
    return name === LimitsFormEntries.Limits
      ? option.primaryLabel + option.serviceName
      : option.primaryLabel;
  }; */
  const getOptionLabel = (option: DropdownItem) => {
    return option.primaryLabel;
  };

  const isOptionEqualToValue = (option: DropdownItem, value: DropdownItem) =>
    option.primaryLabel === value.primaryLabel &&
    option.secondaryLabel === value.secondaryLabel &&
    option.serviceName === option.serviceName;

  return {
    disableCloseOnSelect: true,
    PopperComponent:
      name === LimitsFormEntries.Limits ? StyledPopper : undefined,
    ListboxComponent:
      name === LimitsFormEntries.Limits ? ListboxComponent : undefined,
    options,
    fullWidth: true,
    value,
    inputValue,
    groupBy: LimitsFormEntries.Limits
      ? (option: DropdownItem) => `${option.serviceName}`
      : undefined,
    filterOptions: optionsFilter,
    isOptionEqualToValue,
    getOptionLabel,
    onChange,
    onInputChange,
  };
};
