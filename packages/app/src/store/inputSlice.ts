import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ApiStatus } from "../types/types";

type ProgressStatus = "progressBar" | "success" | "failure" | undefined;

const inputSlice = createSlice({
  name: "input",
  initialState: {
    showProgressBar: false,
    progressStatus: undefined as ProgressStatus,
    apiStatus: "loading" as ApiStatus,
    sumADResources: false,
    expandAll: false,
    hideNoAvailability: true,
    hideNoUsed: true,
    hideNoQuota: true,
    hideNoServiceLimits: true,
    showByCompartment: true,
    showByService: false,
    showDeprecated: false,
  },
  reducers: {
    updateShowProgressBar(state, action: PayloadAction<boolean>) {
      state.showProgressBar = action.payload;
    },
    updateProgressStatus(state, action: PayloadAction<ProgressStatus>) {
      state.progressStatus = action.payload;
    },
    updateApiStatus(state, action: PayloadAction<ApiStatus>) {
      state.apiStatus = action.payload;
    },
    updateSumADResources(state, action: PayloadAction<boolean>) {
      state.sumADResources = action.payload;
    },
    updateExpandAll(state, action: PayloadAction<boolean>) {
      state.expandAll = action.payload;
    },
    updateHideNoAvailability(state, action: PayloadAction<boolean>) {
      state.hideNoAvailability = action.payload;
    },
    updateHideNoUsed(state, action: PayloadAction<boolean>) {
      state.hideNoUsed = action.payload;
    },
    updateHideNoQuota(state, action: PayloadAction<boolean>) {
      state.hideNoQuota = action.payload;
    },
    updateHideNoServiceLimits(state, action: PayloadAction<boolean>) {
      state.hideNoServiceLimits = action.payload;
    },
    updateShowByCompartment(state, action: PayloadAction<boolean>) {
      state.showByCompartment = action.payload;
    },
    updateShowByService(state, action: PayloadAction<boolean>) {
      state.showByService = action.payload;
    },
    updateShowDeprecated(state, action: PayloadAction<boolean>) {
      state.showDeprecated = action.payload;
    },
  },
});

export const inputActions = inputSlice.actions;
export default inputSlice;
