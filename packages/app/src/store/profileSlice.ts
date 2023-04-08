import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ProfileState {
  profile: string | undefined;
}

const initialState: ProfileState = {
  profile: undefined,
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    replaceProfile(state, action: PayloadAction<string>) {
      state.profile = action.payload;
    },
  },
});

export const profileActions = profileSlice.actions;
export default profileSlice;
