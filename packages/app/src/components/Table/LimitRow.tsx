import { Typography } from "@mui/material";

export interface Props {
  name: string;
  serviceLimit: string;
  availability: string;
  used: string;
  quota: string;
}

export const LimitRow = ({
  name,
  serviceLimit,
  availability,
  used,
  quota,
}: Props) => {
  return (
    <tr key={Math.random().toString() + name}>
      <td>
        <Typography>{name}</Typography>
      </td>
      <td>
        <Typography>{serviceLimit}</Typography>
      </td>
      <td>
        <Typography>{availability}</Typography>
      </td>
      <td>
        <Typography>{used}</Typography>
      </td>
      <td>
        <Typography>{quota}</Typography>
      </td>
    </tr>
  );
};
