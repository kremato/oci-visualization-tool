import { StringHash, ServiceScopeObject } from "common";
import { AccordionWrapper } from "./AccordionWrapper";
import { CollapsableRegion } from "./CollapsableRegion";

interface Props {
  compartmentName: string;
  regions: StringHash<ServiceScopeObject>;
}

export const CollapsableCompartment = ({ compartmentName, regions }: Props) => {
  return (
    <AccordionWrapper title={compartmentName}>
      {Object.entries(regions).map(([regionName, serviceScopeObject]) => (
        <CollapsableRegion
          regionName={regionName}
          serviceScopeObject={serviceScopeObject}
        />
      ))}
    </AccordionWrapper>
  );
};
