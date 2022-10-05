import { Clients } from "../services/clients/clients";
import { createCompartmentHierarchy } from "../services/createCompartmentHierarchy";
import { listCompartments } from "../services/listCompartments";
import { Compartment } from "../types/types";
import { compartmentsActions } from "./compartmentsSlice";
import { AppDispatch } from "./store";

// TODO: pridat navratove hodnoty funckcii alebo prerobit podla navodu
export const getCompartmentsList = () => {
  return async (dispatch: AppDispatch) => {
    const clients = Clients.getInstance();
    const rootCompartmentId = clients.provider.getTenantId();
    const compartments = await listCompartments(
      rootCompartmentId,
      clients.identityClient,
      true
    );
    dispatch(compartmentsActions.replaceCompartments(compartments));
  };
};

export const getHierarchyMap = (compartments: Compartment[]) => {
  return async (dispatch: AppDispatch) => {
    const clients = Clients.getInstance();
    const rootCompartmentId = clients.provider.getTenantId();
    const hierarchyMap = await createCompartmentHierarchy(
      rootCompartmentId,
      compartments,
      clients.identityClient
    );
    dispatch(compartmentsActions.replaceHierarchyMap(hierarchyMap));
  };
};
