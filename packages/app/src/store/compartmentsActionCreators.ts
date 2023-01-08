import type { identity } from "oci-sdk";
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
          data as identity.models.Compartment[]
        )
      );
    } catch (e) {
      console.log(e);
    }
  };
};
