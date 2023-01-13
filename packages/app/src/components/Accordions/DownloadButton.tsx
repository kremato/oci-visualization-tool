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
  for (const resourceObject of uniqueLimit.resourceAvailability) {
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

const convertToCSV = (responseTreeRootNodes: ResponseTreeNode[]): string => {
  let csvLog: string[][] = [
    [
      "COMPARTMENT",
      "REGION",
      "SERVICE",
      "LIMIT",
      "AVAILABILITY DOMAIN",
      "SERVICE LIMIT",
      "AVAILABLE",
      "USED",
      "QUOTA",
    ],
  ];
  for (const node of responseTreeRootNodes) {
    makePath(node, [], csvLog);
  }

  let csvString: string = "";
  for (const row of csvLog) {
    csvString = csvString + "\n" + row.toString();
  }

  return csvString;
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
}

export const DownloadButton = ({
  buttonText,
  fileName,
  fileType,
  stateCallback,
  parseAsCSV = false,
}: Props) => {
  const compartmentNodes = useAppSelector(stateCallback);

  const exportToFile = (fileName: string, fileType: string) => {
    downloadFile(
      parseAsCSV
        ? convertToCSV(compartmentNodes)
        : JSON.stringify(compartmentNodes),
      fileName,
      fileType
    );
  };

  return (
    <Button
      variant="contained"
      endIcon={<DownloadIcon />}
      onClick={() => exportToFile(fileName, fileType)}
    >
      {buttonText}
    </Button>
  );
};
