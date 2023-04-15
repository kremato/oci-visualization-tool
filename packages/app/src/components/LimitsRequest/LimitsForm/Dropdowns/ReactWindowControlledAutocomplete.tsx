import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete, { autocompleteClasses } from "@mui/material/Autocomplete";
import useMediaQuery from "@mui/material/useMediaQuery";
import ListSubheader from "@mui/material/ListSubheader";
import Popper from "@mui/material/Popper";
import { useTheme, styled } from "@mui/material/styles";
import { VariableSizeList, ListChildComponentProps } from "react-window";
import Typography from "@mui/material/Typography";
import { DropdownItem } from "../../../../types/types";
import { ListItemText, Checkbox } from "@mui/material";
import { capitalizeFirstLetter } from "../../../../utils/capitalizeFirstLetter";
import { useState } from "react";
import { createFilterOptions } from "@mui/material/Autocomplete";
import {
  Control,
  Controller,
  ControllerFieldState,
  ControllerRenderProps,
} from "react-hook-form";
import { LimitsFormEntries, LimitsFormValues } from "../../../../types/types";
import { useControlledAutocomplete } from "../../../../hooks/useControlledAutocomplete";
import { ListboxComponent } from "./ListboxComponent";

const StyledPopper = styled(Popper)({
  [`& .${autocompleteClasses.listbox}`]: {
    boxSizing: "border-box",
    "& ul": {
      padding: 0,
      margin: 0,
    },
  },
});

interface Props {
  field: ControllerRenderProps<LimitsFormValues, LimitsFormEntries>;
  name: LimitsFormEntries;
  options: DropdownItem[];
}

export const ReactWindowControlledAutocomplete = ({
  field,
  name,
  options,
}: Props) => {
  const { ...rest } = useControlledAutocomplete(
    name,
    options,
    field,
    "primaryLabel",
    "serviceName"
  );

  return (
    <Autocomplete
      {...field}
      {...rest}
      multiple
      renderOption={(props, option, { selected }) => (
        <li {...props} style={{ padding: 0, height: "100%" }}>
          <Checkbox size="small" checked={selected} />
          <ListItemText
            primary={option.primaryLabel}
            secondary={
              option.primaryLabel != option.secondaryLabel &&
              option.secondaryLabel
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
      )}
      renderGroup={(params) => params as unknown as React.ReactNode}
      renderInput={(params) => (
        <TextField
          {...params}
          label={capitalizeFirstLetter(name)}
          placeholder={`Choose ${name}`}
          helperText="This field is optional"
        />
      )}
    />
  );
};

/* import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete, { autocompleteClasses } from "@mui/material/Autocomplete";
import useMediaQuery from "@mui/material/useMediaQuery";
import ListSubheader from "@mui/material/ListSubheader";
import Popper from "@mui/material/Popper";
import { useTheme, styled } from "@mui/material/styles";
import { VariableSizeList, ListChildComponentProps } from "react-window";
import Typography from "@mui/material/Typography";
import { DropdownItem } from "../../../../types/types";
import { ListItemText, Checkbox } from "@mui/material";
import { capitalizeFirstLetter } from "../../../../utils/capitalizeFirstLetter";
import { useState } from "react";
import { createFilterOptions } from "@mui/material/Autocomplete";
import {
  Control,
  Controller,
  ControllerFieldState,
  ControllerRenderProps,
} from "react-hook-form";
import { LimitsFormEntries, LimitsFormValues } from "../../../../types/types";
import { useControlledAutocomplete } from "../../../../hooks/useControlledAutocomplete";
import { ListboxComponent } from "./ListboxComponent";

const StyledPopper = styled(Popper)({
  [`& .${autocompleteClasses.listbox}`]: {
    boxSizing: "border-box",
    "& ul": {
      padding: 0,
      margin: 0,
    },
  },
});

interface Props {
  field: ControllerRenderProps<LimitsFormValues, LimitsFormEntries>;
  name: LimitsFormEntries;
  options: DropdownItem[];
}

export const ReactWindowControlledAutocomplete = ({
  field,
  name,
  options,
}: Props) => {
  const { ...rest } = useControlledAutocomplete(
    name,
    options,
    field,
    "primaryLabel",
    "serviceName"
  );

  return (
    <Autocomplete
      {...field}
      multiple
      disableCloseOnSelect
      PopperComponent={StyledPopper}
      ListboxComponent={ListboxComponent}
      options={options}
      filterOptions={rest.filterOptions}
      isOptionEqualToValue={rest.isOptionEqualToValue}
      getOptionLabel={rest.getOptionLabel}
      groupBy={(option) => `${option.serviceName}`}
      onChange={rest.onChange}
      renderOption={(props, option, { selected }) => (
        <li {...props} style={{ padding: 0, height: "100%" }}>
          <Checkbox size="small" checked={selected} />
          <ListItemText
            primary={option.primaryLabel}
            secondary={
              option.primaryLabel != option.secondaryLabel &&
              option.secondaryLabel
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
      )}
      renderGroup={(params) => params as unknown as React.ReactNode}
      renderInput={(params) => (
        <TextField
          {...params}
          label={capitalizeFirstLetter(name)}
          placeholder={`Choose ${name}`}
          helperText="This field is optional"
        />
      )}
      fullWidth={true}
      value={rest.value}
      inputValue={rest.inputValue}
      onInputChange={rest.onInputChange}
    />
  );
};
 */
