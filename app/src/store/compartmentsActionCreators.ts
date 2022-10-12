import { Compartment } from "../types/types";
import { compartmentsActions } from "./compartmentsSlice";
import { AppDispatch } from "./store";

// TODO: pridat navratove hodnoty funckcii alebo prerobit podla navodu
export const fetchCompartmentsList = () => {
  return async (dispatch: AppDispatch) => {
    try {
      const request = new Request(`${import.meta.env.VITE_API}/compartments`);

      const response = await fetch(request);
      const data = (await response.json()) as Compartment[];
      dispatch(compartmentsActions.replaceCompartments(data));
    } catch (e) {
      console.log(e);
    }
  };
};
