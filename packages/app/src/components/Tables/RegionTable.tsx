import { ResourceObjectRegion } from "common";

interface Props {
  serviceName: string;
  resourceObjectRegionList: ResourceObjectRegion[];
}

export const RegionTable = ({
  serviceName,
  resourceObjectRegionList,
}: Props) => {
  return (
    <table>
      <thead>
        <tr>
          <th>{serviceName}</th>
        </tr>
        <tr>
          <th>Limit Name</th>
          <th>Available</th>
          <th>Used</th>
        </tr>
      </thead>
      <tbody>
        {resourceObjectRegionList.map((resourceObjectRegion) => {
          return (
            <tr key={resourceObjectRegion.resourceName}>
              <td>{resourceObjectRegion.resourceName}</td>
              <td>{resourceObjectRegion.available}</td>
              <td>{resourceObjectRegion.used}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
