import { useEffect, useState } from "react";
import {
  reconnectingSocketApi,
  addSocketMessageListener,
  deleteSocketMessageListener,
} from "../utils/reconnectingSocketApi";

export const useSocketMessage = () => {
  const [message, setMessage] = useState(reconnectingSocketApi.getMessage());
  useEffect(() => {
    const messageListener = () => {
      setMessage(reconnectingSocketApi.getMessage());
    };
    addSocketMessageListener(messageListener);
    messageListener();
    return () => {
      deleteSocketMessageListener(messageListener);
    };
  }, []);

  return message;
};
