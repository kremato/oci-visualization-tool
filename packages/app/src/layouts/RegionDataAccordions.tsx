import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { ADTable } from "./ADTable";
import { RegionTable } from "./RegionTable";
import { ServiceScopeObject } from "common";

interface Props {
  regionName: string;
  serviceScopeObject: ServiceScopeObject;
}
export const RegionDataAccordion = ({
  regionName,
  serviceScopeObject,
}: Props) => {
  return (
    <div>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls={`${regionName}-compartment-content`}
          id={`${regionName}-compartment-header`}
        >
          <Typography>{regionName}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {/* {Object.entries(serviceScopeObject.aDScope).map(
            ([serviceName, resourceObjectADList]) => (
              <ADServiceScopeAccordion
                serviceName={serviceName}
                resourceObjectADList={resourceObjectADList}
              />
            )
          )} */}
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`ad-compartment-content`}
              id={`ad-compartment-header`}
            >
              <Typography>AD Scope</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {Object.entries(serviceScopeObject.aDScope).map(
                ([serviceName, resourceObjectADList]) => (
                  <ADTable
                    serviceName={serviceName}
                    resourceObjectADList={resourceObjectADList}
                  />
                )
              )}
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`region-compartment-content`}
              id={`region-compartment-header`}
            >
              <Typography>Region Scope</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {Object.entries(serviceScopeObject.regionScope).map(
                ([serviceName, resourceObjectRegionList]) => (
                  <RegionTable
                    serviceName={serviceName}
                    resourceObjectRegionList={resourceObjectRegionList}
                  />
                )
              )}
            </AccordionDetails>
          </Accordion>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};
