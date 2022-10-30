import { reviver } from "./reviver";

export const parseResponse = async (response: Response) => {
  let fullText = "";
  /* if (response.body) {
    const reader = response.body!.getReader();
    let line = (await reader.read()).value;
    while (line) {
      fulltext += new TextDecoder().decode(line);
      line = (await reader.read()).value;
    }
  } */

  const result =
    fullText.length === 0 ? Object.create(null) : JSON.parse(fullText, reviver);
  return result;
};
