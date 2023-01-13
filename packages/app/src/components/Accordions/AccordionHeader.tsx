import { Typography, Stack } from "@mui/material";
import { ReactNode } from "react";

interface Props {
  title: string;
  children?: ReactNode;
}

export const AccordionHeader = ({ title, children }: Props) => {
  return (
    <Stack direction={"row"} justifyContent={"space-between"} pb={1}>
      <Typography variant="h5">{title}</Typography>
      <Stack spacing={2} direction={"row"}>
        {children}
      </Stack>
    </Stack>
  );
};
