import { Button } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { fetchLimitsData } from "../store/inputActionCreators";
import { inputActions } from "../store/inputSlice";

interface Props {
  text: string;
}

export const SendButton = ({ text }: Props) => {
  const dispatch = useAppDispatch();

  return (
    <Button
      variant="contained"
      onClick={() => {
        dispatch(fetchLimitsData());
        dispatch(inputActions.updateShowProgressBar(true));
      }}
      endIcon={<SendIcon />}
    >
      {text}
    </Button>
  );
};
