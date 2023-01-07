import LinearProgress, {
  LinearProgressProps,
} from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useAppSelector } from "../../hooks/useAppSelector";

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
  const progress = useAppSelector((state) => state.input.progressValue);
  const showProgressBar = useAppSelector(
    (state) => state.input.showProgressBar
  );

  return (
    <>
      {showProgressBar && (
        <Box sx={{ width: "100%" }}>
          <LinearProgressWithLabel value={progress} />
        </Box>
      )}
    </>
  );
};
