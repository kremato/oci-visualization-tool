import { useState } from "react";
import { Checkbox } from "@mui/material";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { inputActions } from "../store/inputSlice";

interface Props {
  id: string;
  type: string;
}

export const ModifiableCheckbox = (props: Props) => {
  const [checked, setChecked] = useState(false);
  const dispatch = useAppDispatch();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
    /* dispatch(
      inputActions.updateCheckboxHash({
        idList: [props.id],
        type: props.type,
      })
    ); */
  };

  return <Checkbox size="small" checked={checked} onChange={handleChange} />;
};
