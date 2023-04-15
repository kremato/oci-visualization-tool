import { useDropdownItemsData } from "../../../../hooks/useDropdownItemsData";
import { MyLimitDefinitionSummary } from "common";
import { Control } from "react-hook-form";
import { LimitsFormEntries, LimitsFormValues } from "../../../../types/types";
import { Dropdown } from "./Dropdown";

interface Props {
  control: Control<LimitsFormValues, any>;
}

export const LimitsDropdown = ({ control }: Props) => {
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
  return (
    <Dropdown
      name={LimitsFormEntries.Limits}
      options={options}
      control={control}
    />
  );
};
