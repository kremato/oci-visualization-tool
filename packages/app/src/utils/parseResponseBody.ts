import { reviver } from "./reviver";

export const parseResponseBody = async (response: Response) => {
  let fullText = "";
  if (response.body) {
    const reader = response.body!.getReader();
    let line = (await reader.read()).value;
    while (line) {
      fullText += new TextDecoder().decode(line);
      line = (await reader.read()).value;
    }
  }
  return JSON.parse(fullText, reviver);
};
