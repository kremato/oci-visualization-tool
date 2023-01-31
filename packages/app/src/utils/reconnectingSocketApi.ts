const socketStatusListeners = new Set<() => void>();
const socketMessageListeners = new Set<() => void>();

export const addSocketStatusListener = socketStatusListeners.add;
export const deleteSocketStatusListener = socketStatusListeners.delete;
export const addSocketMessageListener = socketMessageListeners.add;
export const deleteSocketMessageListener = socketMessageListeners.delete;

const SOCKET_RECONNECT_DELAY_MILISECONDS = 5000;

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
      if (event.code !== 1006) {
        console.log("event code");
        return;
      }
      isOpen = false;
      updateStatusListeners();
      setTimeout(() => {
        startSocket();
      }, SOCKET_RECONNECT_DELAY_MILISECONDS);
    };
  };

  startSocket();

  return {
    isOpen: () => isOpen,
    getMessage: () => progressMessage,
  };
};

export const reconnectingSocketApi = socketApi();
