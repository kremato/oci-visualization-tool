import { useEffect, useState } from "react";
import {
  reconnectingSocketApi,
  addSocketStatusListener,
  deleteSocketStatusListener,
} from "../utils/reconnectingSocketApi";

export const useSocketStatus = () => {
  const [isOpen, setIsOpen] = useState(reconnectingSocketApi.isOpen());
  useEffect(() => {
    const statusListener = () => {
      setIsOpen(reconnectingSocketApi.isOpen());
    };
    addSocketStatusListener(statusListener);
    statusListener();
    return () => {
      deleteSocketStatusListener(statusListener);
    };
  }, []);

  return isOpen;
};
