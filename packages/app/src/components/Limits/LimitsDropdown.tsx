import { useAppSelector } from "../../hooks/useAppSelector";
import { Dropdown } from "../../layouts/Dropdown";
import { Dropdown2 } from "../../layouts/Dropdown2";
import { Names } from "common";
import Virtualize from "../../layouts/DropdownWithReactWindow";

export const LimitsDropdown = () => {
  const limitDefinitionsPerLimitName = useAppSelector(
    (state) => state.limitDefinitions.limitDefinitionsPerLimitName
  );

  const options = Object.values(limitDefinitionsPerLimitName).flatMap(
    (limitDefintionSummaries) => {
      return limitDefintionSummaries.map((limitDefinition) => {
        return {
          primaryLabel: `${limitDefinition.name}`,
          secondaryLabel: `${limitDefinition.description}`,
          serviceName: limitDefinition.serviceName,
        };
      });
    }
  );

  //return <Dropdown2 name={Names.Limit} options={options} />;
  return <Virtualize name={Names.Limit} options={options} />;
};
