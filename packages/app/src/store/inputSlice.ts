import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const inputSlice = createSlice({
  name: "input",
  initialState: {
    compartments: [] as string[],
    regions: [] as string[],
    services: [] as string[],
    scopes: [] as string[],
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
  },
});

export const inputActions = inputSlice.actions;
export default inputSlice;
