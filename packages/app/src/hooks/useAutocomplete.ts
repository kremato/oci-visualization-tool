import { useState } from "react";
import { ControllerRenderProps } from "react-hook-form";
import { DropdownItem, LimitsFormValues } from "../types/types";
import { filterOptionsBuilder } from "../utils/filterOptionsBuilder";

export const useAutocomplete = (
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
    const inputList = selected.map((item: DropdownItem) => {
      return { limitName: item.primaryLabel, serviceName: item.serviceName! };
    });
    setValue(selected);
    field.onChange(inputList);
  };

  const onInputChange = (_event: any, newInputValue: string) =>
    setInputValue(newInputValue);

  return {
    value,
    inputValue,
    filterOptions: optionsFilter,
    handleChange,
    onInputChange,
  };
};
