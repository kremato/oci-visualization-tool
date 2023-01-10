import Button from "@mui/material/Button";
import DownloadIcon from "@mui/icons-material/Download";
import { useAppSelector } from "../../hooks/useAppSelector";
import { RootState } from "../../store/store";
import { ResponseTreeNode } from "common";

const downloadFile = (data: string, fileName: string, fileType: string) => {
  const blob = new Blob([data], { type: fileType });

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
}: Props) => {
  const compartmentNodes = useAppSelector(stateCallback);

  const exportToFile = (fileName: string, fileType: string) => {
    downloadFile(JSON.stringify(compartmentNodes), fileName, fileType);
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
