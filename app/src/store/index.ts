import { configureStore } from "@reduxjs/toolkit";

import compartmentsSlice from "./compartmentsSlice";

const store = configureStore({
  reducer: { compartments: compartmentsSlice.reducer },
});

export default store;
