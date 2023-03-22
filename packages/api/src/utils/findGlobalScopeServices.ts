import { limits } from "common";
import { getLimitDefinitionsPerProperty } from "../services/getLimitDefinitionsPerProperty";

export const findGloballyScopedServices = (
  limiDefinitionsSummaries: limits.models.LimitDefinitionSummary[]
) => {
  const limitDefinitionsPerService = getLimitDefinitionsPerProperty(
    limiDefinitionsSummaries,
    "serviceName"
  );
  const globalScopeServices: string[] = [];
  for (const [
    serviceName,
    limitDefinitionSummaries,
  ] of limitDefinitionsPerService.entries()) {
    globalScopeServices.push(serviceName);
    for (const limitDefinition of limitDefinitionSummaries) {
      if (
        limitDefinition.scopeType !==
        limits.models.LimitDefinitionSummary.ScopeType.Global
      ) {
        globalScopeServices.pop();
        break;
      }
    }
  }

  return globalScopeServices;
};
