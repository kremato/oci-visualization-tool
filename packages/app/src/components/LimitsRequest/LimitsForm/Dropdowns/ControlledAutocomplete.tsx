import { ListItemText, Checkbox, TextField, Autocomplete } from "@mui/material";
import { ControllerFieldState, ControllerRenderProps } from "react-hook-form";
import {
  DropdownItem,
  LimitsFormEntries,
  LimitsFormValues,
} from "../../../../types/types";
import { useControlledAutocomplete } from "../../../../hooks/useControlledAutocomplete";
import { capitalizeFirstLetter } from "../../../../utils/capitalizeFirstLetter";
import { useEffect } from "react";
import { useAppSelector } from "../../../../hooks/useAppSelector";

interface Props {
  field: ControllerRenderProps<LimitsFormValues, LimitsFormEntries>;
  fieldState: ControllerFieldState;
  name: LimitsFormEntries;
  options: DropdownItem[];
}

export const ControlledAutocomplete = ({
  field,
  fieldState,
  name,
  options,
}: Props) => {
  const rest = useControlledAutocomplete(
    name,
    options,
    field,
    "primaryLabel",
    "secondaryLabel"
  );

  return (
    <Autocomplete
      {...field}
      {...rest}
      multiple
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
          required
        />
      )}
    />
  );
};
