import { useEffect } from "react";
import Chip from "@mui/material/Chip";
import { useAppSelector } from "../../hooks/useAppSelector";
import { fetchProfileStatus } from "../../utils/fetchProfileStatus";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { fetchToken } from "../../store/tokenActionCreators";
import { usePrevious } from "../../hooks/usePrevious";
import { statusActions } from "../../store/statusSlice";
import { reconnectingSocketApi } from "../../utils/reconnectingSocketApi";

const getApiStatusDelayMiliseconds = 2500;

export const ApiStatus = () => {
  const dispatch = useAppDispatch();
  const profile = useAppSelector((state) => state.profile.profile);
  const apiStatus = useAppSelector((state) => state.status.apiStatus);
  const previousApiStatus = usePrevious(apiStatus);

  // fetch token the moment the status is not down and previously was
  useEffect(() => {
    if (
      (previousApiStatus === undefined || previousApiStatus === "down") &&
      apiStatus !== "down"
    ) {
      dispatch(fetchToken());
    }
  }, [apiStatus]);

  const updateApiStatus = async () => {
    dispatch(statusActions.updateApiStatus(await fetchProfileStatus()));
  };

  // start profile pinging
  useEffect(() => {
    // update status before the first run of the timer
    updateApiStatus();
    const timer = setInterval(async () => {
      await updateApiStatus();
      if (apiStatus === "ready" && !reconnectingSocketApi.isOpen())
        reconnectingSocketApi.restart();
    }, getApiStatusDelayMiliseconds);
    return () => {
      clearInterval(timer);
    };
  }, []);

  // update api status for every profile change
  useEffect(() => {
    updateApiStatus();
  }, [profile]);

  let color: "success" | "warning" | "error" = "success";
  if (apiStatus === "loading") {
    color = "warning";
  }
  if (apiStatus === "down") color = "error";

  return (
    <Chip
      label={`${apiStatus === "down" ? "Backend" : "Profile"} is ${apiStatus}`}
      color={color}
    />
  );
};
