import type { identity } from "oci-sdk";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ResponseTreeNode } from "common";

const compartmentsSlice = createSlice({
  name: "compartments",
  initialState: {
    compartmentList: [] as identity.models.Compartment[],
    compartmentNodes: [] as ResponseTreeNode[],
  },
  reducers: {
    replaceCompartmentList(
      state,
      action: PayloadAction<identity.models.Compartment[]>
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
