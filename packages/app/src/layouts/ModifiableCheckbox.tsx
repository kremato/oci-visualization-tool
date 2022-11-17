import { useState } from "react";
import { Checkbox, FormControlLabel } from "@mui/material";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { inputActions } from "../store/inputSlice";

interface Props {
  label: string;
}

export const ModifiableCheckbox = ({ label }: Props) => {
  const [checked, setChecked] = useState(false);
  const dispatch = useAppDispatch();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
    let action = inputActions.updateSumADResources;
    if (label === "Show all") action = inputActions.upadateShowAll;
    if (label === "Show empty service limits")
      action = inputActions.updateEmptyServiceLimits;
    dispatch(action(event.target.checked));
  };

  return (
    <FormControlLabel
      control={
        <Checkbox size="small" checked={checked} onChange={handleChange} />
      }
      label={label}
    />
  );

  // return <Checkbox size="small" checked={checked} onChange={handleChange} label="Label" />;
};
