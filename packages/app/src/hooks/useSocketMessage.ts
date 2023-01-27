import { useEffect, useState } from "react";
import {
  messageListeners,
  reconnectingSocketApi,
} from "../utils/reconnectingSocketApi";

export const useSocketMessage = () => {
  const [message, setMessage] = useState(reconnectingSocketApi.getMessage());
  useEffect(() => {
    const messageListener = () => {
      setMessage(reconnectingSocketApi.getMessage());
    };
    messageListeners.add(messageListener);
    messageListener();
    return () => {
      messageListeners.delete(messageListener);
    };
  }, []);

  return message;
};
