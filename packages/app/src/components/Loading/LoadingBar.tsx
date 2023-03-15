import LinearProgress, {
  LinearProgressProps,
} from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useAppSelector } from "../../hooks/useAppSelector";
import { useSocketMessage } from "../../hooks/useSocketMessage";
import { useSocketStatus } from "../../hooks/useSocketStatus";
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
  const showProgressBar = useAppSelector(
    (state) => state.input.showProgressBar
  );
  const progressStatus = useAppSelector((state) => state.input.progressStatus);

  useEffect(() => {
    console.log(`Setting progress value to 0!`);
    setProgressValue(0);
  }, [progressStatus]);

  useEffect(() => {
    setProgressValue(
      message
        ? Math.floor(
            (message.countLoadedLimits /
              message.countLimitDefinitionSummaries) *
              100
          )
        : 0
    );
  }, [message]);

  return (
    <>
      {progressStatus === "success" && <DownloadFinished success={true} />}
      {progressStatus === "failure" && <DownloadFinished success={false} />}
      {socketIsUp && progressStatus === "progressBar" && (
        <Box sx={{ width: "100%" }}>
          <LinearProgressWithLabel value={progressValue} />
        </Box>
      )}
    </>
  );
};

/* export const LoadingBar = () => {
  const message = useSocketMessage();
  const socketIsUp = useSocketStatus();
  const [progressValue, setProgressValue] = useState(0);
  const showProgressBar = useAppSelector(
    (state) => state.input.showProgressBar
  );

  useEffect(() => {
    setProgressValue(0);
  }, [showProgressBar]);

  useEffect(() => {
    setProgressValue(
      message
        ? Math.floor(
            (message.countLoadedLimits /
              message.countLimitDefinitionSummaries) *
              100
          )
        : 0
    );
  }, [message]);

  return (
    <>
      {socketIsUp && showProgressBar && (
        <Box sx={{ width: "100%" }}>
          <LinearProgressWithLabel value={progressValue} />
        </Box>
      )}
    </>
  );
}; */
