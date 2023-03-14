import { ResponseTreeNode } from "common";
import { parseResponseBody } from "../utils/parseResponseBody";
import { inputActions } from "../store/inputSlice";
import { nodeActions } from "../store/nodeSlice";
import store from "../store/store";
import { LimitsFormValues } from "../types/types";

export const fetchLimitsData = async (requestBody: LimitsFormValues) => {
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
};
