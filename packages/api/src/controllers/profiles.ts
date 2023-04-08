import type { Request, Response } from "express";
import { successResponse } from "../utils/expressResponses";
import { Provider } from "../services/provider";

/* interface Hash {
  [id: string]: any;
}

function mapToStringHashReplacer(_key: any, value: any) {
  if (value instanceof Map) {
    const hash: Hash = {};
    for (const [mapKey, mapValue] of value.entries()) {
      if (!(typeof mapKey === "string")) return;
      hash[mapKey] = mapValue;
    }
    return hash;
  } else {
    return value;
  }
}

export const profiles = (_req: Request, res: Response) => {
  console.log(
    Provider.getInstance().provider.getProfileCredentials()
      ?.configurationsByProfile || {}
  );
  console.log(
    JSON.stringify(
      Provider.getInstance().provider.getProfileCredentials()
        ?.configurationsByProfile || {},
      mapToStringHashReplacer
    )
  );
  return successResponse(
    res,
    JSON.parse(
      JSON.stringify(
        Provider.getInstance().provider.getProfileCredentials()
          ?.configurationsByProfile || {},
        mapToStringHashReplacer
      )
    )
  );
}; */

export const profiles = (_req: Request, res: Response) => {
  return successResponse(res, [
    ...(Provider.getInstance()
      .provider.getProfileCredentials()
      ?.configurationsByProfile.keys() || []),
  ]);
};
