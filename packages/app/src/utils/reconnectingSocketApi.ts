import { statusActions } from "../store/statusSlice";
import store from "../store/store";

const socketStatusListeners = new Set<() => void>();
const socketMessageListeners = new Set<() => void>();

export const addSocketStatusListener = socketStatusListeners.add.bind(
  socketStatusListeners
);
export const deleteSocketStatusListener = socketStatusListeners.delete.bind(
  socketStatusListeners
);
export const addSocketMessageListener = socketMessageListeners.add.bind(
  socketMessageListeners
);
export const deleteSocketMessageListener = socketMessageListeners.delete.bind(
  socketMessageListeners
);

const updateMessageListeners = () => {
  socketMessageListeners.forEach((listener) => listener());
};
const updateStatusListeners = () => {
  socketStatusListeners.forEach((listener) => listener());
};

export interface SocketMessageData {
  failedServices: string[];
  countLoadedLimits: number;
  countLimitDefinitionSummaries: number;
}

const socketApi = (): {
  isOpen: () => boolean | undefined;
  getMessage: () => SocketMessageData | undefined;
  setProgressMessage: (message: SocketMessageData) => void;
  restart: () => void;
} => {
  let socket: WebSocket | undefined = undefined;
  let isOpen: boolean | undefined = undefined;
  let progressMessage: SocketMessageData | undefined = undefined;

  const startSocket = () => {
    const token = store.getState().token.token;
    if (token === undefined) {
      return;
    }
    const searchParams = new URLSearchParams({
      token: token,
    });
    socket = new WebSocket(
      `ws://localhost:${import.meta.env.VITE_API_PORT}?` + searchParams
    );
    socket.onopen = (_event) => {
      isOpen = true;
      updateStatusListeners();
    };

    socket.onmessage = (message) => {
      progressMessage = JSON.parse(message.data);
      updateMessageListeners();
    };

    socket.onclose = (event) => {
      store.dispatch(statusActions.updateProgressStatus("hideProgressBar"));
      isOpen = false;
      updateStatusListeners();
    };
  };

  const setProgressMessage = (message: SocketMessageData) => {
    progressMessage = message;
    updateMessageListeners();
  };

  startSocket();

  return {
    isOpen: () => isOpen,
    getMessage: () => progressMessage,
    setProgressMessage,
    restart: () => {
      socket?.close();
      startSocket();
    },
  };
};

export const reconnectingSocketApi = socketApi();
