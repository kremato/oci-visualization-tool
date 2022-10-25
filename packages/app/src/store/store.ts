import { configureStore } from "@reduxjs/toolkit";
import checkboxSlice from "./checkboxSlice";

import compartmentsSlice from "./compartmentsSlice";
import regionsSlice from "./regionsSlice";
import servicesSlice from "./servicesSlice";

const store = configureStore({
  reducer: {
    compartments: compartmentsSlice.reducer,
    regions: regionsSlice.reducer,
    services: servicesSlice.reducer,
    checkbox: checkboxSlice.reducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export default store;
