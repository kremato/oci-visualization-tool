import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UniqueLimitTreeNode } from "../types/types";

interface NodeState {
  serviceNodes: UniqueLimitTreeNode[];
  compartmentNodes: UniqueLimitTreeNode[];
}

const initialState: NodeState = {
  serviceNodes: [],
  compartmentNodes: [],
};

const nodeSlice = createSlice({
  name: "nodes",
  initialState,
  reducers: {
    replaceServiceNodes(state, action: PayloadAction<UniqueLimitTreeNode[]>) {
      state.serviceNodes = action.payload;
    },
    replaceCompartmentNodes(
      state,
      action: PayloadAction<UniqueLimitTreeNode[]>
    ) {
      state.compartmentNodes = action.payload;
    },
  },
});

export const nodeActions = nodeSlice.actions;
export default nodeSlice;
