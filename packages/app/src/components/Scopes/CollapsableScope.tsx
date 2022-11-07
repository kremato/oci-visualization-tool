import { ResourceDataAD, ResourceDataRegion, StringHash } from "common";
import { Names } from "common";
import { AccordionWrapper } from "../../layouts/AccordionWrapper";
import { ADTable } from "../Tables/ADTable";
import { RegionTable } from "../Tables/RegionTable";

interface Props {
  scope: string;
  resourceObjectList: StringHash<ResourceDataAD[] | ResourceDataRegion[]>;
}
export const CollapsableScope = ({ scope, resourceObjectList }: Props) => {
  const children = Object.entries(resourceObjectList).map(
    ([serviceName, resourceObjectList]) => {
      if (scope === Names.AD)
        return (
          <ADTable
            serviceName={serviceName}
            resourceObjectADList={resourceObjectList as ResourceDataAD[]}
            key={serviceName}
          />
        );
      return (
        <RegionTable
          serviceName={serviceName}
          resourceDataRegionList={resourceObjectList as ResourceDataRegion[]}
          key={serviceName}
        ></RegionTable>
      );
    }
  );
  return (
    <AccordionWrapper title={`${scope} Scope`}>{children}</AccordionWrapper>
  );
};
