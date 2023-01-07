import { useAppSelector } from "../../hooks/useAppSelector";
import { UniqueLimit } from "common";
import { Typography } from "@mui/material";
import { hide } from "../../utils/hide";
import { LimitRow } from "./LimitRow";

interface Props {
  uniqueLimit: UniqueLimit;
}

export const RegionRow = ({ uniqueLimit }: Props) => {
  const hideParams = useAppSelector<[boolean, boolean, boolean, boolean]>(
    (state) => [
      state.input.hideNoServiceLimits,
      state.input.hideNoAvailability,
      state.input.hideNoUsed,
      state.input.hideNoQuota,
    ]
  );

  const showDeprecated = useAppSelector((state) => state.input.showDeprecated);

  if (
    (uniqueLimit.isDeprecated && !showDeprecated) ||
    hide(uniqueLimit.resourceAvailabilitySum, hideParams)
  ) {
    return <></>;
  }

  return (
    <LimitRow
      name={uniqueLimit.limitName}
      serviceLimit={uniqueLimit.resourceAvailabilitySum.serviceLimit}
      availability={uniqueLimit.resourceAvailabilitySum.available}
      used={uniqueLimit.resourceAvailabilitySum.used}
      quota={uniqueLimit.resourceAvailabilitySum.quota}
    />
  );
};
