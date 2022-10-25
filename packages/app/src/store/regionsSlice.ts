import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RegionSubscription } from "../types/types";

const regionsSlice = createSlice({
  name: "regions",
  initialState: {
    regionsList: [] as RegionSubscription[],
  },
  reducers: {
    replaceRegions(state, action: PayloadAction<RegionSubscription[]>) {
      state.regionsList = action.payload;
    },
  },
});

export const regionsActions = regionsSlice.actions;
export default regionsSlice;
