import { ResponseTreeNode } from "common";
import { parseResponseBody } from "../utils/parseResponseBody";
import { inputActions } from "../store/inputSlice";
import { nodeActions } from "../store/nodeSlice";
import store from "../store/store";
import { LimitsFormValues } from "../types/types";

export const fetchLimitsData = async (requestBody: LimitsFormValues) => {
  console.log("fetchLimitsData; REQUEST BODY:");
  /* console.log(requestBody); */
  const progressStatus = store.getState().input.progressStatus;

  if (progressStatus === "progressBar")
    store.dispatch(inputActions.updateProgressStatus(undefined));
  else store.dispatch(inputActions.updateProgressStatus("progressBar"));

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
    store.dispatch(inputActions.updateProgressStatus("failure"));
    return;
  }

  const body = (await parseResponseBody(response)) as {
    message: string;
    data: ResponseTreeNode[];
  };

  if (response.status === 409) {
    //if (store.getState().input.progressStatus)
    store.dispatch(inputActions.updateProgressStatus("progressBar"));
    return;
  }

  if (!response.ok) {
    console.log(body.message);
    store.dispatch(inputActions.updateProgressStatus("failure"));
    return;
  }

  const [rootCompartments, rootServices] = body.data;

  store.dispatch(inputActions.updateProgressStatus("success"));
  store.dispatch(nodeActions.replaceServiceNodes(rootServices.children));
  store.dispatch(
    nodeActions.replaceCompartmentNodes(rootCompartments.children)
  );
};

/* export const fetchLimitsData = async (requestBody: LimitsFormValues) => {
  console.log("fetchLimitsData; REQUEST BODY:");
  console.log(requestBody);
  store.dispatch(inputActions.updateShowProgressBar(true));
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
    store.dispatch(inputActions.updateShowProgressBar(false));
    return;
  }

  const body = (await parseResponseBody(response)) as {
    message: string;
    data: ResponseTreeNode[];
  };

  if (response.status === 409) return;

  if (!response.ok) {
    console.log(body.message);
    store.dispatch(inputActions.updateShowProgressBar(false));
    return;
  }

  const [rootCompartments, rootServices] = body.data;

  store.dispatch(inputActions.updateShowProgressBar(false));
  store.dispatch(nodeActions.replaceServiceNodes(rootServices.children));
  store.dispatch(
    nodeActions.replaceCompartmentNodes(rootCompartments.children)
  );
}; */
