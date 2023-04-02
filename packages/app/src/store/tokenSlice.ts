import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface TokenState {
  token: string | undefined;
}

const initialState: TokenState = {
  token: undefined,
};

const tokenSlice = createSlice({
  name: "token",
  initialState,
  reducers: {
    replaceToken(state, action: PayloadAction<string>) {
      state.token = action.payload;
    },
  },
});

export const tokenActions = tokenSlice.actions;
export default tokenSlice;
