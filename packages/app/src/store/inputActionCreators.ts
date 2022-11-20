import { CompartmentsHash, InputData, ResponseTree } from "common";
import { parseResponseBody } from "../utils/parseResponseBody";
import { compartmentsActions } from "./compartmentsSlice";
import { inputActions } from "./inputSlice";
import { servicesActions } from "./servicesSlice";
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
    const data = (await parseResponseBody(response)) as ResponseTree[];
    if (data.length === 0) return;
    console.log("RESPONSE");
    console.log(data);
    const [rootCompartments, rootServices] = data;
    console.log("CompartmentNodes");
    console.log(rootCompartments.children);
    console.log("ServiceNodes");
    console.log(rootServices.children);
    dispatch(
      compartmentsActions.replaceCompartmentNodes(rootCompartments.children)
    );
    dispatch(servicesActions.replaceServiceNodes(rootServices.children));
  };
};
