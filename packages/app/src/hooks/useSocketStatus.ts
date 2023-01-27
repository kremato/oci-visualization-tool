import { useEffect, useState } from "react";
import {
  openStateListeners,
  reconnectingSocketApi,
} from "../utils/reconnectingSocketApi";

export const useSocketStatus = () => {
  const [isOpen, setIsOpen] = useState(reconnectingSocketApi.isOpen());
  useEffect(() => {
    const statusListener = () => {
      setIsOpen(reconnectingSocketApi.isOpen());
    };
    openStateListeners.add(statusListener);
    statusListener();
    return () => {
      openStateListeners.delete(statusListener);
    };
  }, []);

  return isOpen;
};
