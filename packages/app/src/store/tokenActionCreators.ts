import { AppDispatch } from "./store";
import { parseResponseBody } from "../utils/parseResponseBody";
import { tokenActions } from "./tokenSlice";
import { reconnectingSocketApi } from "../utils/reconnectingSocketApi";

export const fetchToken = () => {
  return async (dispatch: AppDispatch) => {
    const request = new Request(
      `${import.meta.env.VITE_API}/registration-token`
    );

    let response;
    try {
      response = await fetch(request);
    } catch (error) {
      console.log("Failed to fetch registration token");
      return;
    }

    const body = (await parseResponseBody(response)) as {
      message: string;
      data: string;
    };

    if (!response.ok) {
      console.log(
        `Unable to fetch token, http respose code is not ok, code: ${response.status}, message:`
      );
      console.log(body.message);
      return;
    }

    dispatch(tokenActions.replaceToken(body.data));
    reconnectingSocketApi.restart();
  };
};
