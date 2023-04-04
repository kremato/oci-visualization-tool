import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete, { autocompleteClasses } from "@mui/material/Autocomplete";
import useMediaQuery from "@mui/material/useMediaQuery";
import ListSubheader from "@mui/material/ListSubheader";
import Popper from "@mui/material/Popper";
import { useTheme, styled } from "@mui/material/styles";
import { VariableSizeList, ListChildComponentProps } from "react-window";
import Typography from "@mui/material/Typography";
import { DropdownItem } from "../types/types";
import { ListItemText, Checkbox } from "@mui/material";
import { capitalizeFirstLetter } from "../utils/capitalizeFirstLetter";
import { useState } from "react";
import { createFilterOptions } from "@mui/material/Autocomplete";
import { Control, Controller, ControllerRenderProps } from "react-hook-form";
import { LimitsFormEntries, LimitsFormValues } from "../types/types";

const LISTBOX_PADDING = 8; // px

function renderRow(props: ListChildComponentProps) {
  const { data, index, style } = props;
  const dataSet = data[index];
  const inlineStyle = {
    ...style,
    top: (style.top as number) + LISTBOX_PADDING,
  };

  if (dataSet.hasOwnProperty("group")) {
    return (
      <ListSubheader key={dataSet.key} component="div" style={inlineStyle}>
        {dataSet.group}
      </ListSubheader>
    );
  }

  return (
    <Typography component="div" {...dataSet[0]} noWrap style={inlineStyle}>
      {dataSet}
    </Typography>
  );
}

const OuterElementContext = React.createContext({});

const OuterElementType = React.forwardRef<HTMLDivElement>((props, ref) => {
  const outerProps = React.useContext(OuterElementContext);
  return <div ref={ref} {...props} {...outerProps} />;
});

function useResetCache(data: any) {
  const ref = React.useRef<VariableSizeList>(null);
  React.useEffect(() => {
    if (ref.current != null) {
      ref.current.resetAfterIndex(0, true);
    }
  }, [data]);
  return ref;
}

// Adapter for react-window
const ListboxComponent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLElement>
>(function ListboxComponent(props, ref) {
  const { children, ...other } = props;
  const itemData: React.ReactChild[] = [];
  (children as React.ReactChild[]).forEach(
    (item: React.ReactChild & { children?: React.ReactChild[] }) => {
      itemData.push(item);
      itemData.push(...(item.children || []));
    }
  );

  const theme = useTheme();
  const smUp = useMediaQuery(theme.breakpoints.up("sm"), {
    noSsr: true,
  });
  const itemCount = itemData.length;
  const itemSize = smUp ? 48 : 48;

  const getChildSize = (child: React.ReactChild) => {
    if (child.hasOwnProperty("group")) {
      return 48;
    }
    return itemSize;
  };

  const getHeight = () => {
    if (itemCount > 8) {
      return 8 * itemSize;
    }
    return itemData.map(getChildSize).reduce((a, b) => a + b, 0);
  };

  const gridRef = useResetCache(itemCount);

  return (
    <div ref={ref}>
      <OuterElementContext.Provider value={other}>
        <VariableSizeList
          itemData={itemData}
          height={getHeight() + 2 * LISTBOX_PADDING}
          width="100%"
          ref={gridRef}
          outerElementType={OuterElementType}
          innerElementType="ul"
          itemSize={(index) => getChildSize(itemData[index])}
          overscanCount={5}
          itemCount={itemCount}
        >
          {renderRow}
        </VariableSizeList>
      </OuterElementContext.Provider>
    </div>
  );
});

const StyledPopper = styled(Popper)({
  [`& .${autocompleteClasses.listbox}`]: {
    boxSizing: "border-box",
    "& ul": {
      padding: 0,
      margin: 0,
    },
  },
});

interface Props {
  name: LimitsFormEntries;
  options: DropdownItem[];
  control: Control<LimitsFormValues, any>;
}

export default function VirtualizedDropdown({ name, options, control }: Props) {
  const [value, setValue] = useState<DropdownItem[]>([]);
  const [inputValue, setInputValue] = useState("");
  const sortedOptions = options.sort(function (a, b) {
    return `${a.serviceName}`.localeCompare(`${b.serviceName}`);
  });

  const filterOptions = createFilterOptions({
    stringify: (option: DropdownItem) =>
      `${option.primaryLabel} ${option.serviceName}`,
  });

  const handleChange = (
    selected: DropdownItem[],
    field: ControllerRenderProps<LimitsFormValues, any>
  ) => {
    const inputList = selected.map((item: DropdownItem) => {
      return { limitName: item.primaryLabel, serviceName: item.serviceName! };
    });
    setValue(selected);
    field.onChange(inputList);
  };

  return (
    <Controller
      control={control}
      name={name}
      rules={{
        required: false,
      }}
      defaultValue={[]}
      render={({ field }) => (
        <Autocomplete
          {...field}
          multiple
          disableCloseOnSelect
          PopperComponent={StyledPopper}
          ListboxComponent={ListboxComponent}
          options={sortedOptions}
          filterOptions={filterOptions}
          groupBy={(option) => `${option.serviceName}`}
          getOptionLabel={(option) => option.primaryLabel}
          onChange={(_event, newValue) => {
            handleChange(newValue, field);
          }}
          renderOption={(props, option, { selected }) => (
            <li {...props} style={{ padding: 0, height: "100%" }}>
              <Checkbox size="small" checked={selected} />
              <ListItemText
                primary={option.primaryLabel}
                secondary={
                  option.primaryLabel != option.secondaryLabel &&
                  option.secondaryLabel
                }
                sx={{ mt: 0, mb: 0 }}
                primaryTypographyProps={{
                  sx: {
                    wordBreak: "break-word",
                    lineHeight: 1.25,
                    whiteSpace: "initial",
                  },
                }}
                secondaryTypographyProps={{
                  sx: {
                    wordBreak: "break-word",
                    lineHeight: 1.25,
                    whiteSpace: "initial",
                  },
                }}
              />
            </li>
          )}
          renderGroup={(params) => params as unknown as React.ReactNode}
          renderInput={(params) => (
            <TextField
              {...params}
              label={capitalizeFirstLetter(name)}
              placeholder={`Choose ${name}`}
              helperText="This field is optional"
            />
          )}
          fullWidth={true}
          value={value}
          inputValue={inputValue}
          onInputChange={(_event, newInputValue) =>
            setInputValue(newInputValue)
          }
        />
      )}
    />
  );
}
