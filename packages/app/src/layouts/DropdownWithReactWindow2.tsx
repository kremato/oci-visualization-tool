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
import { ReactElement, useRef } from "react";
import { createFilterOptions } from "@mui/material/Autocomplete";
import AutoSizer from "react-virtualized-auto-sizer";

const LISTBOX_PADDING = 8; // px

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
  const rowHeights = useRef({});
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

  const listRef = useResetCache(itemCount);

  function setRowHeight(index: number, size: number) {
    listRef?.current?.resetAfterIndex(0);
    rowHeights.current = { ...rowHeights.current, [index]: size };
  }

  function scrollToBottom() {
    listRef?.current?.scrollToItem(itemData.length - 1, "end");
  }

  function getRowHeight(index: number) {
    return rowHeights.current[index] + 8 || 82;
  }

  function renderRow(props: ListChildComponentProps) {
    // TODO: useRef<HTMLDivElement>(Object.create(null))
    const rowRef = useRef<HTMLDivElement>(null);
    const { data, index, style } = props;
    const dataSet = data[index];
    const inlineStyle = {
      ...style,
      top: (style.top as number) + LISTBOX_PADDING,
    };

    React.useEffect(() => {
      if (rowRef.current) {
        setRowHeight(index, rowRef.current?.clientHeight);
      }
      // eslint-disable-next-line
    }, [rowRef]);

    if (dataSet.hasOwnProperty("group")) {
      return (
        <ListSubheader
          ref={rowRef}
          key={dataSet.key}
          component="div"
          style={inlineStyle}
        >
          {dataSet.group}
        </ListSubheader>
      );
    }

    return (
      <Typography
        ref={rowRef}
        component="div"
        {...dataSet[0]}
        noWrap
        style={inlineStyle}
      >
        {dataSet}
      </Typography>
    );
  }

  return (
    <div
      ref={ref}
      className="KKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKk"
      style={{ flex: "1 1 auto", height: "40vh" }}
    >
      <OuterElementContext.Provider value={other}>
        <AutoSizer
          style={{
            height: "100%",
            width: "100%",
          }}
        >
          {({ height, width }) => {
            console.log("FIRED");
            return (
              <VariableSizeList
                itemData={itemData}
                //height={getHeight() + 2 * LISTBOX_PADDING}
                height={height}
                width="100%"
                //ref={gridRef}
                ref={listRef}
                outerElementType={OuterElementType}
                innerElementType="ul"
                //itemSize={(index) => getChildSize(itemData[index])}
                itemSize={getRowHeight}
                overscanCount={5}
                itemCount={itemCount}
              >
                {renderRow}
              </VariableSizeList>
            );
          }}
        </AutoSizer>
      </OuterElementContext.Provider>
    </div>
  );

  /* return (
    <div style={{ display: "flex", flexGrow: 1, height: "100%" }}>
      <AutoSizer style={{ height: "100%", width: "100%" }}>
        {({ height, width }) => {
          console.log("fired");
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
        }}
      </AutoSizer>
    </div>
  ); */
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
  const sortedOptions = options.sort(function (a, b) {
    return `${a.serviceName}`.localeCompare(`${b.serviceName}`);
  });

  const namePlural = name + "s";

  const filterOptions = createFilterOptions({
    stringify: (option: DropdownItem) =>
      `${option.primaryLabel} ${option.serviceName}`,
  });

  return (
    <Autocomplete
      multiple
      disableCloseOnSelect
      sx={{ width: "100%" }}
      PopperComponent={StyledPopper}
      ListboxComponent={ListboxComponent}
      options={sortedOptions}
      filterOptions={filterOptions}
      groupBy={(option) => `${option.serviceName}`}
      getOptionLabel={(option) => option.primaryLabel}
      //renderOption={(props, option) => [props, option] as React.ReactNode}
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
    />
  );
}
