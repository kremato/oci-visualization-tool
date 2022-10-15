import { Compartment } from "./Compartment";
import { SelectionList } from "../../layouts/SelectionLists";
import { useAppSelector } from "../../hooks/useAppSelector";

export const CompartmentList = () => {
  const hierarchyHash = useAppSelector(
    (state) => state.compartments.hierarchyHash
  );

  if (Object.keys(hierarchyHash).length === 0) {
    return <div>Loading Compartments...</div>;
  }

  const id = hierarchyHash["rootId"][0].id;
  const name = hierarchyHash["rootId"][0].name;

  return (
    <SelectionList subheader={"Compartments"}>
      <Compartment id={id} depth={0} name={name} />
    </SelectionList>
  );
};
