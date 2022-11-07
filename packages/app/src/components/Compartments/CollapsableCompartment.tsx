import { StringHash, ScopeObject } from "common";
import { AccordionWrapper } from "../../layouts/AccordionWrapper";
import { CollapsableRegion } from "../Regions/CollapsableRegion";

interface Props {
  compartmentName: string;
  regions: StringHash<ScopeObject>;
}

export const CollapsableCompartment = ({ compartmentName, regions }: Props) => {
  return (
    <AccordionWrapper title={compartmentName}>
      {Object.entries(regions).map(([regionName, serviceScopeObject]) => (
        <CollapsableRegion
          regionName={regionName}
          serviceScopeObject={serviceScopeObject}
          key={regionName}
        />
      ))}
    </AccordionWrapper>
  );
};
