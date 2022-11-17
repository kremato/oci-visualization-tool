import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { ListItemText, Typography } from "@mui/material";
import { capitalizeFirstLetter } from "../utils/capitalizeFirstLetter";
import { inputActions } from "../store/inputSlice";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { Checkbox } from "@mui/material";
import { Names } from "common";

interface DropdownItem {
  primaryLabel: string;
  secondaryLabel: string;
  serviceName?: string;
}

interface Props {
  name: Names;
  options: DropdownItem[];
}

export const Dropdown = ({ name, options }: Props) => {
  const dispatch = useAppDispatch();

  const handleChange = (selected: DropdownItem[]) => {
    let action = inputActions.replaceCompartmentsId;
    const inputList = selected.map((item) => {
      /* name === Names.Compartment ? item.secondaryLabel : item.primaryLabel */
      if (name === Names.Compartment) return item.secondaryLabel;
      return item.primaryLabel;
    });
    if (name === Names.Region) {
      action = inputActions.replaceRegionsId;
    }
    if (name === Names.Service) {
      action = inputActions.replaceServicesId;
    }
    if (name === Names.Scope) {
      action = inputActions.replaceScopes;
    }
    if (name === Names.Limit) {
      action = inputActions.replaceLimits;
    }
    dispatch(action(inputList));
  };

  const namePlural = name + "s";
  return (
    <Autocomplete
      multiple
      id={namePlural}
      isOptionEqualToValue={(option, value) =>
        option.primaryLabel === value.primaryLabel &&
        option.secondaryLabel === value.secondaryLabel
      }
      onChange={(_event, newValue) => {
        handleChange(newValue);
      }}
      options={options}
      disableCloseOnSelect
      getOptionLabel={(option) =>
        name === Names.Limit
          ? option.primaryLabel + option.serviceName
          : option.primaryLabel
      }
      renderOption={(props, option, { selected }) => (
        <li {...props} style={{ padding: 0 }}>
          <Checkbox size="small" checked={selected} />
          <ListItemText
            primary={
              name === Names.Limit
                ? `${option.primaryLabel} [${option.serviceName}]`
                : option.primaryLabel
            }
            secondary={
              option.primaryLabel != option.secondaryLabel &&
              option.secondaryLabel
            }
            sx={{ mt: 0, mb: 0 }}
            primaryTypographyProps={{
              sx: { wordBreak: "break-all", lineHeight: 1.25 },
            }}
            secondaryTypographyProps={{
              sx: { wordBreak: "break-all", lineHeight: 1.25 },
            }}
          />
        </li>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          label={capitalizeFirstLetter(name)}
          placeholder={`Choose ${namePlural}`}
        />
      )}
      sx={{ maxWidth: "100%" }}
    />
  );
};
