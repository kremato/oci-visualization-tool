import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ServiceSummary } from "common";

const servicesSlice = createSlice({
  name: "services",
  initialState: {
    servicesList: [] as ServiceSummary[],
  },
  reducers: {
    replaceServices(state, action: PayloadAction<ServiceSummary[]>) {
      state.servicesList = action.payload;
    },
  },
});

export const servicesActions = servicesSlice.actions;
export default servicesSlice;
