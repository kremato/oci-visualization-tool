import { common } from "common";

const configurationFilePath = "~/.oci/config";

export const getProvider = (
  profile: string
): common.ConfigFileAuthenticationDetailsProvider => {
  const provider: common.ConfigFileAuthenticationDetailsProvider =
    new common.ConfigFileAuthenticationDetailsProvider(
      configurationFilePath,
      profile
    );
  return provider;
};
