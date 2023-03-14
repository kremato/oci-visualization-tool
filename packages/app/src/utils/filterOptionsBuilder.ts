import { createFilterOptions } from "@mui/material/Autocomplete";
import { DropdownItem } from "../types/types";

export const filterOptionsBuilder = (...options: (keyof DropdownItem)[]) => {
  return createFilterOptions({
    stringify: (option: DropdownItem) => {
      return options.reduce(
        (accumulator: string, currentValue) =>
          accumulator + ` ${option[currentValue]}`,
        ""
      );
    },
  });
};
