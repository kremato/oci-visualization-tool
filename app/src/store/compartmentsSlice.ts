import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { HierarchyMap, Compartment } from "../types/types";

interface ActionCompartmentsList {
  payload: {compartments: Compartment[]},
  type: string
}

interface ActionHierarchyMap {
  payload: { hierarchyMap: HierarchyMap },
  type: string
}

const compartmentsSlice = createSlice({
  name: 'compartments',
  initialState: {
    compartmentsList: [] as Compartment[],
    hierarchyMap: (new Map<string, Compartment[]>) as HierarchyMap
  },
  reducers: {
    replaceCompartments(state, action: PayloadAction<Compartment[]>) {
      state.compartmentsList = action.payload
    },
    replaceHierarchyMap(state, action: PayloadAction<HierarchyMap>) {
      state.hierarchyMap = action.payload
    },
  },
});

export const compartmentsActions = compartmentsSlice.actions;
export default compartmentsSlice;
