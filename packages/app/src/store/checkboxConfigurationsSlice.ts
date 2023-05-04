import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const checkboxConfigurationsSlice = createSlice({
  name: "checkboxConfigurations",
  initialState: {
    sumADResources: false,
    expandAll: false,
    hideNoAvailability: false,
    hideNoUsed: false,
    hideNoQuota: false,
    hideNoServiceLimit: true,
    showByCompartment: true,
    showByService: false,
    showDeprecated: false,
  },
  reducers: {
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
    updateHideNoServiceLimit(state, action: PayloadAction<boolean>) {
      state.hideNoServiceLimit = action.payload;
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

export const checkboxConfigurationsActions =
  checkboxConfigurationsSlice.actions;
export default checkboxConfigurationsSlice;
