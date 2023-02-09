import { ResponseTreeNode } from "common";
import { parseResponseBody } from "../utils/parseResponseBody";
import { inputActions } from "./inputSlice";
import { nodeActions } from "./nodeSlice";
import store, { AppDispatch } from "./store";

export const fetchLimitsData = () => {
  return async (dispatch: AppDispatch, getState: typeof store.getState) => {
    dispatch(inputActions.updateShowProgressBar(true));
    const inputState = getState().input;
    const requestBody = {
      compartments: inputState.compartments,
      regions: inputState.regions,
      services: inputState.services,
      limits: inputState.limits,
      invalidateCache: inputState.invalidateCache,
    };
    const request = new Request(`${import.meta.env.VITE_API}/limits`, {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    let response;
    try {
      response = await fetch(request);
    } catch (error) {
      console.log("Failed to fetch");
      dispatch(inputActions.updateShowProgressBar(false));
      return;
    }

    const body = (await parseResponseBody(response)) as {
      message: string;
      data: ResponseTreeNode[];
    };

    if (response.status === 409) return;

    if (!response.ok) {
      console.log(body.message);
      dispatch(inputActions.updateShowProgressBar(false));
      return;
    }

    const [rootCompartments, rootServices] = body.data;

    dispatch(inputActions.updateShowProgressBar(false));
    dispatch(nodeActions.replaceServiceNodes(rootServices.children));
    dispatch(nodeActions.replaceCompartmentNodes(rootCompartments.children));
  };
};
