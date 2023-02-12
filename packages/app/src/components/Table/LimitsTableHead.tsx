import { Typography } from "@mui/material";

interface Props {
  domainTable?: boolean;
}

export const LimitsTableHead = ({ domainTable = true }: Props) => {
  return (
    <thead>
      <tr>
        <th>
          <Typography>Limit Name</Typography>
        </th>
        {domainTable && (
          <th>
            <Typography>Scope</Typography>
          </th>
        )}
        <th>
          <Typography>Service Limit</Typography>
        </th>
        <th>
          <Typography>Available</Typography>
        </th>
        <th>
          <Typography>Used</Typography>
        </th>
        <th>
          <Typography>Quota</Typography>
        </th>
      </tr>
    </thead>
  );
};
