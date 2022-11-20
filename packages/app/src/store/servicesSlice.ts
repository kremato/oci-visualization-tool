import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ResponseTree, ServiceSummary } from "common";

const servicesSlice = createSlice({
  name: "services",
  initialState: {
    servicesList: [] as ServiceSummary[],
    serviceNodes: [] as ResponseTree[],
  },
  reducers: {
    replaceServices(state, action: PayloadAction<ServiceSummary[]>) {
      state.servicesList = action.payload;
    },
    replaceServiceNodes(state, action: PayloadAction<ResponseTree[]>) {
      state.serviceNodes = action.payload;
    },
  },
});

export const servicesActions = servicesSlice.actions;
export default servicesSlice;
