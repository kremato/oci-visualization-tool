import { configureStore } from "@reduxjs/toolkit";

import compartmentsSlice from "./compartmentsSlice";
import regionsSlice from "./regionsSlice";

const store = configureStore({
  reducer: {
    compartments: compartmentsSlice.reducer,
    regions: regionsSlice.reducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export default store;
