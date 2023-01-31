import { AppBar, Box, Toolbar, Typography, Button, Stack } from "@mui/material";
import { SocketStatus } from "./SocketStatus";
import { ApiStatus } from "./ApiStatus";

export const Header = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            OCI Visualization Tool
          </Typography>
          <Stack direction="row" spacing={2}>
            <ApiStatus />
            <SocketStatus />
          </Stack>
          <Button color="inherit">Help</Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
};
