import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { ListItemText, Typography } from "@mui/material";
import { capitalizeFirstLetter } from "../utils/capitalizeFirstLetter";
import { inputActions } from "../store/inputSlice";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { Checkbox } from "@mui/material";
import { Names } from "common";

type DropdownItem = { label: string; id: string };

interface Props {
  name: Names;
  options: DropdownItem[];
}

export const Dropdown = ({ name, options }: Props) => {
  const dispatch = useAppDispatch();

  const handleChange = (selected: DropdownItem[]) => {
    let action = inputActions.replaceCompartmentsId;
    if (name === Names.Region) {
      action = inputActions.replaceRegionsId;
    }
    if (name === Names.Service) {
      action = inputActions.replaceServicesId;
    }
    if (name === Names.Scope) {
      action = inputActions.replaceScopes;
    }
    dispatch(action(selected.map((item) => item.id)));
  };

  const namePlural = name + "s";
  return (
    <Autocomplete
      multiple
      id={namePlural}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      onChange={(_event, newValue) => {
        handleChange(newValue);
      }}
      options={options}
      disableCloseOnSelect
      getOptionLabel={(option) => option.label}
      renderOption={(props, option, { selected }) => (
        <li {...props} style={{ padding: 0 }}>
          <Checkbox size="small" checked={selected} />
          <ListItemText
            primary={option.label}
            secondary={option.id}
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
