import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { mutate } from "swr";

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
      const regex = new RegExp(
        `^${
          import.meta.env.VITE_API
        }/(compartments|region-subscriptions|services|limits)\\?profile=`
      );
      mutate(
        (key) => {
          return typeof key === "string" && key.match(regex) !== null;
        },
        undefined,
        { revalidate: true }
      );
      state.profile = action.payload;
    },
  },
});

export const profileActions = profileSlice.actions;
export default profileSlice;
