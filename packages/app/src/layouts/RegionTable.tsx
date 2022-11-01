import {
  ResourceObjectAD,
  ResourceObjectRegion,
  ServiceScopeObject,
} from "../types/types";

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
      <tr>
        <th>{serviceName}</th>
      </tr>
      <tr>
        <th>Limit Name</th>
        <th>Available</th>
        <th>Used</th>
      </tr>
      {/* <tr>
        <td>January</td>
        <td>$100</td>
        <td rowSpan={2}>$50</td>
      </tr>
      <tr>
        <td>February</td>
        <td>$80</td>
      </tr> */}
      {resourceObjectRegionList.map((resourceObjectRegion) => {
        return (
          <tr>
            <td>{resourceObjectRegion.resourceName}</td>
            <td>{resourceObjectRegion.available}</td>
            <td>{resourceObjectRegion.used}</td>
          </tr>
        );
      })}
    </table>
  );
};
