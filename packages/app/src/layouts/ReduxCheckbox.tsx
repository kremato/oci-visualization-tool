import { Checkbox, FormControlLabel } from "@mui/material";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { ActionCreatorWithPayload } from "@reduxjs/toolkit";
import { useAppSelector } from "../hooks/useAppSelector";
import { RootState } from "../store/store";

interface Props {
  label: string;
  action: ActionCreatorWithPayload<boolean, string>;
  stateCallback: (state: RootState) => boolean;
}

export const ReduxCheckbox = ({ label, action, stateCallback }: Props) => {
  const checked = useAppSelector(stateCallback);
  const dispatch = useAppDispatch();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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
};
