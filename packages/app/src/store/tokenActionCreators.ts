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
      console.log(body.message);
      return;
    }

    console.log(`Received token: ${body.data}`);
    dispatch(tokenActions.replaceToken(body.data));
    reconnectingSocketApi.restart();
  };
};
