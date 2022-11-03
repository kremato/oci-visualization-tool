import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { ServiceScopeObject, StringHash } from "common";
import { HandshakeOutlined } from "@mui/icons-material";
import { has } from "immer/dist/internal";
import { Names } from "../types/types";

interface Props {
  title: string;
  parent: string;
  hashList: StringHash<any>[];
}

export const GeneralAccordion = ({ title, parent, hashList }: Props) => {
  const TopLevelAccordion = (
    <Accordion>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls={`${title}-compartment-content`}
        id={`${title}-compartment-header`}
      >
        <Typography>{title}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        {/* {Object.entries(regions).map(([regionName, serviceScopeObject]) => (
          <RegionDataAccordion
            regionName={regionName}
            serviceScopeObject={serviceScopeObject}
          />
        ))} */}
      </AccordionDetails>
    </Accordion>
  );

  for (const hash of hashList) {
    Object.entries(hash).map(([key, value]) => {
      let childTitle: String;
      let childHashList = [];
      if (parent === Names.Compartment) {
        childTitle = Names.Region;
        childHashList = [
          (value as ServiceScopeObject).aDScope,
          (value as ServiceScopeObject).regionScope,
        ];
      } else {
        childHashList = [value as StringHash<any>];
      }
    });
  }

  return <div></div>;
};
