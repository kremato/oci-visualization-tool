import { ResourceObjectAD, ServiceScopeObject } from "../types/types";

interface Props {
  resourceObjectADList: ResourceObjectAD[];
}

export const ADTable = ({ resourceObjectADList }: Props) => {
  return (
    <table>
      <tr>
        <th>AD Scope</th>
      </tr>
      <tr>
        <th>Limit Name</th>
        <th>Availibility Domain</th>
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
      {resourceObjectADList.map((resourceObjectAD) => {
        return (
          <tr>
            <td rowSpan={resourceObjectAD.availibilityDomainList.length}>
              {resourceObjectAD.resourceName}
            </td>
            {resourceObjectAD.availibilityDomainList.map((limits) => {
              return (
                <>
                  <td>{limits.aDName}</td>
                  <td>{limits.available}</td>
                  <td>{limits.used}</td>
                </>
              );
            })}
          </tr>
        );
      })}
    </table>
  );
};
