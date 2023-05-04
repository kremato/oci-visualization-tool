import { configureStore } from "@reduxjs/toolkit";
import checkboxConfigurationsSlice from "./checkboxConfigurationsSlice";
import nodeSlice from "./nodeSlice";
import tokenSlice from "./tokenSlice";
import profileSlice from "./profileSlice";
import statusSlice from "./statusSlice";

const store = configureStore({
  reducer: {
    nodes: nodeSlice.reducer,
    input: checkboxConfigurationsSlice.reducer,
    token: tokenSlice.reducer,
    status: statusSlice.reducer,
    profile: profileSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
