export const openStateListeners = new Set<() => void>();
export const messageListeners = new Set<() => void>();

const updateMessageStates = () => {
  messageListeners.forEach((listener) => listener());
};
const updateOpenStates = () => {
  openStateListeners.forEach((listener) => listener());
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
      updateOpenStates();
    };

    socket.onmessage = (message) => {
      console.log(`message from the server ${message}`);
      console.log(message.data);
      progressMessage = JSON.parse(message.data);
      updateMessageStates();
    };

    socket.onclose = (event) => {
      if (event.code !== 1006) {
        console.log("event code");
        return;
      }
      isOpen = false;
      updateOpenStates();
      setTimeout(() => {
        startSocket();
      }, 5000);
    };
  };

  startSocket();

  return {
    isOpen: () => isOpen,
    getMessage: () => progressMessage,
  };
};

export const reconnectingSocketApi = socketApi();
