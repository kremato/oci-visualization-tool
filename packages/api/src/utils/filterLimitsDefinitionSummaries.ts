import type { limits, MyLimitDefinitionSummary } from "common";
import { myLimitDefinitionSummarySchema } from "./validationSchemas";

const limitDefinitionFilter = async (
  limitDefinition: limits.models.LimitDefinitionSummary
): Promise<MyLimitDefinitionSummary | undefined> => {
  let myLimitDefinitionsSummary: MyLimitDefinitionSummary | undefined =
    undefined;
  try {
    myLimitDefinitionsSummary = await myLimitDefinitionSummarySchema.validate(
      limitDefinition
    );
  } catch (error) {}
  return myLimitDefinitionsSummary;
};

export const filterLimitDefinitionSummaries = async (
  limitDefinitionSummaries: limits.models.LimitDefinitionSummary[]
): Promise<MyLimitDefinitionSummary[]> => {
  const myLimitDefinitionSummaries: MyLimitDefinitionSummary[] = [];
  for (const summary of limitDefinitionSummaries) {
    const myLimitDefinitionSummary = await limitDefinitionFilter(summary);
    if (myLimitDefinitionSummary)
      myLimitDefinitionSummaries.push(myLimitDefinitionSummary);
  }
  return myLimitDefinitionSummaries;
};
