import { ResourceDataAD } from "common";
import React from "react";

interface Props {
  serviceName: string;
  resourceObjectADList: ResourceDataAD[];
}

export const ADTable = ({ serviceName, resourceObjectADList }: Props) => {
  return (
    <table>
      <thead>
        <tr>
          <th>{serviceName}</th>
        </tr>
        <tr>
          <th>Limit Name</th>
          <th>Availibility Domain</th>
          <th>Available</th>
          <th>Used</th>
        </tr>
      </thead>
      <tbody>
        {resourceObjectADList.map((resourceObjectAD) => {
          return (
            <tr key={resourceObjectAD.resourceName}>
              <td rowSpan={resourceObjectAD.availibilityDomainList.length}>
                {resourceObjectAD.resourceName}
              </td>
              {resourceObjectAD.availibilityDomainList.map((limits) => {
                return (
                  <React.Fragment key={limits.aDName}>
                    <td>{limits.aDName}</td>
                    <td>{limits.available}</td>
                    <td>{limits.used}</td>
                  </React.Fragment>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
