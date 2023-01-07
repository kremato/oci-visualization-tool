import { Typography } from "@mui/material";
import { UniqueLimit } from "common";
import { ADRow } from "./ADRow";
import { LimitsTableHead } from "./LimitsTableHead";

interface Props {
  limits: UniqueLimit[];
}

export const ADTable = ({ limits }: Props) => {
  if (limits.length === 0)
    return <Typography>No table cause no limits provided</Typography>;

  return (
    <table>
      <LimitsTableHead />
      <tbody>
        {limits.map((uniqueLimit) => {
          return (
            <ADRow
              uniqueLimit={uniqueLimit}
              key={uniqueLimit.limitName + uniqueLimit.serviceName}
            />
          );
        })}
      </tbody>
    </table>
  );
};
