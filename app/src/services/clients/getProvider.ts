import common from "oci-common";
import { SimpleAuthenticationDetailsProvider } from "oci-sdk";

/* const configurationFilePath = "/home/kremato/.oci/config";
const profile = "DEFAULT";

export const getProvider =
  (): common.ConfigFileAuthenticationDetailsProvider => {
    const provider: common.ConfigFileAuthenticationDetailsProvider =
      new common.ConfigFileAuthenticationDetailsProvider(
        configurationFilePath,
        profile
      );
    return provider;
  }; */

export const getProvider = (): SimpleAuthenticationDetailsProvider => {
  const provider = new common.SimpleAuthenticationDetailsProvider(
    import.meta.env.VITE_TEANANCY,
    import.meta.env.VITE_USER,
    import.meta.env.VITE_FINGERPRINT,
    import.meta.env.VITE_PRIVATEKEY,
    import.meta.env.VITE_REGION
  );

  return provider;
};
