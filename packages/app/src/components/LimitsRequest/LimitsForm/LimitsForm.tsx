import { Stack, Box, Checkbox, FormControlLabel } from "@mui/material";
import { CompartmentsDropdown } from "./Dropdowns/CompartmentsDropdown";
import { LimitsDropdown } from "./Dropdowns/LimitsDropdown";
import { RegionsDropdown } from "./Dropdowns/RegionsDropdown";
import { ServicesDropdown } from "./Dropdowns/ServicesDropdown";
import { SendButton } from "./SendButton";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Controller } from "react-hook-form";
import { fetchLimitsData } from "../../../utils/fetchLimitsData";
import { LimitsFormEntries, LimitsFormValues } from "../../../types/types";
import store from "../../../store/store";
import { useAppDispatch } from "../../../hooks/useAppDispatch";
import { fetchToken } from "../../../store/tokenActionCreators";
import { useAppSelector } from "../../../hooks/useAppSelector";

export const LimitsForm = () => {
  const { handleSubmit, control, reset } = useForm<LimitsFormValues>({
    defaultValues: { limits: [] },
  });
  const dispatch = useAppDispatch();
  const currentProfile = useAppSelector((state) => state.profile.profile);
  const [formData, setFormData] = useState<LimitsFormValues | undefined>(
    undefined
  );

  useEffect(() => {
    reset();
  }, [currentProfile]);

  useEffect(() => {
    if (formData === undefined) return;

    const fetchFormData = async () => {
      if (store.getState().token.token === undefined) {
        await dispatch(fetchToken());
      }
      fetchLimitsData(formData);
    };

    fetchFormData();
  }, [formData]);

  return (
    <Box
      component={"form"}
      onSubmit={handleSubmit((data) => {
        setFormData(data);
      })}
      noValidate
      width={"100%"}
    >
      <Stack direction={"row"} width={"100%"}>
        <CompartmentsDropdown control={control} />
        <RegionsDropdown control={control} />
        <ServicesDropdown control={control} />
        <LimitsDropdown control={control} />
      </Stack>
      <Stack
        direction={"row"}
        justifyContent={"space-between"}
        p={"0.5rem 0rem 0.5rem 0rem"}
        width={"100%"}
      >
        <FormControlLabel
          control={
            <Controller
              name={LimitsFormEntries.InvalidateCache}
              control={control}
              defaultValue={false}
              render={({ field }) => (
                <Checkbox {...field} checked={field.value || false} />
              )}
            />
          }
          label={"Invalidate cache"}
        />
        <SendButton text={"Send"} />
      </Stack>
    </Box>
  );
};
