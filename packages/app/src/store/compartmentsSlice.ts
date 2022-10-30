import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createCompartmentHierarchy } from "../services/createCompartmentHierarchy";
import { HierarchyHash, Compartment, CompartmentsHash } from "../types/types";

const compartmentsSlice = createSlice({
  name: "compartments",
  initialState: {
    compartmentList: [] as Compartment[],
    hierarchyHash: {} as HierarchyHash,
    compartmentHash: {},
  },
  reducers: {
    replaceCompartmentList(state, action: PayloadAction<Compartment[]>) {
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
