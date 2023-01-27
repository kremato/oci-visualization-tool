import LinearProgress, {
  LinearProgressProps,
} from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useAppSelector } from "../../hooks/useAppSelector";
import { useSocketMessage } from "../../hooks/useSocketMessage";

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
  //const progress = useAppSelector((state) => state.input.progressValue);
  const message = useSocketMessage();
  const showProgressBar = useAppSelector(
    (state) => state.input.showProgressBar
  );

  return (
    <>
      {showProgressBar && (
        <Box sx={{ width: "100%" }}>
          <div>aaaaa</div>
          <div>{`countLoadedLimits: ${message?.countLoadedLimits}`}</div>
          <div>{`countLimitDefinitionSummaries: ${message?.countLimitDefinitionSummaries}`}</div>
          <LinearProgressWithLabel
            value={
              message
                ? Math.floor(
                    (message.countLoadedLimits /
                      message.countLimitDefinitionSummaries) *
                      100
                  )
                : 0
            }
          />
        </Box>
      )}
    </>
  );
};
