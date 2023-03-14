import { Button } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

interface Props {
  text: string;
}

export const SendButton = ({ text }: Props) => {
  return (
    <Button variant="contained" endIcon={<SendIcon />} type="submit">
      {text}
    </Button>
  );
};
