import type { limits, MyServiceSummary } from "common";
import { myServiceSummarySchema } from "./validationSchemas";

const serviceSummaryFilter = async (
  serviceSummary: limits.models.ServiceSummary
): Promise<MyServiceSummary | undefined> => {
  let myServiceSummary: MyServiceSummary | undefined = undefined;
  try {
    myServiceSummary = await myServiceSummarySchema.validate(serviceSummary);
  } catch (error) {}
  return myServiceSummary;
};

export const filterServiceSummaries = async (
  serviceSummaries: limits.models.ServiceSummary[]
): Promise<MyServiceSummary[]> => {
  const myServiceSummaries: MyServiceSummary[] = [];
  for (const serviceSummary of serviceSummaries) {
    const myServiceSummary = await serviceSummaryFilter(serviceSummary);
    if (myServiceSummary) myServiceSummaries.push(myServiceSummary);
  }
  return myServiceSummaries;
};
