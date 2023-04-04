import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

interface Props {
  success: boolean;
}

export const DownloadFinished = ({ success }: Props) => {
  const icon = success ? (
    <DoneAllIcon color="success" />
  ) : (
    <ErrorOutlineIcon color="error" />
  );
  return (
    <Stack direction={"row"} spacing={1} justifyContent={"end"} width={"100%"}>
      <Typography color={success ? "green" : "red"}>
        Download {`${success ? "successful" : "failed"}`}
      </Typography>
      {icon}
    </Stack>
  );
};
