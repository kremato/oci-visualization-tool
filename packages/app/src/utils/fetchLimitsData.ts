import { UniqueLimit } from "common";
import { parseResponseBody } from "../utils/parseResponseBody";
import { inputActions } from "../store/inputSlice";
import { nodeActions } from "../store/nodeSlice";
import store from "../store/store";
import { LimitsFormValues } from "../types/types";
import { createUniqueLimitTreeNode } from "./createUniqueLimitTreeNode";
import { loadUniqueLimitTree } from "./loadUnqueLimitTree";
import { sortLimits } from "./sortLimits";

export const fetchLimitsData = async (requestBody: LimitsFormValues) => {
  console.log("fetchLimitsData; REQUEST BODY:");
  /* console.log(requestBody); */
  const progressStatus = store.getState().input.progressStatus;

  if (progressStatus === "progressBar")
    store.dispatch(inputActions.updateProgressStatus(undefined));
  else store.dispatch(inputActions.updateProgressStatus("progressBar"));

  const request = new Request(
    `${import.meta.env.VITE_API}/limits/${store.getState().token.token || ""}`,
    {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    }
  );

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
    data: UniqueLimit[];
  };

  if (response.status === 409) {
    store.dispatch(inputActions.updateProgressStatus("progressBar"));
    return;
  }

  if (!response.ok) {
    console.log(`Return code ${response.status}: ${body.message}`);
    store.dispatch(inputActions.updateProgressStatus("failure"));
    return;
  }

  /* const [rootCompartments, rootServices] = body.data; */

  const rootCompartmentTree = createUniqueLimitTreeNode("rootCompartments");
  const rootServiceTree = createUniqueLimitTreeNode("rootServices");
  for (const uniqueLimit of body.data) {
    loadUniqueLimitTree(uniqueLimit, rootCompartmentTree, "compartment");
    loadUniqueLimitTree(uniqueLimit, rootServiceTree, "service");
  }
  sortLimits(rootCompartmentTree);
  sortLimits(rootServiceTree);

  store.dispatch(inputActions.updateProgressStatus("success"));
  store.dispatch(
    nodeActions.replaceCompartmentNodes(rootCompartmentTree.children)
  );
  store.dispatch(nodeActions.replaceServiceNodes(rootServiceTree.children));
};
