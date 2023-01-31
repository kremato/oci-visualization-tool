import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ResponseTreeNode } from "common";

interface ServiceState {
  serviceNodes: ResponseTreeNode[];
}

const initialState: ServiceState = {
  serviceNodes: [],
};

const serviceSlice = createSlice({
  name: "services",
  initialState,
  reducers: {
    replaceServiceNodes(state, action: PayloadAction<ResponseTreeNode[]>) {
      state.serviceNodes = action.payload;
    },
  },
});

export const servicesActions = serviceSlice.actions;
export default serviceSlice;
