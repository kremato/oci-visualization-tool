import { useAppSelector } from "../../hooks/useAppSelector";

export const Compartments = () => {
  const compartmets = useAppSelector(
    (state) => state.compartments.compartmentsList
  );

  return <div>this is a Compartment</div>;
};
