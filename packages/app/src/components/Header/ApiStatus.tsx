import { useEffect } from "react";
import Chip from "@mui/material/Chip";
import { useAppSelector } from "../../hooks/useAppSelector";
import { getApiStatus } from "../../utils/getApiStatus";
import { inputActions } from "../../store/inputSlice";
import { useAppDispatch } from "../../hooks/useAppDispatch";

const GET_API_STATUS_DELAY_MILISECONDS = 2500;

export const ApiStatus = () => {
  const dispatch = useAppDispatch();
  const apiStatus = useAppSelector((state) => state.input.apiStatus);

  useEffect(() => {
    const updateApiStatus = async () => {
      dispatch(inputActions.updateApiStatus(await getApiStatus()));
    };
    // update status before the first run of the timer
    updateApiStatus();
    const timer = setInterval(() => {
      updateApiStatus();
    }, GET_API_STATUS_DELAY_MILISECONDS);
    return () => {
      clearInterval(timer);
    };
  }, []);

  let color: "success" | "warning" | "error" = "success";
  if (apiStatus === "loading") color = "warning";
  if (apiStatus === "down") color = "error";

  return <Chip label={`Server is ${apiStatus}`} color={color} />;
};
