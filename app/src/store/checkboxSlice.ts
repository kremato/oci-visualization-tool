import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { useAppSelector } from "../hooks/useAppSelector";
import { CheckboxHash } from "../types/types";

const checkboxSlice = createSlice({
  name: "checkbox",
  initialState: {
    checkboxHash: {} as CheckboxHash,
  },
  reducers: {
    replaceCheckboxHash(state) {
      const megaList = useAppSelector((state) => {
        return [
          ...state.compartments.compartmentsList,
          ...state.regions.regionsList,
          ...state.services.servicesList,
        ];
      });

      for (const item of megaList) {
        console.log(item);
      }
    },
    updateCheckboxHash(state, action: PayloadAction<{ id: string }>) {
      const isChecked = state.checkboxHash[action.payload.id];
      state.checkboxHash[action.payload.id] = !isChecked;
    },
  },
});

export const checkboxActions = checkboxSlice.actions;
export default checkboxSlice;
