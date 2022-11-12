import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { listCompartments } from "./services/listCompartments";
import cors from "cors";
import { listRegionSubscriptions } from "./services/listRegionSubscriptions";
import { listServices } from "./services/listServices";
import { common } from "oci-sdk";
import { getLimitDefinitions } from "./services/getLimitDefinitions";
import { Provider } from "./clients/provider";
import { getServiceResourcesPerScope } from "./services/getServiceResourcesPerScope";
import { Names, ResourceDataGlobal } from "common";
import path from "path";
import type {
  CommonRegion,
  LimitDefinitionsPerScope,
  ServiceLimits,
  Token,
} from "./types/types";
import type {
  LimitDefinitionsPerLimitName,
  IdentityCompartment,
  RegionSubscription,
  ServiceSummary,
  CompartmentsHash,
  CompartmentData,
  ScopeObject,
  InputData,
} from "common";
import {
  createCompartmentDataObject,
  createServiceScopeObject,
} from "./services/createCompartmentDataObject";

(async () => {
  try {
    dotenv.config();
    const app: Express = express();
    app.use(cors());
    app.use(express.json());
    const port = process.env["PORT"];
    const tenancyId = Provider.getInstance().provider.getTenantId();
    let token: Token = { postLimitsCount: 0 };

    let compartments: IdentityCompartment[] = [];
    let regionSubscriptions: RegionSubscription[] = [];
    let regions: CommonRegion[] = [];
    let serviceSubscriptions: ServiceSummary[] = [];
    let limitDefinitionsPerLimitName: LimitDefinitionsPerLimitName =
      Object.create(null);
    const serviceLimits: ServiceLimits = new Map();
    const compartmentHash: CompartmentsHash = Object.create(null);

    app.listen(port, async () => {
      console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
      compartments = compartments.concat(
        await listCompartments(tenancyId, true)
      );
      regionSubscriptions = regionSubscriptions.concat(
        await listRegionSubscriptions(tenancyId)
      );
      serviceSubscriptions = serviceSubscriptions.concat(
        await listServices(tenancyId)
      );
      regions = common.Region.values().filter((region) =>
        regionSubscriptions.some((item) => item.regionName === region.regionId)
      );
      limitDefinitionsPerLimitName = (await getLimitDefinitions(
        "perLimitName"
      )) as LimitDefinitionsPerLimitName;

      for (const region of regions) {
        serviceLimits.set(
          region,
          (await getLimitDefinitions(
            "perScope",
            region
          )) as LimitDefinitionsPerScope
        );
      }
      // fill compartmentHash with compartments and regions
      for (const compartment of compartments) {
        const compartmentData: CompartmentData = Object.create(null);
        compartmentData["compartmentName"] = compartment.name;
        compartmentData["regions"] = Object.create(null);
        if (compartment.id === tenancyId) {
          compartmentData["global"] = Object.create(null);
        }
        compartmentHash[compartment.id] = compartmentData;
        for (const region of regions) {
          const regionServicesObject: ScopeObject = Object.create(null);
          regionServicesObject["aDScopeHash"] = Object.create(null);
          regionServicesObject["regionScopeHash"] = Object.create(null);
          compartmentData.regions[region.regionId] = regionServicesObject;
        }
      }
      console.log("[server]: App.use() finished");
    });

    app.get("/compartments", async (req: Request, res: Response) => {
      res.status(200).send(JSON.stringify(compartments));
    });

    app.get("/regions", async (req: Request, res: Response) => {
      res.status(200).send(JSON.stringify(regionSubscriptions));
    });

    app.get("/services", async (req: Request, res: Response) => {
      res.status(200).send(JSON.stringify(serviceSubscriptions));
    });

    app.get("/limits", async (req: Request, res: Response) => {
      res.status(200).send(JSON.stringify(limitDefinitionsPerLimitName));
    });

    app.post("/limits", async (req: Request, res: Response) => {
      // TODO: validation
      const data = req.body as InputData;

      const initialPostLimitsCount = token.postLimitsCount;
      token.postLimitsCount += 1;

      const filteredCompartments = compartments.filter((compartment) => {
        return data.compartments.includes(compartment.id);
      });
      const filteredRegions = regions.filter((region) => {
        return data.regions.includes(region.regionId);
      });
      const filteredServices = serviceSubscriptions.filter((service) => {
        return data.services.includes(service.name);
      });

      const promises: Promise<void>[] = [];
      const globalServiceResourceHash = compartmentHash[tenancyId]!.global!;
      for (const compartment of filteredCompartments) {
        for (const region of filteredRegions) {
          for (const service of filteredServices) {
            const cachedScopeObject =
              compartmentHash[compartment.id]?.regions[region.regionId];
            // if no compartment or region within that compartment has
            // been found (which should not happen), continue
            if (!cachedScopeObject) {
              console.log(
                `[${path.basename(__filename)}]: No compartment with id: ${
                  compartment.id
                } or region with id: ${
                  region.regionId
                } within that compartment has been found`
              );
              continue;
            }
            const filteredScopesForService = [];
            if (
              data.scopes.includes(Names.AD) &&
              !cachedScopeObject.aDScopeHash[service.name]
            )
              filteredScopesForService.push(Names.AD);
            if (
              data.scopes.includes(Names.Region) &&
              !cachedScopeObject.regionScopeHash[service.name]
            )
              filteredScopesForService.push(Names.Region.toUpperCase());
            if (
              data.scopes.includes(Names.Global) &&
              !globalServiceResourceHash[service.name]
            )
              filteredScopesForService.push(Names.Global.toUpperCase());

            const limits = serviceLimits.get(region);
            promises.push(
              getServiceResourcesPerScope(
                compartment.id,
                region,
                limits!,
                service.name,
                filteredScopesForService,
                cachedScopeObject,
                initialPostLimitsCount,
                token,
                globalServiceResourceHash
              )
            );
          }
        }
      }
      await Promise.all(promises);

      if (token.postLimitsCount != initialPostLimitsCount + 1) {
        res.status(409).send("");
        return;
      }

      const responseCompartmentHash: CompartmentsHash = Object.create(null);
      for (const compartment of filteredCompartments) {
        const compartmentData: CompartmentData = Object.create(null);
        compartmentData["compartmentName"] = compartment.name;
        compartmentData["regions"] = Object.create(null);
        if (compartment.id === tenancyId) {
          compartmentData["global"] = Object.create(null);
        }
        responseCompartmentHash[compartment.id] = compartmentData;
        for (const region of filteredRegions) {
          const serviceScopeObject: ScopeObject = Object.create(null);
          serviceScopeObject["aDScopeHash"] = Object.create(null);
          serviceScopeObject["regionScopeHash"] = Object.create(null);
          for (const service of filteredServices) {
            const aDScope =
              compartmentHash[compartment.id]?.regions[region.regionId]
                ?.aDScopeHash[service.name];
            if (data.scopes.includes(Names.AD) && aDScope) {
              serviceScopeObject.aDScopeHash[service.name] = aDScope;
            }
            const regionScope =
              compartmentHash[compartment.id]?.regions[region.regionId]
                ?.regionScopeHash[service.name];
            if (data.scopes.includes(Names.Region) && regionScope) {
              serviceScopeObject.regionScopeHash[service.name] = regionScope;
            }
            if (
              data.scopes.includes(Names.Global) &&
              compartment.id === tenancyId
            ) {
              compartmentData.global![service.name] =
                compartmentHash[tenancyId]!.global![service.name]!;
            }
          }
          if (
            Object.keys(serviceScopeObject.aDScopeHash).length > 0 ||
            Object.keys(serviceScopeObject.regionScopeHash).length > 0
          )
            compartmentData.regions[region.regionId] = serviceScopeObject;
        }
        responseCompartmentHash[compartment.id] = compartmentData;
      }

      /* const compartmentToRegions: CompartmentsHash = Object.create(null);
      for (const compartment of filteredCompartments) {
        const myCompartment: CompartmentData = Object.create(null);
        myCompartment.compartmentName = compartment.name;
        myCompartment.regions = Object.create(null);
        compartmentToRegions[compartment.id] = myCompartment;
        for (const region of filterdRegions) {
          const limits = serviceLimits.get(region);
          const regionToScope = compartmentToRegions[compartment.id]!;
          const regionServicesObject = await getCompartmentRegionResources(
            compartment.id,
            region,
            limits!,
            (scope: string) => {
              return scope !== "AD";
            },
            (serviceName: string) => {
              return serviceName !== "compute";
            }
          );
          regionToScope.regions[region.regionId] = regionServicesObject;
        }
      } */

      const responseData = JSON.stringify(responseCompartmentHash);
      console.log(responseData);
      res.status(200).send(responseData);
    });
  } catch (error) {
    console.log("Error executing" + error);
  } finally {
    console.debug("DONE");
  }
})();
