import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { ServiceScopeObject, StringHash } from "../types/types";
import { RegionDataAccordion } from "./RegionDataAccordions";

interface Props {
  compartmentName: string;
  regions: StringHash<ServiceScopeObject>;
}

export const CompartmentDataAccordion = ({
  compartmentName,
  regions,
}: Props) => {
  return (
    <div>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls={`${compartmentName}-compartment-content`}
          id={`${compartmentName}-compartment-header`}
        >
          <Typography>{compartmentName}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {Object.entries(regions).map(([regionName, serviceScopeObject]) => (
            <RegionDataAccordion
              regionName={regionName}
              serviceScopeObject={serviceScopeObject}
            />
          ))}
        </AccordionDetails>
      </Accordion>
    </div>
  );
};
