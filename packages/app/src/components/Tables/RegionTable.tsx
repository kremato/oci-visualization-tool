import { UniqueLimit } from "common";
import { Typography } from "@mui/material";
import { RegionRow } from "./RegionRow";

interface Props {
  limits: UniqueLimit[];
}

export const RegionTable = ({ limits }: Props) => {
  if (limits.length === 0)
    return <Typography>No table cause no limits provided</Typography>;

  return (
    <table>
      <thead>
        <tr>
          <th>
            <Typography>Limit Name</Typography>
          </th>
          <th>
            <Typography>Service limit</Typography>
          </th>
          <th>
            <Typography>Available</Typography>
          </th>
          <th>
            <Typography>Used</Typography>
          </th>
          <th>
            <Typography>Quota</Typography>
          </th>
        </tr>
      </thead>
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
  /* return (
    <table>
      <thead>
        <tr>
          <th>
            <Typography>Limit Name</Typography>
          </th>
          <th>
            <Typography>Available</Typography>
          </th>
          <th>
            <Typography>Used</Typography>
          </th>
          <th>
            <Typography>Quota</Typography>
          </th>
        </tr>
      </thead>
      <tbody>
        {limits.map((uniqueLimit) => {
          return (
            <tr key={uniqueLimit.limitName}>
              <td>
                <Typography>{uniqueLimit.limitName}</Typography>
              </td>
              <td>
                <Typography>
                  {uniqueLimit.resourceAvailabilitySum.available}
                </Typography>
              </td>
              <td>
                <Typography>
                  {uniqueLimit.resourceAvailabilitySum.used}
                </Typography>
              </td>
              <td>
                <Typography>
                  {uniqueLimit.resourceAvailabilitySum.quota}
                </Typography>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  ); */
};
