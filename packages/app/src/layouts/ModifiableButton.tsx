import { Button } from "@mui/material";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { inputActions } from "../store/inputSlice";

interface Props {
  text: string;
  action: () => void;
}

export const ModifiableButton = ({ text, action }: Props) => {
  const dispatch = useAppDispatch();

  return (
    <Button
      variant="contained"
      onClick={() => {
        action(), dispatch(inputActions.updateShowProgressBar(true));
      }}
    >
      {text}
    </Button>
  );
};
