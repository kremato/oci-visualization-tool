import { CompartmentsHash, InputData } from "common";
import { parseResponseBody } from "../utils/parseResponseBody";
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
    const inputData: InputData = getState().input;
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

    // Response code 409 in this case means, that there have already been newer
    // post request made on ${import.meta.env.VITE_API}/limits
    if (response.status === 409) {
      console.log(`Received status code 409, old request rejected`);
      return;
    }

    const hash = (await parseResponseBody(response)) as CompartmentsHash;
    console.log(hash);
    dispatch(compartmentsActions.replaceCompartmentHash(hash));
  };
};
