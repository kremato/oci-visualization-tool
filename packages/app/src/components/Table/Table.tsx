import { Typography } from "@mui/material";
import { UniqueLimit } from "common";
import { LimitsTableHead } from "./LimitsTableHead";
import { Row } from "./Row";

interface Props {
  uniqueLimits: UniqueLimit[];
}

export const Table = ({ uniqueLimits }: Props) => {
  if (uniqueLimits.length === 0) {
    return <Typography>No limits found</Typography>;
  }

  return (
    <table>
      <LimitsTableHead />
      <tbody>
        {uniqueLimits.map((uniqueLimit) => {
          return (
            <Row
              uniqueLimit={uniqueLimit}
              key={uniqueLimit.limitName + uniqueLimit.serviceName}
            />
          );
        })}
      </tbody>
    </table>
  );
};
