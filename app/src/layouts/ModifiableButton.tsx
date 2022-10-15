import { Button } from "@mui/material";

interface Props {
  text: string;
  action: () => void;
}

export const ModifiableButton = ({ text, action }: Props) => {
  return (
    <Button variant="contained" onClick={action}>
      {text}
    </Button>
  );
};
