import { common } from "common";
import { ProfileCache } from "./profileCache";

const startupProfile = process.env["PROFILE"] || null;

// Singleton
export class Cache {
  private profiles: string[] = [];
  private profileCaches: Map<string, ProfileCache>;
  private static instance: Cache;

  private constructor() {
    this.profileCaches = new Map();
    const configFileReader =
      common.ConfigFileReader.parseDefault(startupProfile);
    const profiles =
      configFileReader.profileCredentials.configurationsByProfile.keys();
    for (const profile of profiles) {
      this.profiles.push(profile);
      this.profileCaches.set(profile, new ProfileCache(profile));
    }
  }

  static getInstance(): Cache {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new Cache();
    return this.instance;
  }

  getProfileCache(profile: string): ProfileCache | undefined {
    return this.profileCaches.get(profile);
  }

  getProfiles(): string[] {
    return structuredClone(this.profiles);
  }
}
