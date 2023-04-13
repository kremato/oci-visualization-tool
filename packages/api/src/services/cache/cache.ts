import { common } from "common";
import { ProfileCache } from "./profileCache";
import { log } from "../../utils/log";
import path from "path";
import { readFileSync } from "fs";

const envProfile = process.env["PROFILE"] || "DEFAULT";

// Singleton
export class Cache {
  private profiles: string[] = [];
  private profileCaches: Map<string, ProfileCache>;
  private static instance: Cache;
  private static providers = new Map<
    string,
    common.SimpleAuthenticationDetailsProvider
  >();

  private constructor() {
    Cache.loadProviders();
    this.profileCaches = new Map();
    for (const profileName of Cache.providers.keys()) {
      this.profiles.push(profileName);
      this.profileCaches.set(profileName, new ProfileCache(profileName));
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

  static getProvider(
    profile: string
  ): common.SimpleAuthenticationDetailsProvider | undefined {
    return this.providers.get(profile);
  }

  private static loadProviders() {
    let configFile;
    try {
      configFile = common.ConfigFileReader.parseDefault(envProfile);
    } catch {
      log(
        path.basename(__filename),
        `Could not parse the config file with ${envProfile} profile.`
      );
      configFile = common.ConfigFileReader.parseDefault(null);
    }

    for (const [
      profileName,
      profileEntries,
    ] of configFile.profileCredentials.configurationsByProfile.entries()) {
      const user = profileEntries.get("user");
      const fingerprint = profileEntries.get("fingerprint");
      const tenancy = profileEntries.get("tenancy");
      const region = profileEntries.get("region");
      const key_file = profileEntries.get("key_file");

      if (!key_file || !common.ConfigFileReader.fileExists(key_file)) {
        log(
          path.basename(__filename),
          `key_file entry for ${profileName} profile is either missing or the key_file does not exist at path ${key_file}`
        );
        continue;
      }
      if (!user || !fingerprint || !tenancy || !region) {
        log(
          path.basename(__filename),
          `One of the following config file entries is either empty or is missing user: ${user}, fingerprint: ${fingerprint}, tenancy: ${tenancy}, region: ${region}`
        );
        continue;
      }
      if (common.Region.fromRegionId(region) === undefined) {
        log(
          path.basename(__filename),
          `region: ${region} is not a valid region`
        );
        continue;
      }

      let privateKey: string;
      try {
        privateKey = readFileSync(
          common.ConfigFileReader.expandUserHome(key_file),
          "utf8"
        );
      } catch {
        console.log(
          path.basename(__filename),
          `Unable to read private key contents from ${key_file} for ${profileName} profile.`
        );
        continue;
      }

      const simpleProvider = new common.SimpleAuthenticationDetailsProvider(
        tenancy,
        user,
        fingerprint,
        privateKey,
        null,
        common.Region.fromRegionId(region)
      );

      this.providers.set(profileName, simpleProvider);
    }
  }
}
