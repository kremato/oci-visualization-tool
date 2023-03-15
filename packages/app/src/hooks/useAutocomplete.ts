import { useState } from "react";
import { ControllerRenderProps } from "react-hook-form";
import {
  DropdownItem,
  LimitsFormEntries,
  LimitsFormValues,
} from "../types/types";
import { filterOptionsBuilder } from "../utils/filterOptionsBuilder";

export const useAutocomplete = (
  name: string,
  options: DropdownItem[],
  ...filterOptions: (keyof DropdownItem)[]
) => {
  const [value, setValue] = useState<DropdownItem[]>([]);
  const [inputValue, setInputValue] = useState("");

  const optionsFilter = filterOptionsBuilder(...filterOptions);

  const handleChange = (
    selected: DropdownItem[],
    field: ControllerRenderProps<LimitsFormValues, any>
  ) => {
    const inputList = selected.map((item) => {
      if (name === LimitsFormEntries.Compartments) return item.secondaryLabel;
      return item.primaryLabel;
    });
    setValue(selected);
    field.onChange(inputList);
  };

  const onInputChange = (_event: any, newInputValue: string) =>
    setInputValue(newInputValue);

  return {
    value,
    inputValue,
    setInputValue,
    //filterOptions: optionsFilter,
    handleChange,
    onInputChange,
  };
};
