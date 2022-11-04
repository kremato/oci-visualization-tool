import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { listCompartments } from "./services/listCompartments";
import cors from "cors";
import { listRegionSubscriptions } from "./services/listRegionSubscriptions";
import { listServices } from "./services/listServices";
import { common } from "oci-sdk";
import { getServiceLimits } from "./services/getServiceLimits";
import { Provider } from "./clients/provider";
import { getCompartmentRegionResources } from "./services/getCompartmentRegionResources";
import { Names } from "common";
import type {
  CommonRegion,
  LimitDefinitionsPerScope,
  ServiceLimits,
} from "./types/types";
import type {
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
    // app.use(...) runs on every single request
    app.use(cors());
    app.use(express.json());
    const port = process.env["PORT"];
    //const tenancyId = process.env["TENANCY_ID"]!;
    const tenancyId = Provider.getInstance().provider.getTenantId();
    /* const serviceLimitDefinitions = await getServiceLimits(
      Region.CA_MONTREAL_1,
      tenancyId
    );
    outputServiceLimits(
      serviceLimitDefinitions as LimitDefinitionsMap,
      "serviceLimits.txt",
      true
    ); */
    let compartments: IdentityCompartment[] = [];
    let regionSubscriptions: RegionSubscription[] = [];
    let regions: CommonRegion[] = [];
    let serviceSubscriptions: ServiceSummary[] = [];
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
      for (const region of regions) {
        serviceLimits.set(
          region,
          (await getServiceLimits(region, true)) as LimitDefinitionsPerScope
        );
      }
      // fill compartmentHash with compartments and regions
      for (const compartment of compartments) {
        const compartmentData: CompartmentData = Object.create(null);
        compartmentData["compartmentName"] = compartment.name;
        compartmentData["regions"] = Object.create(null);
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

    app.post("/limits", async (req: Request, res: Response) => {
      // TODO: validation
      const data = req.body as InputData;

      const filteredCompartments = compartments.filter((compartment) => {
        return data.compartments.includes(compartment.id);
      });
      const filteredRegions = regions.filter((region) => {
        return data.regions.includes(region.regionId);
      });
      const filteredServices = serviceSubscriptions.filter((service) => {
        return data.services.includes(service.name);
      });

      const responseCompartmentHash: CompartmentsHash = Object.create(null);
      for (const compartment of filteredCompartments) {
        const responseCompartmentData = createCompartmentDataObject(
          compartment.name
        );
        responseCompartmentHash[compartment.id] = responseCompartmentData;
        for (const region of filteredRegions) {
          const responseServiceScopeObject = createServiceScopeObject();
          for (const service of filteredServices) {
            const scopeObject =
              compartmentHash[compartment.id]?.regions[region.regionId];
            // if no compartment or region within that compartment has
            // been found (which should not happen), continue
            if (!scopeObject) {
              console.log("[index.ts]: 'undefined' regionServicesObject");
              continue;
            }
            const filteredScopes = [];
            // TODO: use Names enum
            if (
              data.scopes.includes(Names.AD) &&
              !scopeObject.aDScopeHash[service.name]
            )
              filteredScopes.push(Names.AD);
            if (
              data.scopes.includes(Names.Region) &&
              !scopeObject.regionScopeHash[service.name]
            )
              filteredScopes.push(Names.Region.toUpperCase());

            const limits = serviceLimits.get(region);
            await getCompartmentRegionResources(
              compartment.id,
              region,
              limits!,
              service.name,
              filteredScopes,
              scopeObject
            );
          }
        }
      }

      /* const responseCompartmentHash: CompartmentsHash = Object.create(null);
      for (const compartment of filteredCompartments) {
        const compartmentData: CompartmentData = Object.create(null);
        compartmentData["compartmentName"] = compartment.name;
        compartmentData["regions"] = Object.create(null);
        responseCompartmentHash[compartment.id] = compartmentData;
        for (const region of filterdRegions) {
          const serviceScopeObject: ServiceScopeObject = Object.create(null);
          serviceScopeObject["aDScope"] = Object.create(null);
          serviceScopeObject["regionScope"] = Object.create(null);
          for (const service of filterdServices) {
            const aDScope =
              compartmentHash[compartment.id]?.regions[region.regionId]
                ?.aDScope[service.name];
            if (aDScope) {
              serviceScopeObject.aDScope[service.name] = aDScope;
            }
            const regionScope =
              compartmentHash[compartment.id]?.regions[region.regionId]
                ?.regionScope[service.name];
            if (regionScope) {
              serviceScopeObject.regionScope[service.name] = regionScope;
            }
          }
          compartmentData.regions[region.regionId] = serviceScopeObject;
        }
        responseCompartmentHash[compartment.id] = compartmentData;
      } */

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
