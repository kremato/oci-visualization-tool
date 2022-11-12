import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LimitDefinitionsPerLimitName, ServiceSummary } from "common";

const limitDefinitionSlice = createSlice({
  name: "limitDefinitions",
  initialState: {
    limitDefinitionsPerLimitName: Object.create(
      null
    ) as LimitDefinitionsPerLimitName,
  },
  reducers: {
    replaceLimitDefinitionsPerLimitName(
      state,
      action: PayloadAction<LimitDefinitionsPerLimitName>
    ) {
      state.limitDefinitionsPerLimitName = action.payload;
    },
  },
});

export const limitDefinitionsActions = limitDefinitionSlice.actions;
export default limitDefinitionSlice;
