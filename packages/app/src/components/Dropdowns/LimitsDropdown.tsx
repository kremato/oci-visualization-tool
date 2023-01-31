import { Names } from "../../types/types";
import Virtualize from "../../layouts/DropdownWithReactWindow";
import { useDropdownItemsData } from "../../hooks/useDropdownItemsData";
import { MyLimitDefinitionSummary } from "common";

export const LimitsDropdown = () => {
  const limitDefinitionsPerLimitName =
    useDropdownItemsData<MyLimitDefinitionSummary[]>("limits");

  const options = limitDefinitionsPerLimitName.flatMap(
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
