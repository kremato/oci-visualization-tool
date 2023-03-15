import { common } from "common";

const configurationFilePath = "~/.oci/config";
const profile = process.env["PROFILE"] ? process.env["PROFILE"] : "DEFAULT";

export const getProvider =
  (): common.ConfigFileAuthenticationDetailsProvider => {
    const provider: common.ConfigFileAuthenticationDetailsProvider =
      new common.ConfigFileAuthenticationDetailsProvider(
        configurationFilePath,
        profile
      );
    return provider;
  };
