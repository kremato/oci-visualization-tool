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
    console.log(provider.getProfileCredentials()?.configurationsByProfile);
    const configProfile =
      provider.getProfileCredentials()?.configurationsByProfile;
    if (configProfile)
      for (const [profileName, entries] of configProfile.entries()) {
        console.log(profileName);
        for (const [entry, entryValue] of entries.entries()) {
          console.log(`${entry}: ${entryValue}`);
        }
      }
    return provider;
  };
