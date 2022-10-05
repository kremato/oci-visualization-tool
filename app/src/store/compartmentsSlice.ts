import { createSlice } from "@reduxjs/toolkit";
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
    compartments: [] as Compartment[],
    hierarchyMap: new Map<string, Compartment[]> as HierarchyMap
  },
  reducers: {
    replaceCompartments(state, action: ActionCompartmentsList) {
      state.compartments = action.payload.compartments
    },
    replaceHierarchyMap(state, action: ActionHierarchyMap) {
      state.hierarchyMap = action.payload.hierarchyMap
    },
  },
});

export const compartmentsActions = compartmentsSlice.actions;
export default compartmentsSlice;
