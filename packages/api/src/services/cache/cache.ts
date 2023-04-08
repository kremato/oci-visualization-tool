import { Provider } from "../provider";
import type { ProfileCache } from "./profileCache";

// Singleton
export class Cache {
  private profiles: Map<string, ProfileCache>;
  private static instance: Cache;

  private constructor() {
    const profiles =
      Provider.getInstance().provider.getProfileCredentials()
        ?.configurationsByProfile.keys() || [];

    for
  }

  static getInstance(): Cache {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new Cache();
    return this.instance;
  }
}
