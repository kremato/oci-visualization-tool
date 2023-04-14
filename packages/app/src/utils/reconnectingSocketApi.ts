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

const socketReconnectDelayInMiliseconds = 5000;

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

// TODO:
//const port = process.env.prodution ? import.meta.env.VITE_API : process.

const socketApi = (): {
  isOpen: () => boolean | undefined;
  getMessage: () => SocketMessageData | undefined;
  setProgressMessage: (message: SocketMessageData) => void;
  restart: () => void;
} => {
  console.log(`socketApi invoked`);
  let socket: WebSocket | undefined = undefined;
  let isOpen: boolean | undefined = undefined;
  let progressMessage: SocketMessageData | undefined = undefined;

  const startSocket = () => {
    const token = store.getState().token.token;
    if (token === undefined) {
      console.log(`token is undefined, returning`);
      return;
    }
    const searchParams = new URLSearchParams({
      token: token,
    });
    console.log(store.getState().token.token);
    console.log(`URL : ${"ws://localhost:8546?" + searchParams}`);
    socket = new WebSocket("ws://localhost:8546?" + searchParams);
    socket.onopen = (_event) => {
      console.log(`socket is open, token: ${token}`);
      isOpen = true;
      updateStatusListeners();
    };

    socket.onmessage = (message) => {
      console.log(`message from the server ${message}`);
      console.log(message.data);
      progressMessage = JSON.parse(message.data);
      updateMessageListeners();
    };

    socket.onclose = (event) => {
      console.log(`socket is closing, code: ${event.code}; token: ${token}`);
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
