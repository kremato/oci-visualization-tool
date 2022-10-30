import { CompartmentsHash } from "../types/types";
import { parseResponse } from "../utils/parseResponse";
import { compartmentsActions } from "./compartmentsSlice";
import { inputActions } from "./inputSlice";
import store, { AppDispatch } from "./store";

// TODO: pridat navratove hodnoty funckcii alebo prerobit podla navodu
/* export const fillCheckboxes = () => {
  return async (dispatch: AppDispatch, getState: typeof store.getState) => {
    const compartments = getState().compartments.compartmentsList;
    const regions = getState().regions.regionsList;
    const services = getState().services.servicesList;

    dispatch(
      inputActions.replaceCheckboxHash({ compartments, regions, services })
    );
  };
}; */

export const fetchLimitsData = () => {
  return async (dispatch: AppDispatch, getState: typeof store.getState) => {
    const inputData = {
      compartments: getState().input.compartments,
      regions: getState().input.regions,
      services: getState().input.services,
    };

    console.log(inputData);
    const request = new Request(`${import.meta.env.VITE_API}/limits`, {
      method: "POST",
      body: JSON.stringify(inputData),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    const response = await fetch(request);
    const hash = (await parseResponse(response)) as CompartmentsHash;
    dispatch(compartmentsActions.replaceCompartmentHash(hash));
  };
};
