import { ScopeObject } from "common";
import { Names } from "common";
import { capitalizeFirstLetter } from "../../utils/capitalizeFirstLetter";
import { AccordionWrapper } from "../../layouts/AccordionWrapper";
import { CollapsableScope } from "../Scopes/CollapsableScope";

interface Props {
  regionName: string;
  serviceScopeObject: ScopeObject;
}

export const CollapsableRegion = ({
  regionName,
  serviceScopeObject,
}: Props) => {
  return (
    <AccordionWrapper title={regionName}>
      {Object.keys(serviceScopeObject.aDScopeHash).length !== 0 && (
        <CollapsableScope
          scope={Names.AD}
          resourceObjectList={serviceScopeObject.aDScopeHash}
        />
      )}
      {Object.keys(serviceScopeObject.regionScopeHash).length !== 0 && (
        <CollapsableScope
          scope={capitalizeFirstLetter(Names.Region)}
          resourceObjectList={serviceScopeObject.regionScopeHash}
        />
      )}
    </AccordionWrapper>
  );
};
