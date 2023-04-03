import { getProvider } from "./clients/getProvider";
import type { common } from "common";

// Singleton
export class Provider {
  private static instance: Provider;
  public readonly provider: common.ConfigFileAuthenticationDetailsProvider;

  private constructor() {
    this.provider = getProvider();
  }

  static getInstance() {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new Provider();
    return this.instance;
  }
}
