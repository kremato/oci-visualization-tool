import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const inputSlice = createSlice({
  name: "input",
  initialState: {
    compartments: [] as string[],
    regions: [] as string[],
    services: [] as string[],
    scopes: [] as string[],
    limits: [] as { limitName: string; serviceName: string }[],
    invalidateCache: false,
    showProgressBar: false,
    progressValue: 0,
    sumADResources: false,
    expandAll: false,
    hideNoAvailability: true,
    hideNoUsed: true,
    hideNoQuota: true,
    hideNoServiceLimits: true,
    showByCompartment: true,
    showByService: false,
    showDeprecated: false,
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
    replaceLimits(
      state,
      action: PayloadAction<{ limitName: string; serviceName: string }[]>
    ) {
      state.limits = action.payload;
    },
    updateInvalidateCache(state, action: PayloadAction<boolean>) {
      state.invalidateCache = action.payload;
    },
    updateShowProgressBar(state, action: PayloadAction<boolean>) {
      state.showProgressBar = action.payload;
    },
    updateProgressValue(state, action: PayloadAction<number>) {
      state.progressValue = action.payload;
    },
    updateSumADResources(state, action: PayloadAction<boolean>) {
      state.sumADResources = action.payload;
    },
    updateExpandAll(state, action: PayloadAction<boolean>) {
      state.expandAll = action.payload;
    },
    updateHideNoAvailability(state, action: PayloadAction<boolean>) {
      state.hideNoAvailability = action.payload;
    },
    updateHideNoUsed(state, action: PayloadAction<boolean>) {
      state.hideNoUsed = action.payload;
    },
    updateHideNoQuota(state, action: PayloadAction<boolean>) {
      state.hideNoQuota = action.payload;
    },
    updateHideNoServiceLimits(state, action: PayloadAction<boolean>) {
      state.hideNoServiceLimits = action.payload;
    },
    updateShowByCompartment(state, action: PayloadAction<boolean>) {
      state.showByCompartment = action.payload;
    },
    updateShowByService(state, action: PayloadAction<boolean>) {
      state.showByService = action.payload;
    },
    updateShowDeprecated(state, action: PayloadAction<boolean>) {
      state.showDeprecated = action.payload;
    },
  },
});

export const inputActions = inputSlice.actions;
export default inputSlice;
