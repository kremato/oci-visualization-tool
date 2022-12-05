import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete, { autocompleteClasses } from "@mui/material/Autocomplete";
import useMediaQuery from "@mui/material/useMediaQuery";
import ListSubheader from "@mui/material/ListSubheader";
import Popper from "@mui/material/Popper";
import { useTheme, styled } from "@mui/material/styles";
import { VariableSizeList, ListChildComponentProps } from "react-window";
import Typography from "@mui/material/Typography";
import { Names } from "common";
import { ListItemText, Checkbox } from "@mui/material";
import { capitalizeFirstLetter } from "../utils/capitalizeFirstLetter";
import { useRef } from "react";
import { createFilterOptions } from "@mui/material/Autocomplete";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { inputActions } from "../store/inputSlice";

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

  /* <Typography component="li" {...dataSet[0]} noWrap style={inlineStyle}>
      {dataSet}
    </Typography> */

  /* style={{ padding: 0, height: "100%" }} */
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

interface DropdownItem {
  primaryLabel: string;
  secondaryLabel: string;
  serviceName?: string;
}

interface Props {
  name: Names;
  options: DropdownItem[];
}

export default function Virtualize({ name, options }: Props) {
  const dispatch = useAppDispatch();
  const sortedOptions = options.sort(function (a, b) {
    return `${a.serviceName}`.localeCompare(`${b.serviceName}`);
  });

  const namePlural = name + "s";

  const filterOptions = createFilterOptions({
    stringify: (option: DropdownItem) =>
      `${option.primaryLabel} ${option.serviceName}`,
  });

  const handleChange = (selected: DropdownItem[]) => {
    const inputList = selected.map((item: DropdownItem) => {
      return { limitName: item.primaryLabel, serviceName: item.serviceName! };
    });

    dispatch(inputActions.replaceLimits(inputList));
  };

  return (
    <Autocomplete
      multiple
      disableCloseOnSelect
      PopperComponent={StyledPopper}
      ListboxComponent={ListboxComponent}
      options={sortedOptions}
      filterOptions={filterOptions}
      groupBy={(option) => `${option.serviceName}`}
      getOptionLabel={(option) => option.primaryLabel}
      //renderOption={(props, option) => [props, option] as React.ReactNode}
      onChange={(_event, newValue) => {
        handleChange(newValue);
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
      // TODO: Post React 18 update - validate this conversion, look like a hidden bug
      renderGroup={(params) => params as unknown as React.ReactNode}
      renderInput={(params) => (
        <TextField
          {...params}
          label={capitalizeFirstLetter(name)}
          placeholder={`Choose ${namePlural}`}
        />
      )}
      sx={{ width: "100%" }}
    />
  );
}
