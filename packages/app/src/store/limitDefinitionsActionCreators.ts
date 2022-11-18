import { LimitDefinitionsPerProperty, ServiceSummary } from "common";
import { limitDefinitionsActions } from "./limitDefinitionSlice";
import { AppDispatch } from "./store";

// TODO: pridat navratove hodnoty funckcii alebo prerobit podla navodu
export const fetchLimitdefinitionsPerLimitName = () => {
  return async (dispatch: AppDispatch) => {
    try {
      const request = new Request(`${import.meta.env.VITE_API}/limits`);

      const response = await fetch(request);
      const data = (await response.json()) as LimitDefinitionsPerProperty;
      dispatch(
        limitDefinitionsActions.replaceLimitDefinitionsPerLimitName(data)
      );
    } catch (e) {
      console.log(e);
    }
  };
};
