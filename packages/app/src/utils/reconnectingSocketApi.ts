import { inputActions } from "../store/inputSlice";
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

const socketApi = (): {
  isOpen: () => boolean | undefined;
  getMessage: () => SocketMessageData | undefined;
} => {
  console.log(`socketApi invoked`);
  let socket: WebSocket | undefined = undefined;
  let isOpen: boolean | undefined = undefined;
  let progressMessage: SocketMessageData | undefined = undefined;
  const startSocket = () => {
    socket = new WebSocket("ws://localhost:8546");

    socket.onopen = (_event) => {
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
      store.dispatch(inputActions.updateShowProgressBar(false));
      if (event.code !== 1006) {
        return;
      }
      isOpen = false;
      updateStatusListeners();
      setTimeout(() => {
        startSocket();
      }, socketReconnectDelayInMiliseconds);
    };
  };

  startSocket();

  return {
    isOpen: () => isOpen,
    getMessage: () => progressMessage,
  };
};

export const reconnectingSocketApi = socketApi();
