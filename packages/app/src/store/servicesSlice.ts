import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ResponseTreeNode, ServiceSummary } from "common";

const servicesSlice = createSlice({
  name: "services",
  initialState: {
    servicesList: [] as ServiceSummary[],
    serviceNodes: [] as ResponseTreeNode[],
  },
  reducers: {
    replaceServices(state, action: PayloadAction<ServiceSummary[]>) {
      state.servicesList = action.payload;
    },
    replaceServiceNodes(state, action: PayloadAction<ResponseTreeNode[]>) {
      state.serviceNodes = action.payload;
    },
  },
});

export const servicesActions = servicesSlice.actions;
export default servicesSlice;
