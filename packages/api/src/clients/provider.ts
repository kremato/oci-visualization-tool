/* import { getProvider } from "./getProvider";
import type { ComputeClient } from "oci-core";
import type { IdentityClient } from "oci-identity";
import type { LimitsClient } from "oci-limits";
import type common from "oci-common";
import { getComputeClient } from "./getComputeClient";
import { getIdentityClient } from "./getIdentityClient";
import { getLimitsClient } from "./getLimitsClient";

export class Clients {
  private static instance: Clients;
  public readonly provider: common.ConfigFileAuthenticationDetailsProvider;
  public readonly computeClient: ComputeClient;
  public readonly identityClient: IdentityClient;
  public readonly limitsClient: LimitsClient;

  private constructor() {
    this.provider = getProvider();
    this.computeClient = getComputeClient(this.provider);
    this.identityClient = getIdentityClient(this.provider);
    this.limitsClient = getLimitsClient(this.provider);
    this.provider.getKeyId
  }

  static getInstance() {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new Clients();
    return this.instance;
  }
}
 */

import { getProvider } from "./getProvider";
import type common from "oci-common";

export class Provider {
  private static instance: Provider;
  public readonly provider: common.ConfigFileAuthenticationDetailsProvider;

  private constructor() {
    this.provider = getProvider();
    this.provider.getKeyId;
  }

  static getInstance() {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new Provider();
    return this.instance;
  }
}
