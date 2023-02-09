import LinearProgress, {
  LinearProgressProps,
} from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useAppSelector } from "../../hooks/useAppSelector";
import { useSocketMessage } from "../../hooks/useSocketMessage";
import { useSocketStatus } from "../../hooks/useSocketStatus";
import { useEffect, useState } from "react";

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
};
