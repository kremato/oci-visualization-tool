import { useAppSelector } from "../../hooks/useAppSelector";
import { UniqueLimit } from "common";
import { Typography } from "@mui/material";
import { hide } from "../../utils/hide";

interface Props {
  uniqueLimit: UniqueLimit;
}

export const RegionRow = ({ uniqueLimit }: Props) => {
  const hideNoAvailability = useAppSelector(
    (state) => state.input.hideNoAvailability
  );
  const hideNoUsed = useAppSelector((state) => state.input.hideNoUsed);
  const hideNoQuota = useAppSelector((state) => state.input.hideNoQuota);
  const showDeprecated = useAppSelector((state) => state.input.showDeprecated);

  if (
    (uniqueLimit.isDeprecated && !showDeprecated) ||
    hide(
      uniqueLimit.resourceAvailabilitySum,
      hideNoAvailability,
      hideNoUsed,
      hideNoQuota
    )
  ) {
    return <></>;
  }

  return (
    <tr>
      <td>
        <Typography>{uniqueLimit.limitName}</Typography>
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
