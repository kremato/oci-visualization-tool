import { useAppSelector } from "../../hooks/useAppSelector";
import { UniqueLimit } from "common";
import { Typography } from "@mui/material";
import { hide } from "../../utils/hide";
import { LimitRow } from "./LimitRow";

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
        <LimitRow
          key={"SUM"}
          name={"SUM"}
          serviceLimit={uniqueLimit.resourceAvailabilitySum.serviceLimit}
          availability={uniqueLimit.resourceAvailabilitySum.available}
          used={uniqueLimit.resourceAvailabilitySum.used}
          quota={uniqueLimit.resourceAvailabilitySum.quota}
        />
      );
  } else
    for (const resourceAvailability of uniqueLimit.resourceAvailability) {
      if (hide(resourceAvailability, hideParams)) continue;
      const row = (
        <LimitRow
          key={resourceAvailability.availabilityDomain}
          name={resourceAvailability.availabilityDomain || "AD name missing"}
          serviceLimit={resourceAvailability.serviceLimit}
          availability={resourceAvailability.available}
          used={resourceAvailability.used}
          quota={resourceAvailability.quota}
        />
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
