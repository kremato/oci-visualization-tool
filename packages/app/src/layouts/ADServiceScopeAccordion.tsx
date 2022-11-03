import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { ADTable } from "./ADTable";
import { ResourceObjectAD } from "common";

interface Props {
  serviceName: string;
  resourceObjectADList: ResourceObjectAD[];
}
export const ADScopeAccordion = ({
  serviceName,
  resourceObjectADList,
}: Props) => (
  <div>
    {/* <Accordion>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls={`${serviceName}-compartment-content`}
        id={`${serviceName}-compartment-header`}
      >
        <Typography>{serviceName}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <ADTable resourceObjectADList={resourceObjectADList} />
      </AccordionDetails>
    </Accordion> */}
  </div>
);