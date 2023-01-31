import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ResponseTreeNode } from "common";

interface CompartmentState {
  compartmentNodes: ResponseTreeNode[];
}

const initialState: CompartmentState = {
  compartmentNodes: [],
};

const compartmentsSlice = createSlice({
  name: "compartments",
  initialState,
  reducers: {
    replaceCompartmentNodes(state, action: PayloadAction<ResponseTreeNode[]>) {
      state.compartmentNodes = action.payload;
    },
  },
});

export const compartmentsActions = compartmentsSlice.actions;
export default compartmentsSlice;
