import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { SocketStatus } from "./SocketStatus";

export const Header = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            OCI Visualization Tool
          </Typography>
          <SocketStatus />
          <Button color="inherit">Help</Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
};
