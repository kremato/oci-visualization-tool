import type { identity } from "oci-sdk";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const regionsSlice = createSlice({
  name: "regions",
  initialState: {
    regionsList: [] as identity.models.RegionSubscription[],
  },
  reducers: {
    replaceRegions(
      state,
      action: PayloadAction<identity.models.RegionSubscription[]>
    ) {
      state.regionsList = action.payload;
    },
  },
});

export const regionsActions = regionsSlice.actions;
export default regionsSlice;
