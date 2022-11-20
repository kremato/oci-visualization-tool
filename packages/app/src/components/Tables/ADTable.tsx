import React from "react";
import { useAppSelector } from "../../hooks/useAppSelector";
import { Typography } from "@mui/material";
import { UniqueLimit } from "common";

interface Props {
  limits: UniqueLimit[];
}

export const ADTable = ({ limits }: Props) => {
  if (limits.length === 0)
    return <Typography>No table cause no limits provided</Typography>;

  const sumADResources = useAppSelector((state) => state.input.sumADResources);
  const showEmptyServiceLimits = useAppSelector(
    (state) => state.input.emptyServiceLimits
  );

  return (
    <table>
      <thead>
        {/* <tr>
          <th>{serviceName}</th>
        </tr> */}
        <tr>
          <th>Limit Name</th>
          <th>Availibility Domain</th>
          <th>Available</th>
          <th>Used</th>
          <th>Quota</th>
        </tr>
      </thead>
      <tbody>
        {limits.map((uniqueLimit) => {
          return <div></div>;
        })}
      </tbody>
    </table>
  );

  /* return (
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
          <th>Quota</th>
        </tr>
      </thead>
      <tbody>
        {limits.map((resourceObjectAD) => {
          let resSum = { available: 0, used: 0 };
          if (sumADResources) {
            for (const limit of resourceObjectAD.availibilityDomainList) {
              resSum.available += Number(limit.available);
              resSum.used += Number(limit.used);
            }
          }

          const ADCells = sumADResources ? (
            <React.Fragment>
              <td>SUM</td>
              <td>{resSum.available}</td>
              <td>{resSum.used}</td>
              <td>n/a</td>
            </React.Fragment>
          ) : (
            resourceObjectAD.availibilityDomainList.map((limits) => {
              return (
                <React.Fragment key={limits.aDName}>
                  <td>{limits.aDName}</td>
                  <td>{limits.available}</td>
                  <td>{limits.used}</td>
                  <td>{limits.quota}</td>
                </React.Fragment>
              );
            })
          );

          const hide =
            !showEmptyServiceLimits &&
            ((sumADResources && resSum.available === 0) ||
              resourceObjectAD.availibilityDomainList[0].available === "0");
          return (
            <tr
              key={resourceObjectAD.resourceName}
              style={{
                visibility: hide ? "hidden" : "visible",
                display: hide ? "none" : "table-row",
              }}
            >
              <td
                rowSpan={
                  sumADResources
                    ? 1
                    : resourceObjectAD.availibilityDomainList.length
                }
              >
                {resourceObjectAD.resourceName}
              </td>
              {resourceObjectAD.availibilityDomainList.map((limits) => {
                return (
                  <React.Fragment key={limits.aDName}>
                    <td>{limits.aDName}</td>
                    <td>{limits.available}</td>
                    <td>{limits.used}</td>
                    <td>{limits.quota}</td>
                  </React.Fragment>
                );
              })}
              {ADCells}
            </tr>
          );
        })}
      </tbody>
    </table>
  ); */
};
