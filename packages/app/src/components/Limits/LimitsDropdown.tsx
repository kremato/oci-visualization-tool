import { useAppSelector } from "../../hooks/useAppSelector";
import { Names } from "../../types/types";
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

  return <Virtualize name={Names.Limit} options={options} />;
};
