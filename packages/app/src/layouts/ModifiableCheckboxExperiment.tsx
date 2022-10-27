import { Checkbox } from "@mui/material";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { checkboxActions } from "../store/checkboxSlice";

interface Props {
  id: string;
  type: string;
  checked: boolean;
}

export const ModifiableCheckbox = ({ id, type, checked }: Props) => {
  const dispatch = useAppDispatch();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(checkboxActions.updateCheckboxHash({ id, type }));
  };

  return <Checkbox size="small" checked={checked} onChange={handleChange} />;
};
