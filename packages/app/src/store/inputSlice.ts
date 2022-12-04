import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const inputSlice = createSlice({
  name: "input",
  initialState: {
    compartments: [] as string[],
    regions: [] as string[],
    services: [] as string[],
    scopes: [] as string[],
    limits: [] as string[],
    sumADResources: false,
    expandAll: false,
    hideNoAvailability: true,
    hideNoUsed: true,
    hideNoQuota: true,
    showByCompartment: false,
    showByService: false,
  },
  reducers: {
    replaceCompartmentsId(state, action: PayloadAction<string[]>) {
      state.compartments = action.payload;
    },
    replaceRegionsId(state, action: PayloadAction<string[]>) {
      state.regions = action.payload;
    },
    replaceServicesId(state, action: PayloadAction<string[]>) {
      state.services = action.payload;
    },
    replaceScopes(state, action: PayloadAction<string[]>) {
      state.scopes = action.payload;
    },
    replaceLimits(state, action: PayloadAction<string[]>) {
      state.limits = action.payload;
    },
    updateSumADResources(state, action: PayloadAction<boolean>) {
      state.sumADResources = action.payload;
    },
    upadateExpandAll(state, action: PayloadAction<boolean>) {
      state.expandAll = action.payload;
    },
    updateHideNoAvailability(state, action: PayloadAction<boolean>) {
      state.hideNoAvailability = action.payload;
    },
    updateHideNoUsed(state, action: PayloadAction<boolean>) {
      state.hideNoUsed = action.payload;
    },
    updateNoQuota(state, action: PayloadAction<boolean>) {
      state.hideNoQuota = action.payload;
    },
    updateShowByCompartment(state, action: PayloadAction<boolean>) {
      state.showByCompartment = action.payload;
    },
    updateShowByService(state, action: PayloadAction<boolean>) {
      state.showByService = action.payload;
    },
  },
});

export const inputActions = inputSlice.actions;
export default inputSlice;
