import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ServiceSummary } from "common";

const servicesSlice = createSlice({
  name: "services",
  initialState: {
    servicesList: [] as ServiceSummary[],
    sumADResources: false,
  },
  reducers: {
    replaceServices(state, action: PayloadAction<ServiceSummary[]>) {
      state.servicesList = action.payload;
    },
    updateSumADResources(state, action: PayloadAction<boolean>) {
      state.sumADResources = action.payload;
    },
  },
});

export const servicesActions = servicesSlice.actions;
export default servicesSlice;
