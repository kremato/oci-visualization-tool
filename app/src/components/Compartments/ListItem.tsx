import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { useState } from "react";
import { useAppSelector } from "../../hooks/useAppSelector";

interface Props {
  id: string;
  depth: number;
}

export const ListItem = ({ id, depth }: Props) => {
  const [open, setOpen] = useState(true);
  const hierarchyHash = useAppSelector(
    (state) => state.compartments.hierarchyHash
  );
  
  const handleClick = () => {
    setOpen(!open);
  };

  if (Object.keys(hierarchyHash).length === 0) {
    return <div>Loading...</div>;
  }

  const currentId =
    id === "rootId" ? hierarchyHash[id][0].id : `${"+".repeat(4 * depth)}${id}`;
  const compartments =
    id === "rootId"
      ? hierarchyHash[hierarchyHash[id][0].id]
      : hierarchyHash[id];

  return (
    <ListItemButton onClick={compartments && handleClick}>
      <ListItemIcon>
        <AddIcon />
      </ListItemIcon>
      <ListItemText primary="Single-line item" secondary="Secondary text" />
    </ListItemButton>
  );
};
