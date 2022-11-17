import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { ReactNode } from "react";
import { useAppSelector } from "../hooks/useAppSelector";

interface Props {
  title: string;
  children?: ReactNode;
}

export const AccordionWrapper = ({ title, children }: Props) => {
  const showAll = useAppSelector((state) => state.input.showAll);
  return (
    <Accordion expanded={showAll}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls={`${title}-compartment-content`}
        id={`${title}-compartment-header`}
      >
        <Typography>{title}</Typography>
      </AccordionSummary>
      <AccordionDetails>{children}</AccordionDetails>
    </Accordion>
  );
};
