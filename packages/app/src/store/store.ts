import { configureStore } from "@reduxjs/toolkit";
import inputSlice from "./inputSlice";

import compartmentsSlice from "./compartmentsSlice";
import regionsSlice from "./regionsSlice";
import servicesSlice from "./servicesSlice";
import limitDefinitionSlice from "./limitDefinitionSlice";

const store = configureStore({
  reducer: {
    compartments: compartmentsSlice.reducer,
    regions: regionsSlice.reducer,
    services: servicesSlice.reducer,
    input: inputSlice.reducer,
    limitDefinitions: limitDefinitionSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
