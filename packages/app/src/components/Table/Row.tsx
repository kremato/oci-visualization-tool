import { limits } from "common";
import { ResourceObject, UniqueLimit } from "common";
import { useAppSelector } from "../../hooks/useAppSelector";
import { hideResourceAvailability } from "../../utils/hideResourceAvailability";
import { LimitRow } from "./LimitRow";
import { Typography } from "@mui/material";

const getColumnNameForLimit = (
  scope:
    | limits.models.LimitDefinitionSummary.ScopeType.Ad
    | limits.models.LimitDefinitionSummary.ScopeType.Region,
  resource: ResourceObject
) => {
  if (scope === "AD") return resource.availabilityDomain || "AD name missing";
  return "REGION";
};

interface Props {
  uniqueLimit: UniqueLimit;
}

export const Row = ({ uniqueLimit }: Props) => {
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

  if (uniqueLimit.scope === "AD" && uniqueLimit.resources.length === 0) {
    return (
      <tr>
        <Typography>No data for {uniqueLimit.limitName}</Typography>
      </tr>
    );
  }

  if (
    (uniqueLimit.isDeprecated && !showDeprecated) ||
    hideResourceAvailability(uniqueLimit.resourceSum, hideParams)
  ) {
    return <></>;
  }

  const rows = [];

  if (!sumADResources) {
    for (const resourceAvailability of uniqueLimit.resources) {
      if (hideResourceAvailability(resourceAvailability, hideParams)) continue;
      const row = (
        <LimitRow
          key={resourceAvailability.availabilityDomain}
          name={getColumnNameForLimit(uniqueLimit.scope, resourceAvailability)}
          serviceLimit={resourceAvailability.serviceLimit}
          availability={resourceAvailability.available}
          used={resourceAvailability.used}
          quota={resourceAvailability.quota}
        />
      );
      rows.push(row);
    }
  }

  if (
    sumADResources &&
    !hideResourceAvailability(uniqueLimit.resourceSum, hideParams)
  ) {
    const row = (
      <LimitRow
        key={uniqueLimit.resourceSum.availabilityDomain}
        name={getColumnNameForLimit(uniqueLimit.scope, uniqueLimit.resourceSum)}
        serviceLimit={uniqueLimit.resourceSum.serviceLimit}
        availability={uniqueLimit.resourceSum.available}
        used={uniqueLimit.resourceSum.used}
        quota={uniqueLimit.resourceSum.quota}
      />
    );
    rows.push(row);
  }

  if (rows.length === 0) {
    return <></>;
  }

  return (
    <>
      <tr>
        <td rowSpan={rows.length + 1}>
          <Typography>{uniqueLimit.limitName}</Typography>
        </td>
      </tr>
      {rows}
    </>
  );
};
