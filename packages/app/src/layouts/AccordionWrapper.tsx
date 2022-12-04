import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { ReactNode, useEffect, useState } from "react";
import { useAppSelector } from "../hooks/useAppSelector";

interface Props {
  title: string;
  children?: ReactNode;
}

export const AccordionWrapper = ({ title, children }: Props) => {
  const [expanded, setExpanded] = useState(false);
  const showAll = useAppSelector((state) => state.input.expandAll);

  useEffect(() => {
    setExpanded((_) => showAll);
  }, [showAll]);

  const handleChange =
    () => (_event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded((_) => isExpanded);
    };

  return (
    <Accordion
      expanded={expanded}
      onChange={handleChange()}
      TransitionProps={{ unmountOnExit: true }}
    >
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
