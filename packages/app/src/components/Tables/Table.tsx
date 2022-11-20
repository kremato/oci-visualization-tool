import { limits } from "oci-sdk";

import { UniqueLimit } from "common";
import { Typography } from "@mui/material";
import { ADTable } from "./ADTable";
import { RegionTable } from "./RegionTable";

interface Table {
  uniqueLimits: UniqueLimit[];
}

export const Table = ({ uniqueLimits }: Table) => {
  if (uniqueLimits.length === 0) {
    return <Typography>No limits found</Typography>;
  }

  return uniqueLimits[0].scope ===
    limits.models.LimitDefinitionSummary.ScopeType.Ad ? (
    <ADTable limits={uniqueLimits} />
  ) : (
    <RegionTable serviceName={""} resourceDataRegionList={[]} />
  );
};
