import { ResourceDataRegion } from "common";
import { useAppSelector } from "../../hooks/useAppSelector";

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
          const showEmptyServiceLimits = useAppSelector(
            (state) => state.input.emptyServiceLimits
          );

          const hide =
            !showEmptyServiceLimits && resourceObjectRegion.available === "0";

          return (
            <tr
              key={resourceObjectRegion.resourceName}
              style={{
                visibility: hide ? "hidden" : "visible",
                display: hide ? "none" : "table-row",
              }}
            >
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
