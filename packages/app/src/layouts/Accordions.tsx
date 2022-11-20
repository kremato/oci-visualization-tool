import { ResponseTree } from "common";
import { useAppSelector } from "../hooks/useAppSelector";
import { Collapsable } from "./Collapsable";

export const Accordions = () => {
  // TODO: render accordions based on user choice
  const compartmentNodes = useAppSelector(
    (state) => state.compartments.compartmentNodes
  );
  const serviceNodes = useAppSelector((state) => state.services.serviceNodes);

  return (
    <>
      {compartmentNodes.map((childNode) => {
        return <Collapsable node={childNode} />;
      })}
      <div>----------------------------------------</div>
      {serviceNodes.map((childNode) => {
        return <Collapsable node={childNode} />;
      })}
    </>
  );
};
