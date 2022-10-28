import { inputActions } from "./checkboxSlice";
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
      },
    });

    const data = await fetch(request);

    console.log(data);
  };
};
