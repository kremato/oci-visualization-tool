import { getProvider } from "./getProvider";
import type common from "oci-common";

// Singleton
export class Provider {
  private static instance: Provider;
  public readonly provider: common.ConfigFileAuthenticationDetailsProvider;

  private constructor() {
    this.provider = getProvider();
    /* this.provider.getKeyId; */
  }

  static getInstance() {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new Provider();
    return this.instance;
  }
}
