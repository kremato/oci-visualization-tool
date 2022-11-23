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
    showAll: false,
    showNoAvailability: false,
    showNoUsed: false,
    showNoQuota: false,
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
    upadateShowAll(state, action: PayloadAction<boolean>) {
      state.showAll = action.payload;
    },
    updateNoAvailability(state, action: PayloadAction<boolean>) {
      state.showNoAvailability = action.payload;
    },
    updateNoUsed(state, action: PayloadAction<boolean>) {
      state.showNoUsed = action.payload;
    },
    updateNoQuota(state, action: PayloadAction<boolean>) {
      state.showNoQuota = action.payload;
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
