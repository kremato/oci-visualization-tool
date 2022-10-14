import { checkboxActions } from "./checkboxSlice";
import store, { AppDispatch } from "./store";

// TODO: pridat navratove hodnoty funckcii alebo prerobit podla navodu
export const fillCheckboxes = () => {
  return async (dispatch: AppDispatch, getState: typeof store.getState) => {
    const compartments = getState().compartments.compartmentsList;
    const regions = getState().regions.regionsList;
    const services = getState().services.servicesList;
    
    dispatch(checkboxActions.replaceCheckboxHash({ compartments, regions, services }))
  };
};
