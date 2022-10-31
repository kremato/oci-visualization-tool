import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { ServiceScopeObject } from "../types/types";
import { ADServiceScopeAccordion } from "./ADServiceScopeAccordion";

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
          {Object.entries(serviceScopeObject.aDScope).map(
            ([serviceName, resourceObjectADList]) => (
              <ADServiceScopeAccordion
                serviceName={serviceName}
                resourceObjectADList={resourceObjectADList}
              />
            )
          )}
        </AccordionDetails>
      </Accordion>
    </div>
  );
};
