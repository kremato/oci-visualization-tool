import { useEffect } from "react";
import Chip from "@mui/material/Chip";
import { useAppSelector } from "../../hooks/useAppSelector";
import { getApiStatus } from "../../utils/getApiStatus";
import { inputActions } from "../../store/inputSlice";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { fetchToken } from "../../store/tokenActionCreators";

const getApiStatusDelayMiliseconds = 2500;

export const ApiStatus = () => {
  const dispatch = useAppDispatch();
  const apiStatus = useAppSelector((state) => state.input.apiStatus);
  console.log(`API STATUS: ${apiStatus}`);
  useEffect(() => {
    console.log(`API STATUS INSIDE THE EFFECT: ${apiStatus}`);
    if (apiStatus === "loading") {
      console.log("fetching token");
      dispatch(fetchToken());
    }
  }, [apiStatus]);

  useEffect(() => {
    const updateApiStatus = async () => {
      dispatch(inputActions.updateApiStatus(await getApiStatus()));
    };
    // update status before the first run of the timer
    updateApiStatus();
    const timer = setInterval(() => {
      updateApiStatus();
    }, getApiStatusDelayMiliseconds);
    return () => {
      clearInterval(timer);
    };
  }, []);

  let color: "success" | "warning" | "error" = "success";
  if (apiStatus === "loading") color = "warning";
  if (apiStatus === "down") color = "error";

  return <Chip label={`Backend is ${apiStatus}`} color={color} />;
};
