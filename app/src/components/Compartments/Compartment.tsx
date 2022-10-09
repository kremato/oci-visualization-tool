import { useAppSelector } from "../../hooks/useAppSelector";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import { IconButton, ListItem, ListItemText } from "@mui/material";
import { CollapsableWrapper } from "./CollapsableWrapper";
import { useState } from "react";

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
  // this is undefined in case there are no children
  const children =
    id === "rootId"
      ? hierarchyHash[hierarchyHash[id][0].id]
      : hierarchyHash[id];

  const icon = open ? <RemoveIcon /> : <AddIcon />;

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
      <ListItem sx={{ pt: 0, pr: 0, pb: 0, pl: depth * 2 }}>
        <IconButton
          sx={{ p: 0, minWidth: "10%" }}
          aria-label={open ? "minimize" : "expand"}
          onClick={handleClick}
        >
          {children && icon}
        </IconButton>
        <ListItemText
          primary={name}
          secondary={currentId}
          sx={{ mt: 0, mb: 0, lineHeight: 1.25 }}
          primaryTypographyProps={{ sx: { lineHeight: 1.25 } }}
          secondaryTypographyProps={{ sx: { lineHeight: 1.25 } }}
        />
      </ListItem>
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
