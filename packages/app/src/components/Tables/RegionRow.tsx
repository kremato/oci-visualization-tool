import { useAppSelector } from "../../hooks/useAppSelector";
import { UniqueLimit } from "common";
import { Typography } from "@mui/material";
import { hide } from "../../utils/hide";

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
    <tr>
      <td>
        <Typography>{uniqueLimit.limitName}</Typography>
      </td>
      <td>
        <Typography>
          {uniqueLimit.resourceAvailabilitySum.serviceLimit}
        </Typography>
      </td>
      <td>
        <Typography>{uniqueLimit.resourceAvailabilitySum.available}</Typography>
      </td>
      <td>
        <Typography>{uniqueLimit.resourceAvailabilitySum.used}</Typography>
      </td>
      <td>
        <Typography>{uniqueLimit.resourceAvailabilitySum.quota}</Typography>
      </td>
    </tr>
  );
};
