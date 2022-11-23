import { ResourceDataRegion, UniqueLimit } from "common";
import { useAppSelector } from "../../hooks/useAppSelector";
import { Typography } from "@mui/material";

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
          const showEmptyServiceLimits = useAppSelector(
            (state) => state.input.showNoAvailability
          );

          /* const hide =
            !showEmptyServiceLimits && resourceObjectRegion.available === "0"; */
          if (uniqueLimit.resourceAvailability.length === 0) {
            return (
              <tr>
                <Typography>No data for {uniqueLimit.limitName}</Typography>
              </tr>
            );
          }

          return (
            <tr
              key={uniqueLimit.limitName}
              /* style={{
                visibility: hide ? "hidden" : "visible",
                display: hide ? "none" : "table-row",
              }} */
            >
              <td>
                <Typography>{uniqueLimit.limitName}</Typography>
              </td>
              <td>
                <Typography>
                  {uniqueLimit.resourceAvailability[0].available}
                </Typography>
              </td>
              <td>
                <Typography>
                  {uniqueLimit.resourceAvailability[0].used}
                </Typography>
              </td>
              <td>
                <Typography>
                  {uniqueLimit.resourceAvailability[0].quota}
                </Typography>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
