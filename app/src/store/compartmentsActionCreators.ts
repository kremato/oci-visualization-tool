import { Provider, useDispatch } from "react-redux";
import { Clients } from "../services/clients/clients";
import { createCompartmentHierarchy } from "../services/createCompartmentHierarchy";
import { listCompartments } from "../services/listCompartments";
import { Compartment } from "../types/types";
import { compartmentsActions } from "./compartmentsSlice";

// TODO: try to remove any from ALL dispatch functions

export const getCompartmentsList = () => {
  return async (dispatch: any) => {
    const clients = Clients.getInstance();
    const rootCompartmentId = clients.provider.getTenantId();
    const compartments = await listCompartments(
      rootCompartmentId,
      clients.identityClient,
      true
    );
    dispatch(
      compartmentsActions.replaceCompartments({
        compartments,
      })
    );
  };
};

export const getHierarchyMap = (compartments: Compartment[]) => {
  return async (dispatch: any) => {
    const clients = Clients.getInstance();
    const rootCompartmentId = clients.provider.getTenantId();
    const hierarchyMap = await createCompartmentHierarchy(
      rootCompartmentId,
      compartments,
      clients.identityClient
    );
    dispatch(
      compartmentsActions.replaceHierarchyMap({
        hierarchyMap,
      })
    );
  };
};
