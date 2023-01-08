import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ResponseTreeNode, MyServiceSummary } from "common";

const servicesSlice = createSlice({
  name: "services",
  initialState: {
    servicesList: [] as MyServiceSummary[],
    serviceNodes: [] as ResponseTreeNode[],
  },
  reducers: {
    replaceServices(state, action: PayloadAction<MyServiceSummary[]>) {
      state.servicesList = action.payload;
    },
    replaceServiceNodes(state, action: PayloadAction<ResponseTreeNode[]>) {
      state.serviceNodes = action.payload;
    },
  },
});

export const servicesActions = servicesSlice.actions;
export default servicesSlice;
