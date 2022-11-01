import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createCompartmentHierarchy } from "../services/createCompartmentHierarchy";
import { HierarchyHash } from "../types/types";
import { CompartmentsHash, IdentityCompartment } from "common";

const compartmentsSlice = createSlice({
  name: "compartments",
  initialState: {
    compartmentList: [] as IdentityCompartment[],
    hierarchyHash: {} as HierarchyHash,
    compartmentHash: Object.create(null) as CompartmentsHash,
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
    replaceCompartmentHash(state, action: PayloadAction<CompartmentsHash>) {
      state.compartmentHash = action.payload;
    },
  },
});

export const compartmentsActions = compartmentsSlice.actions;
export default compartmentsSlice;
