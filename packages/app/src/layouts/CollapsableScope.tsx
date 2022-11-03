import {
  ResourceObjectAD,
  ResourceObjectRegion,
  ServiceResourceHashAD,
  StringHash,
} from "common";
import { Names } from "../types/types";
import { AccordionWrapper } from "./AccordionWrapper";
import { ADTable } from "./ADTable";
import { RegionTable } from "./RegionTable";

interface Props {
  scope: string;
  resourceObjectList: StringHash<ResourceObjectAD[] | ResourceObjectRegion[]>;
}
export const CollapsableScope = ({ scope, resourceObjectList }: Props) => {
  const children = Object.entries(resourceObjectList).map(
    ([serviceName, resourceObjectList]) => {
      if (scope === Names.AD)
        return (
          <ADTable
            serviceName={serviceName}
            resourceObjectADList={resourceObjectList as ResourceObjectAD[]}
          />
        );
      return (
        <RegionTable
          serviceName={serviceName}
          resourceObjectRegionList={
            resourceObjectList as ResourceObjectRegion[]
          }
        ></RegionTable>
      );
    }
  );
  return (
    <AccordionWrapper title={`${scope} Scope`}>{children}</AccordionWrapper>
  );
};
