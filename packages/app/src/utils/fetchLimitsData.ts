import { UniqueLimit } from "common";
import { parseResponseBody } from "../utils/parseResponseBody";
import { nodeActions } from "../store/nodeSlice";
import store from "../store/store";
import { LimitsFormValues } from "../types/types";
import { createUniqueLimitTreeNode } from "./createUniqueLimitTreeNode";
import { loadUniqueLimitTree } from "./loadUnqueLimitTree";
import { sortLimits } from "./sortLimits";
import { statusActions } from "../store/statusSlice";
import { reconnectingSocketApi } from "./reconnectingSocketApi";

export const fetchLimitsData = async (requestBody: LimitsFormValues) => {
  const profile = store.getState().profile.profile;
  const searchParams = new URLSearchParams({
    profile: profile || "",
  });

  store.dispatch(statusActions.updateProgressStatus("showProgressBar"));
  reconnectingSocketApi.setProgressMessage({
    failedServices: [],
    countLoadedLimits: 0,
    countLimitDefinitionSummaries: 0,
  });

  const request = new Request(
    `${import.meta.env.VITE_API}/limits/${
      store.getState().token.token || ""
    }?` + searchParams,
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
    store.dispatch(statusActions.updateProgressStatus("failure"));
    return;
  }

  const body = (await parseResponseBody(response)) as {
    message: string;
    data: UniqueLimit[];
  };

  // new reqest was made
  if (response.status === 409) {
    return;
  }

  if (!response.ok) {
    console.log(`Return code ${response.status}: ${body.message}`);
    store.dispatch(statusActions.updateProgressStatus("failure"));
    return;
  }

  const rootCompartmentTree = createUniqueLimitTreeNode("rootCompartments");
  const rootServiceTree = createUniqueLimitTreeNode("rootServices");
  for (const uniqueLimit of body.data) {
    loadUniqueLimitTree(uniqueLimit, rootCompartmentTree, "compartment");
    loadUniqueLimitTree(uniqueLimit, rootServiceTree, "service");
  }
  sortLimits(rootCompartmentTree);
  sortLimits(rootServiceTree);

  store.dispatch(statusActions.updateProgressStatus("success"));
  store.dispatch(
    nodeActions.replaceCompartmentNodes(rootCompartmentTree.children)
  );
  store.dispatch(nodeActions.replaceServiceNodes(rootServiceTree.children));
};
