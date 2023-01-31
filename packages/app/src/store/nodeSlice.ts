import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ResponseTreeNode } from "common";

interface NodeState {
  serviceNodes: ResponseTreeNode[];
  compartmentNodes: ResponseTreeNode[];
}

const initialState: NodeState = {
  serviceNodes: [],
  compartmentNodes: [],
};

const nodeSlice = createSlice({
  name: "nodes",
  initialState,
  reducers: {
    replaceServiceNodes(state, action: PayloadAction<ResponseTreeNode[]>) {
      state.serviceNodes = action.payload;
    },
    replaceCompartmentNodes(state, action: PayloadAction<ResponseTreeNode[]>) {
      state.compartmentNodes = action.payload;
    },
  },
});

export const nodeActions = nodeSlice.actions;
export default nodeSlice;
