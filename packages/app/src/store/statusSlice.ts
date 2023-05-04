import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ApiStatus } from "../types/types";

type ProgressStatus =
  | "showProgressBar"
  | "hideProgressBar"
  | "success"
  | "failure";

interface StatusState {
  progressStatus: ProgressStatus;
  apiStatus: ApiStatus;
}

const initialState: StatusState = {
  progressStatus: "hideProgressBar",
  apiStatus: "down",
};

const statusSlice = createSlice({
  name: "status",
  initialState,
  reducers: {
    updateProgressStatus(state, action: PayloadAction<ProgressStatus>) {
      state.progressStatus = action.payload;
    },
    updateApiStatus(state, action: PayloadAction<ApiStatus>) {
      state.apiStatus = action.payload;
    },
  },
});

export const statusActions = statusSlice.actions;
export default statusSlice;
