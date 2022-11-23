import { useAppSelector } from "../../hooks/useAppSelector";
import { UniqueLimit } from "common";
import { Typography } from "@mui/material";
import React from "react";

interface Props {
  uniqueLimit: UniqueLimit;
}

export const ADRow = ({ uniqueLimit }: Props) => {
  const sumADResources = useAppSelector((state) => state.input.sumADResources);
  const showNoAvailability = useAppSelector(
    (state) => state.input.showNoAvailability
  );
  const showNoUsed = useAppSelector((state) => state.input.showNoUsed);
  const showNoQuota = useAppSelector((state) => state.input.showNoQuota);

  if (uniqueLimit.resourceAvailability.length === 0) {
    console.log("uniqueLimit.resourceAvailability.length === 0");
    return (
      <tr>
        <Typography>No data for {uniqueLimit.limitName}</Typography>
      </tr>
    );
  }

  const rows = [];
  const emptySymbols = ["0", "n/a"];
  for (const resourceAvailability of uniqueLimit.resourceAvailability) {
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

    if (
      (showNoAvailability &&
        emptySymbols.includes(resourceAvailability.available)) ||
      (showNoUsed && emptySymbols.includes(resourceAvailability.used)) ||
      (showNoQuota && emptySymbols.includes(resourceAvailability.quota))
    )
      rows.push(row);
    if (
      !emptySymbols.includes(resourceAvailability.available) &&
      !emptySymbols.includes(resourceAvailability.used) &&
      !emptySymbols.includes(resourceAvailability.quota)
    )
      rows.push(row);
  }

  if (rows.length === 0) {
    console.log("rows.length === 0");
    return <></>;
  }

  console.log("FINAL RETURN");
  return (
    <tr>
      <td rowSpan={rows.length}>
        <Typography>{uniqueLimit.limitName}</Typography>
      </td>
      {rows}
    </tr>
  );
};
