import common = require("oci-common");

const configurationFilePath = "/home/kremato/.oci/config";
const profile = "DEFAULT";

export const getProvider =
  (): common.ConfigFileAuthenticationDetailsProvider => {
    const provider: common.ConfigFileAuthenticationDetailsProvider =
      new common.ConfigFileAuthenticationDetailsProvider(
        configurationFilePath,
        profile
      );
    return provider;
  };
