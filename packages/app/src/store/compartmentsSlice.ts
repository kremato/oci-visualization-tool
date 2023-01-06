import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IdentityCompartment, ResponseTreeNode } from "common";

const compartmentsSlice = createSlice({
  name: "compartments",
  initialState: {
    compartmentList: [] as IdentityCompartment[],
    compartmentNodes: [] as ResponseTreeNode[],
  },
  reducers: {
    replaceCompartmentList(
      state,
      action: PayloadAction<IdentityCompartment[]>
    ) {
      state.compartmentList = action.payload;
    },
    replaceCompartmentNodes(state, action: PayloadAction<ResponseTreeNode[]>) {
      state.compartmentNodes = action.payload;
    },
  },
});

export const compartmentsActions = compartmentsSlice.actions;
export default compartmentsSlice;
