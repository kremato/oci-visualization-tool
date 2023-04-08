import { configureStore } from "@reduxjs/toolkit";
import inputSlice from "./inputSlice";
import nodeSlice from "./nodeSlice";
import tokenSlice from "./tokenSlice";
import profileSlice from "./profileSlice";

const store = configureStore({
  reducer: {
    nodes: nodeSlice.reducer,
    input: inputSlice.reducer,
    token: tokenSlice.reducer,
    profile: profileSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
