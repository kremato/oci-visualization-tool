import {
  ListItemText,
  Checkbox,
  TextField,
  Autocomplete,
  createFilterOptions,
} from "@mui/material";
import { capitalizeFirstLetter } from "../utils/capitalizeFirstLetter";
import { DropdownItem } from "../types/types";
import { useState } from "react";
import { Control, Controller, ControllerRenderProps } from "react-hook-form";
import { LimitsFormEntries, LimitsFormValues } from "../types/types";
import { filterOptionsBuilder } from "../utils/filterOptionsBuilder";
import { useAutocomplete } from "../hooks/useAutocomplete";

interface Props {
  name: LimitsFormEntries;
  options: DropdownItem[];
  control: Control<LimitsFormValues, any>;
}

export const Dropdown = ({ name, options, control }: Props) => {
  /* const { filterOptions: as, ...rest } = useAutocomplete(
    options,
    "primaryLabel",
    "secondaryLabel"
  ); */
  const [value, setValue] = useState<DropdownItem[]>([]);
  const [inputValue, setInputValue] = useState("");

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

  const filterOptions = filterOptionsBuilder("primaryLabel", "secondaryLabel");

  return (
    <Controller
      control={control}
      name={name}
      rules={{
        required: `Please enter ${name}`,
      }}
      render={({ field, fieldState }) => (
        <Autocomplete
          {...field}
          multiple
          disableCloseOnSelect
          options={options}
          filterOptions={filterOptions}
          isOptionEqualToValue={(option, value) =>
            option.primaryLabel === value.primaryLabel &&
            option.secondaryLabel === value.secondaryLabel
          }
          onChange={(_event, newValue) => {
            handleChange(newValue, field);
          }}
          getOptionLabel={(option) =>
            name === LimitsFormEntries.Limits
              ? option.primaryLabel + option.serviceName
              : option.primaryLabel
          }
          renderOption={(props, option, { selected }) => (
            <li {...props} style={{ padding: 0 }}>
              <Checkbox size="small" checked={selected} />
              <ListItemText
                primary={
                  name === LimitsFormEntries.Limits
                    ? `${option.primaryLabel} [${option.serviceName}]`
                    : option.primaryLabel
                }
                secondary={
                  option.primaryLabel != option.secondaryLabel &&
                  option.secondaryLabel
                }
                sx={{ mt: 0, mb: 0 }}
                primaryTypographyProps={{
                  sx: { wordBreak: "break-word", lineHeight: 1.25 },
                }}
                secondaryTypographyProps={{
                  sx: { wordBreak: "break-word", lineHeight: 1.25 },
                }}
              />
            </li>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              label={capitalizeFirstLetter(name)}
              placeholder={`Choose ${name}`}
              error={fieldState.error !== undefined}
              helperText={fieldState.error?.message}
            />
          )}
          fullWidth={true}
          value={value}
          inputValue={inputValue}
          onInputChange={(_event, newInputValue) =>
            setInputValue(newInputValue)
          }
        />
      )}
    />
  );
};
