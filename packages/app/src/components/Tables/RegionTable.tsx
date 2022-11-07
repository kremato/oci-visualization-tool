import { ResourceDataRegion } from "common";

interface Props {
  serviceName: string;
  resourceDataRegionList: ResourceDataRegion[];
}

export const RegionTable = ({
  serviceName,
  resourceDataRegionList: resourceObjectRegionList,
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
          <th>Quota</th>
        </tr>
      </thead>
      <tbody>
        {resourceObjectRegionList.map((resourceObjectRegion) => {
          return (
            <tr key={resourceObjectRegion.resourceName}>
              <td>{resourceObjectRegion.resourceName}</td>
              <td>{resourceObjectRegion.available}</td>
              <td>{resourceObjectRegion.used}</td>
              <td>{resourceObjectRegion.quota}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
