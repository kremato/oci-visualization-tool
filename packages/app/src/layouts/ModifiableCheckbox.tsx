import { useState } from "react";
import { Checkbox, FormControlLabel } from "@mui/material";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { ActionCreatorWithPayload, ThunkDispatch } from "@reduxjs/toolkit";

interface Props {
  label: string;
  action: ActionCreatorWithPayload<boolean, string>;
  isChecked?: boolean;
}

export const ModifiableCheckbox = ({
  label,
  action,
  // TODO: this should be removed to contain logic only in redux state
  isChecked = false,
}: Props) => {
  const [checked, setChecked] = useState(isChecked);
  const dispatch = useAppDispatch();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
    /* let action = inputActions.updateSumADResources;
    if (label === "Show all") action = inputActions.upadateShowAll;
    if (label === "Show limits with no availability")
      action = inputActions.updateHideNoAvailability;
    if (label === "Show limits with no used")
      action = inputActions.updateHideNoUsed;
    if (label === "Show limits with no quota")
      action = inputActions.updateNoQuota;
    if (label === "Show limits per service")
      action = inputActions.updateShowByService;
    if (label === "Show limits per compartment")
      action = inputActions.updateShowByCompartment; */
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
