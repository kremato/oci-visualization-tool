
export interface HierarchyHash {
  [id: string]: string[];
}

const array: HierarchyHash = { 'a': ['b'], 'b': ['c'] };

interface Props {
  id: string;
  depth: number;
}

export const Foo = ({ id, depth }: Props) => {
  if (id === "c") return <div>NONE</div>;

  return (
    <>
      <div>{`${"&nbsp".repeat(4 * depth)}${id}`}</div>
      <Foo id={array[id][0]} depth={depth+1}/>
    </>
  );
}
