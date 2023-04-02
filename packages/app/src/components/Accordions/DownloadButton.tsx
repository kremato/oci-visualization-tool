import Button from "@mui/material/Button";
import DownloadIcon from "@mui/icons-material/Download";
import { useAppSelector } from "../../hooks/useAppSelector";
import { RootState } from "../../store/store";
import { ResponseTreeNode, UniqueLimit } from "common";

const createCSVRows = (
  uniqueLimit: UniqueLimit,
  path: string[]
): string[][] => {
  const rows: string[][] = [];
  for (const resourceObject of uniqueLimit.resources) {
    const row = [
      ...path,
      uniqueLimit.limitName,
      ...Object.values(resourceObject),
    ];
    rows.push(row);
  }
  return rows;
};

const makePath = (
  responseTreeNode: ResponseTreeNode,
  path: string[],
  csvLog: string[][]
): void => {
  if (responseTreeNode.children.length !== 0) {
    for (const node of responseTreeNode.children) {
      path.push(responseTreeNode.name);
      makePath(node, path, csvLog);
      path.pop();
    }
    return;
  }

  if (responseTreeNode.limits) {
    path.push(responseTreeNode.name);
    for (const uniqueLimit of responseTreeNode.limits) {
      const rows = createCSVRows(uniqueLimit, path);
      if (rows.length > 0) csvLog.push(...rows);
    }
    path.pop();
  }
};

const convertToCSV = (
  responseTreeRootNodes: ResponseTreeNode[],
  csvTableHeaders: string[]
): string => {
  let csvLog: string[][] = [csvTableHeaders];
  for (const node of responseTreeRootNodes) {
    makePath(node, [], csvLog);
  }

  let csvString: string = "";
  for (const row of csvLog) {
    csvString = csvString + "\n" + row.toString();
  }

  return csvString;
};

const getChildLimits = (node: ResponseTreeNode): UniqueLimit[] => {
  if (node.limits) {
    return node.limits;
  }

  let limits: UniqueLimit[] = [];
  for (const child of node.children) {
    limits = limits.concat(getChildLimits(child));
  }

  return limits;
};

const convertToJSON = (responseTreeRootNodes: ResponseTreeNode[]) => {
  let limits: UniqueLimit[] = [];
  for (const node of responseTreeRootNodes) {
    limits = limits.concat(getChildLimits(node));
  }
  return JSON.stringify(limits);
};

const downloadFile = (data: string, fileName: string, fileType: string) => {
  const blob = new Blob([data], {
    type: fileType,
  });
  const link = document.createElement("a");
  link.download = fileName;
  link.href = window.URL.createObjectURL(blob);
  link.click();
  link.remove();
};

interface Props {
  buttonText: string;
  fileName: string;
  fileType: string;
  stateCallback: (state: RootState) => ResponseTreeNode[];
  parseAsCSV?: boolean;
  asCompartmentNodes?: boolean;
}

export const DownloadButton = ({
  buttonText,
  fileName,
  fileType,
  stateCallback,
  parseAsCSV = false,
  asCompartmentNodes = true,
}: Props) => {
  const rootNodes = useAppSelector(stateCallback);

  const exportToFile = () => {
    const csvTableHeaders = [
      asCompartmentNodes ? "COMPARTMENT" : "SERVICE",
      asCompartmentNodes ? "REGION" : "COMPARTMENT",
      asCompartmentNodes ? "SERVICE" : "REGION",
      "LIMIT",
      "SCOPE",
      "SERVICE LIMIT",
      "AVAILABLE",
      "USED",
      "QUOTA",
    ];

    downloadFile(
      parseAsCSV
        ? convertToCSV(rootNodes, csvTableHeaders)
        : convertToJSON(rootNodes),
      fileName,
      fileType
    );
  };

  return (
    <Button
      variant="contained"
      endIcon={<DownloadIcon />}
      onClick={exportToFile}
    >
      {buttonText}
    </Button>
  );
};
