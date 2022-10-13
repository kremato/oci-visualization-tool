import { Compartment } from "./Compartment";
import { SelectionList } from "../../layouts/SelectionLists";

export const CompartmentList = () => {
  return (
    <SelectionList subheader={"Compartments"}>
      <Compartment id="rootId" depth={0} />
    </SelectionList>
  );
};
