import LinearProgress, {
  LinearProgressProps,
} from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useAppSelector } from "../../../hooks/useAppSelector";
import { useSocketMessage } from "../../../hooks/useSocketMessage";
import { useSocketStatus } from "../../../hooks/useSocketStatus";
import { useEffect, useState } from "react";
import { DownloadFinished } from "./DownloadFinished";

const LinearProgressWithLabel = (
  props: LinearProgressProps & { value: number }
) => (
  <Box sx={{ display: "flex", alignItems: "center" }}>
    <Box sx={{ width: "100%", mr: 1 }}>
      <LinearProgress variant="determinate" {...props} />
    </Box>
    <Box sx={{ minWidth: 35 }}>
      <Typography variant="body2" color="text.secondary">{`${Math.round(
        props.value
      )}%`}</Typography>
    </Box>
  </Box>
);

export const LoadingBar = () => {
  const message = useSocketMessage();
  const socketIsUp = useSocketStatus();
  const [progressValue, setProgressValue] = useState(0);
  const progressStatus = useAppSelector((state) => state.status.progressStatus);

  useEffect(() => {
    console.log(`Setting progress value to 0!`);
    setProgressValue(0);
  }, [progressStatus]);

  useEffect(() => {
    if (progressStatus === "showProgressBar") {
      setProgressValue(
        message && message.countLimitDefinitionSummaries !== 0
          ? Math.floor(
              (message.countLoadedLimits /
                message.countLimitDefinitionSummaries) *
                100
            )
          : 0
      );
    }
  }, [message]);

  useEffect(() => {
    if (progressStatus === "hideProgressBar") setProgressValue(0);
  }, [progressValue]);

  return (
    <>
      {progressStatus === "success" && <DownloadFinished success={true} />}
      {progressStatus === "failure" && <DownloadFinished success={false} />}
      {socketIsUp && progressStatus === "showProgressBar" && (
        <Box sx={{ width: "100%" }}>
          <LinearProgressWithLabel value={progressValue} />
        </Box>
      )}
    </>
  );
};
