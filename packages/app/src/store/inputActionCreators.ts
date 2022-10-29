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

    console.log("body used");
    console.log(response.body);
    const reader = response.body!.getReader();
    let fulltext = "";
    let line = (await reader.read()).value;
    while (line) {
      fulltext += new TextDecoder().decode(line);
      line = (await reader.read()).value;
    }

    const foo = JSON.parse(fulltext, function reviver(k, v) {
      if (v && typeof v === "object" && !Array.isArray(v)) {
        return Object.assign(Object.create(null), v);
      }
      return v;
    });
    console.log(foo);
    //const tmp = await response.json();
    //console.log(tmp);
  };
};
