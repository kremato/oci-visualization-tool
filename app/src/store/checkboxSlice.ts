import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  CheckboxHash,
  Compartment,
  RegionSubscription,
  ServiceSummary,
} from "../types/types";

const checkboxSlice = createSlice({
  name: "checkbox",
  initialState: {
    checkboxHash: {
      compartments: {},
      regions: {},
      services: {},
    } as CheckboxHash,
  },
  reducers: {
    // TODO: refactor
    replaceCheckboxHash(
      state,
      action: PayloadAction<{
        compartments: Compartment[];
        regions: RegionSubscription[];
        services: ServiceSummary[];
      }>
    ) {
      for (const compartment of action.payload.compartments) {
        state.checkboxHash.compartments[compartment.id] = false;
      }

      for (const region of action.payload.regions) {
        state.checkboxHash.regions[region.regionKey] = false;
      }

      for (const service of action.payload.services) {
        if (!service.name) {
          console.debug(
            "No service name. Service skipped when adding to checkboxHash."
          );
          continue;
        }
        state.checkboxHash.services[service.name] = false;
      }
    },
    // TODO: refactor
    updateCheckboxHash(
      state,
      action: PayloadAction<{ id: string; type: string }>
    ) {
      let isChecked;
      if (action.payload.type === "compartment") {
        isChecked = state.checkboxHash.compartments[action.payload.id];
        state.checkboxHash.compartments[action.payload.id] = !isChecked;
        return;
      }

      if (action.payload.type === "region") {
        isChecked = state.checkboxHash.regions[action.payload.id];
        state.checkboxHash.regions[action.payload.id] = !isChecked;
        return;
      }

      isChecked = state.checkboxHash.services[action.payload.id];
      state.checkboxHash.services[action.payload.id] = !isChecked;
    },
  },
});

export const checkboxActions = checkboxSlice.actions;
export default checkboxSlice;
