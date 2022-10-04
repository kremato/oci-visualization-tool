import { getProvider } from "./getProvider";
import { ComputeClient } from "oci-core";
import { IdentityClient } from "oci-identity";
import { LimitsClient } from "oci-limits";
import common from "oci-common";
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
  }

  static getInstance() {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new Clients();
    return this.instance;
  }
}
