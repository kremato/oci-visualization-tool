import { useAppSelector } from "../../hooks/useAppSelector";
import { Dropdown } from "../../layouts/Dropdown";
import { Names } from "common";

export const LimitsDropdown = () => {
  const limitDefinitionsPerLimitName = useAppSelector(
    (state) => state.limitDefinitions.limitDefinitionsPerLimitName
  );

  const options = Object.values(limitDefinitionsPerLimitName).flatMap(
    (limitDefintionSummaries) => {
      return limitDefintionSummaries.map((limitDefinition) => {
        return {
          primaryLabel: `${limitDefinition.name} (${limitDefinition.serviceName})`,
          secondaryLabel: `${limitDefinition.description} (${limitDefinition.serviceName})`,
        };
      });
    }
  );

  return <Dropdown name={Names.Limit} options={options} />;
};
