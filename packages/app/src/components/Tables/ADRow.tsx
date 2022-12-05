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
  const hideNoAvailability = useAppSelector(
    (state) => state.input.hideNoAvailability
  );
  const hideNoUsed = useAppSelector((state) => state.input.hideNoUsed);
  const hideNoQuota = useAppSelector((state) => state.input.hideNoQuota);
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
    if (
      !hide(
        uniqueLimit.resourceAvailabilitySum,
        hideNoAvailability,
        hideNoUsed,
        hideNoQuota
      )
    )
      aDRows.push(
        <React.Fragment key={"SUM"}>
          <td>
            <Typography>{"SUM"}</Typography>
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
        </React.Fragment>
      );
  } else
    for (const resourceAvailability of uniqueLimit.resourceAvailability) {
      if (
        hide(resourceAvailability, hideNoAvailability, hideNoUsed, hideNoQuota)
      )
        continue;
      const row = (
        <React.Fragment key={resourceAvailability.availabilityDomain}>
          <td>
            <Typography>{resourceAvailability.availabilityDomain}</Typography>
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
        </React.Fragment>
      );
      aDRows.push(row);
    }

  if (aDRows.length === 0) {
    return <></>;
  }

  return (
    <tr>
      <td rowSpan={aDRows.length}>
        <Typography>{uniqueLimit.limitName}</Typography>
      </td>
      {aDRows}
    </tr>
  );
};
