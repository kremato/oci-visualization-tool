import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LimitDefinitionsPerProperty } from "common";

const limitDefinitionSlice = createSlice({
  name: "limitDefinitions",
  initialState: {
    limitDefinitionsPerLimitName: Object.create(
      null
    ) as LimitDefinitionsPerProperty,
  },
  reducers: {
    replaceLimitDefinitionsPerLimitName(
      state,
      action: PayloadAction<LimitDefinitionsPerProperty>
    ) {
      state.limitDefinitionsPerLimitName = action.payload;
    },
  },
});

export const limitDefinitionsActions = limitDefinitionSlice.actions;
export default limitDefinitionSlice;
