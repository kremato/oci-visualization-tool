import { UniqueLimit } from "common";
import { Typography } from "@mui/material";
import { RegionRow } from "./RegionRow";
import { LimitsTableHead } from "./LimitsTableHead";

interface Props {
  limits: UniqueLimit[];
}

export const RegionTable = ({ limits }: Props) => {
  if (limits.length === 0)
    return <Typography>No table cause no limits provided</Typography>;

  return (
    <table>
      <LimitsTableHead domainTable={false} />
      <tbody>
        {limits.map((uniqueLimit) => {
          return (
            <RegionRow
              uniqueLimit={uniqueLimit}
              key={uniqueLimit.limitName + uniqueLimit.serviceName}
            />
          );
        })}
      </tbody>
    </table>
  );
};
