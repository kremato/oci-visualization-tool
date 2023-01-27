import Chip from "@mui/material/Chip";
import { useSocketStatus } from "../../hooks/useSocketStatus";

export const SocketStatus = () => {
  const socketStatus = useSocketStatus();

  return (
    <Chip
      label={socketStatus ? "Socket is up" : "Socket is reconnecting..."}
      color={socketStatus ? "success" : "warning"}
    />
  );
};
