import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createCompartmentHierarchy } from "../services/createCompartmentHierarchy";
import { HierarchyHash, Compartment } from "../types/types";

const compartmentsSlice = createSlice({
  name: "compartments",
  initialState: {
    compartmentsList: [] as Compartment[],
    hierarchyHash: {} as HierarchyHash,
  },
  reducers: {
    replaceCompartments(state, action: PayloadAction<Compartment[]>) {
      state.compartmentsList = action.payload;
      state.hierarchyHash = createCompartmentHierarchy(
        import.meta.env.VITE_API,
        action.payload
      );
    },
  },
});

export const compartmentsActions = compartmentsSlice.actions;
export default compartmentsSlice;
