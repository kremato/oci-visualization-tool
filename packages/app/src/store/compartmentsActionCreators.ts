import { IdentityCompartment } from "common";
import { compartmentsActions } from "./compartmentsSlice";
import { AppDispatch } from "./store";

export const fetchCompartmentsList = () => {
  return async (dispatch: AppDispatch) => {
    try {
      const request = new Request(`${import.meta.env.VITE_API}/compartments`);
      const response = await fetch(request);
      const { data } = await response.json();
      dispatch(
        compartmentsActions.replaceCompartmentList(
          data as IdentityCompartment[]
        )
      );
    } catch (e) {
      console.log(e);
    }
  };
};
