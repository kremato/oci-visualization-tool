import { LimitDefinitionsPerProperty } from "common";
import { limitDefinitionsActions } from "./limitDefinitionSlice";
import { AppDispatch } from "./store";

export const fetchLimitdefinitionsPerLimitName = () => {
  return async (dispatch: AppDispatch) => {
    try {
      const request = new Request(`${import.meta.env.VITE_API}/limits`);
      const response = await fetch(request);
      const { data } = await response.json();
      dispatch(
        limitDefinitionsActions.replaceLimitDefinitionsPerLimitName(
          data as LimitDefinitionsPerProperty
        )
      );
    } catch (e) {
      console.log(e);
    }
  };
};
