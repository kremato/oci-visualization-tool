import { useAppSelector } from "../../hooks/useAppSelector";
import { UniqueLimit } from "common";
import { Typography } from "@mui/material";
import { hide } from "../../utils/hide";
import React from "react";

interface Props {
  uniqueLimit: UniqueLimit;
}

export const ADRow = ({ uniqueLimit }: Props) => {
  const sumADResources = useAppSelector((state) => state.input.sumADResources);
  const hideParams = useAppSelector<[boolean, boolean, boolean, boolean]>(
    (state) => [
      state.input.hideNoServiceLimits,
      state.input.hideNoAvailability,
      state.input.hideNoUsed,
      state.input.hideNoQuota,
    ]
  );
  const showDeprecated = useAppSelector((state) => state.input.showDeprecated);

  if (uniqueLimit.isDeprecated && !showDeprecated) {
    return <></>;
  }

  if (uniqueLimit.resourceAvailability.length === 0) {
    console.log("uniqueLimit.resourceAvailability.length === 0");
    return (
      <tr>
        <Typography>No data for {uniqueLimit.limitName}</Typography>
      </tr>
    );
  }

  const aDRows = [];
  if (sumADResources) {
    if (!hide(uniqueLimit.resourceAvailabilitySum, hideParams))
      aDRows.push(
        <tr key={"SUM"}>
          <td>
            <Typography>SUM</Typography>
          </td>
          <td>
            <Typography>
              {uniqueLimit.resourceAvailabilitySum.serviceLimit}
            </Typography>
          </td>
          <td>
            <Typography>
              {uniqueLimit.resourceAvailabilitySum.available}
            </Typography>
          </td>
          <td>
            <Typography>{uniqueLimit.resourceAvailabilitySum.used}</Typography>
          </td>
          <td>
            <Typography>{uniqueLimit.resourceAvailabilitySum.quota}</Typography>
          </td>
        </tr>
      );
  } else
    for (const resourceAvailability of uniqueLimit.resourceAvailability) {
      if (hide(resourceAvailability, hideParams)) continue;
      const row = (
        <tr key={resourceAvailability.availabilityDomain}>
          <td>
            <Typography>{resourceAvailability.availabilityDomain}</Typography>
          </td>
          <td>
            <Typography>{resourceAvailability.serviceLimit}</Typography>
          </td>
          <td>
            <Typography>{resourceAvailability.available}</Typography>
          </td>
          <td>
            <Typography>{resourceAvailability.used}</Typography>
          </td>
          <td>
            <Typography>{resourceAvailability.quota}</Typography>
          </td>
        </tr>
      );
      aDRows.push(row);
    }

  if (aDRows.length === 0) {
    return <></>;
  }

  return (
    <>
      <tr>
        <td rowSpan={aDRows.length + 1}>
          <Typography>{uniqueLimit.limitName}</Typography>
        </td>
      </tr>
      {aDRows}
    </>
  );
};
