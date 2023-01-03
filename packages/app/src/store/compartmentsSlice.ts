import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createCompartmentHierarchy } from "../utils/createCompartmentHierarchy";
import { HierarchyHash } from "../types/types";
import {
  CompartmentsHash,
  IdentityCompartment,
  ResponseTreeNode,
} from "common";

const compartmentsSlice = createSlice({
  name: "compartments",
  initialState: {
    compartmentList: [] as IdentityCompartment[],
    hierarchyHash: {} as HierarchyHash,
    compartmentNodes: [] as ResponseTreeNode[],
  },
  reducers: {
    replaceCompartmentList(
      state,
      action: PayloadAction<IdentityCompartment[]>
    ) {
      state.compartmentList = action.payload;
      state.hierarchyHash = createCompartmentHierarchy(
        import.meta.env.VITE_API,
        action.payload
      );
    },
    replaceCompartmentNodes(state, action: PayloadAction<ResponseTreeNode[]>) {
      state.compartmentNodes = action.payload;
    },
  },
});

export const compartmentsActions = compartmentsSlice.actions;
export default compartmentsSlice;
