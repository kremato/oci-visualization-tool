import { ResourceObject, UniqueLimit } from "common";
import { useAppSelector } from "../../hooks/useAppSelector";
import { hideResourceLimit } from "../../utils/hideResourceLimit";
import { LimitRow } from "./LimitRow";
import { Typography } from "@mui/material";

const getColumnNameForLimit = (resource: ResourceObject) => {
  return resource.scope ? resource.scope : "n/a";
};

interface Props {
  uniqueLimit: UniqueLimit;
}

export const Row = ({ uniqueLimit }: Props) => {
  const sumADResources = useAppSelector((state) => state.input.sumADResources);
  const hideParams = useAppSelector<[boolean, boolean, boolean, boolean]>(
    (state) => [
      state.input.hideNoServiceLimit,
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
    hideResourceLimit(uniqueLimit.resourceSum, hideParams)
  ) {
    return <></>;
  }

  const rows = [];

  if (!sumADResources) {
    for (const resourceObject of uniqueLimit.resources) {
      if (hideResourceLimit(resourceObject, hideParams)) continue;
      const row = (
        <LimitRow
          key={resourceObject.scope}
          name={getColumnNameForLimit(resourceObject)}
          serviceLimit={resourceObject.serviceLimit}
          availability={resourceObject.available}
          used={resourceObject.used}
          quota={resourceObject.quota}
        />
      );
      rows.push(row);
    }
  }

  if (
    sumADResources &&
    !hideResourceLimit(uniqueLimit.resourceSum, hideParams)
  ) {
    const row = (
      <LimitRow
        key={uniqueLimit.resourceSum.scope}
        name={getColumnNameForLimit(uniqueLimit.resourceSum)}
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
