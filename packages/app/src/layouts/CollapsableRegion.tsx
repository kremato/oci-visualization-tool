import { ServiceScopeObject } from "common";
import { Names } from "../types/types";
import { capitalizeFirstLetter } from "../utils/capitalizeFirstLetter";
import { AccordionWrapper } from "./AccordionWrapper";
import { CollapsableScope } from "./CollapsableScope";

interface Props {
  regionName: string;
  serviceScopeObject: ServiceScopeObject;
}

export const CollapsableRegion = ({
  regionName,
  serviceScopeObject,
}: Props) => {
  return (
    <AccordionWrapper title={regionName}>
      <CollapsableScope
        scope={Names.AD}
        resourceObjectList={serviceScopeObject.aDScope}
      />
      <CollapsableScope
        scope={capitalizeFirstLetter(Names.Region)}
        resourceObjectList={serviceScopeObject.regionScope}
      />
    </AccordionWrapper>
  );
};