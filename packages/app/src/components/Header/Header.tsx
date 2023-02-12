import { AppBar, Box, Toolbar, Typography, Button, Stack } from "@mui/material";
import { SocketStatus } from "./SocketStatus";
import { ApiStatus } from "./ApiStatus";
import { useState } from "react";
import { HelpDialog } from "../Help/HelpDialog";

export const Header = () => {
  const [openDialog, setOpenDialog] = useState(false);

  const handleCloseDialog = () => setOpenDialog(false);

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
          <Button color="inherit" onClick={() => setOpenDialog(true)}>
            Help
          </Button>
          <HelpDialog open={openDialog} handleClose={handleCloseDialog} />
        </Toolbar>
      </AppBar>
    </Box>
  );
};
