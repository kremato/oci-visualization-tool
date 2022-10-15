import { useAppSelector } from "../../hooks/useAppSelector";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import { IconButton, ListItem, ListItemText } from "@mui/material";
import { CollapsableWrapper } from "./CollapsableWrapper";
import { useState } from "react";
import { ModifiableCheckbox } from "../../layouts/ModifiableCheckbox";

interface Props {
  id: string;
  depth: number;
  name: string;
}

export const Compartment = ({ depth, id, name }: Props) => {
  const [open, setOpen] = useState(true);
  const hierarchyHash = useAppSelector(
    (state) => state.compartments.hierarchyHash
  );

  // this is undefined in case there are no children
  const children = hierarchyHash[id];

  const icon = open ? <RemoveIcon /> : <AddIcon />;

  const primary = (
    <div>
      <span>{name}</span>
      <ModifiableCheckbox id={id} type={"compartment"} />
    </div>
  );

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
          primary={primary}
          secondary={id}
          sx={{ mt: 0, mb: 0, lineHeight: 1.25 }}
          primaryTypographyProps={{
            sx: { lineHeight: 1.25, "& span": { padding: 0 } },
          }}
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
                key={compartment.id}
              />
            );
          })}
        </>
      </CollapsableWrapper>
    </>
  );
};
