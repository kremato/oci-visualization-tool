import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { ModifiableCheckbox } from "../layouts/ModifiableCheckboxExperiment";
import { ListItemText, Typography } from "@mui/material";
import { capitalizeFirstLetter } from "../utils/capitalizeFirstLetter";

interface Props {
  name: string;
  options: { label: string; id: string }[];
}

export const Dropdown = ({ name, options }: Props) => {
  const namePlural = name + "s";
  return (
    <Autocomplete
      multiple
      id={namePlural}
      options={options}
      disableCloseOnSelect
      getOptionLabel={(option) => option.label}
      renderOption={(props, option, { selected }) => (
        <li {...props} style={{ padding: 0 }}>
          <ModifiableCheckbox id={option.id} type={name} checked={selected} />
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
