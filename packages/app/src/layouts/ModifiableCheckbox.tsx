import { useState } from "react";
import { Checkbox, FormControlLabel } from "@mui/material";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { servicesActions } from "../store/servicesSlice";

export const ModifiableCheckbox = () => {
  const [checked, setChecked] = useState(false);
  const dispatch = useAppDispatch();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
    dispatch(servicesActions.updateSumADResources(event.target.checked));
  };

  return (
    <FormControlLabel
      control={
        <Checkbox size="small" checked={checked} onChange={handleChange} />
      }
      label="Sum AD resources"
    />
  );

  // return <Checkbox size="small" checked={checked} onChange={handleChange} label="Label" />;
};
