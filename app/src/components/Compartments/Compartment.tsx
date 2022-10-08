import { useAppSelector } from "../../hooks/useAppSelector";

interface Props {
  id: string;
  depth: number;
}

export const Compartment = ({ id, depth }: Props) => {
  const hierarchyHash = useAppSelector(
    (state) => state.compartments.hierarchyHash
  );

  if (Object.keys(hierarchyHash).length === 0) {
    return <div>Loading...</div>;
  }

  const currentId =
    id === "rootId" ? hierarchyHash[id][0].id : `${"+".repeat(4 * depth)}${id}`;
  const compartments =
    id === "rootId"
      ? hierarchyHash[hierarchyHash[id][0].id]
      : hierarchyHash[id];

  console.log(`Som v ${currentId}`);
  console.log(compartments);

  return (
    <>
      <div>{currentId}</div>
      {compartments?.map((compartment) => {
        return <Compartment id={compartment.id} depth={depth + 1} />;
      })}
    </>
  );
};
