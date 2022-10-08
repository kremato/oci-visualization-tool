import { useAppSelector } from "../../hooks/useAppSelector";
import ListSubheader from "@mui/material/ListSubheader";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import DraftsIcon from "@mui/icons-material/Drafts";
import SendIcon from "@mui/icons-material/Send";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import StarBorder from "@mui/icons-material/StarBorder";
import { useState } from "react";
import { CollapsableWrapper } from "./CollapsableWrapper";
import AddIcon from "@mui/icons-material/Add";

interface Props {
  id: string;
  depth: number;
  name?: string;
}

export const Compartment = ({ depth, id, name }: Props) => {
  const [open, setOpen] = useState(true);
  const hierarchyHash = useAppSelector(
    (state) => state.compartments.hierarchyHash
  );

  if (Object.keys(hierarchyHash).length === 0) {
    return <div>Loading...</div>;
  }

  const currentId = id === "rootId" ? hierarchyHash[id][0].id : id;
  const children =
    id === "rootId"
      ? hierarchyHash[hierarchyHash[id][0].id]
      : hierarchyHash[id];

  // it name is undefined, it means this is this rootId
  // compartment and that is why there is one element in children,
  // and that is the root compartment
  if (!name) {
    name = hierarchyHash[id][0].name;
  }
  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <>
      <ListItemButton
        onClick={children && handleClick}
      >
        <ListItemIcon>
          <AddIcon />
        </ListItemIcon>
        <ListItemText primary={name} secondary={currentId} />
      </ListItemButton>
      <CollapsableWrapper condition={children !== undefined} open={open}>
        <>
          {children?.map((compartment) => {
            return (
              <Compartment
                depth={depth + 1}
                id={compartment.id}
                name={compartment.name}
              />
            );
          })}
        </>
      </CollapsableWrapper>
    </>
  );
};